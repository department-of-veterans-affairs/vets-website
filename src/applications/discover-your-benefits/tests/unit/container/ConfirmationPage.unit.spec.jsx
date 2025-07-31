import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import { BENEFITS_LIST } from '../../../constants/benefits';

// Mock benefit data
const mockBenefits = [
  {
    id: '1',
    name: 'Education',
    category: 'Education',
    isTimeSensitive: false,
  },
  {
    id: '2',
    name: 'Careers and Employment',
    category: 'Careers',
    isTimeSensitive: false,
  },
  {
    id: '3',
    name: 'More Support',
    category: 'Support',
    isTimeSensitive: false,
  },
];

const form1 = {
  formId: 'T-QSTNR',
  data: {
    disabilityRating: 'No',
    'view:disabilityEligibility': {},
    characterOfDischarge: 'honorable',
    separation: 'upTo6mo',
    militaryServiceCompleted: 'No',
    militaryServiceCurrentlyServing: 'No',
    militaryServiceTotalTimeServed: 'More than 3 years',
    goals: {
      setACareerPath: true,
    },
    privacyAgreementAccepted: true,
  },
};

const form2 = {
  formId: 'T-QSTNR',
  data: {
    privacyAgreementAccepted: true,
  },
};

const getData = (resultsData = [], formObject = form1, queryObject = {}) => ({
  props: {
    formConfig,
    route: {
      path: 'confirmation',
    },
    router: {
      push: sinon.mock(),
      replace: sinon.mock(),
      goBack: sinon.mock(),
    },
    displayResults: sinon.mock(),
    setSubmission: sinon.mock(),
    location: {
      basename: '/discover-your-benefits',
      pathname: '/confirmation',
      query: queryObject,
      search: '',
    },
  },
  mockStore: {
    getState: () => ({
      form: formObject,
      results: {
        data: resultsData,
        error: null,
        isError: false,
        isLoading: false,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

const subject = ({ mockStore, props }) =>
  render(
    <Provider store={mockStore}>
      <ConfirmationPage {...props} />
    </Provider>,
  );

describe('<ConfirmationPage>', () => {
  sinon.stub(Date, 'getTime');

  it('should render results page when query string is provided', () => {
    const { mockStore, props } = getData();
    props.location.query.benefits = 'SVC,FHV';
    const { container } = subject({ mockStore, props });

    expect(container.querySelector('#results-container')).to.exist;
  });

  it('should handle back link', async () => {
    sinon.stub(window, 'history').value({ length: 10 });

    const { mockStore, props } = getData();
    const { container } = subject({ mockStore, props });

    const backLink = container.querySelector('[data-testid="back-link"]');
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(props.router.goBack.called).to.be.true;
    });
  });

  it('calls handleResultsData on componentDidUpdate when new results appear', () => {
    const { mockStore, props } = getData([], form2);
    const { rerender } = subject({ mockStore, props });

    const updatedResults = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        results: {
          data: mockBenefits,
          error: null,
          isError: false,
          isLoading: false,
        },
      }),
    };

    rerender(
      <Provider store={updatedResults}>
        <ConfirmationPage {...props} />
      </Provider>,
    );
    expect(document.querySelectorAll('va-link').length).to.be.above(0);
  });

  it('renders an error alert when results has an error', () => {
    const errorStore = {
      getState: () => ({
        form: form2,
        results: {
          data: [],
          error: 'Something went wrong',
          isError: true,
          isLoading: false,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const { container } = subject({
      mockStore: errorStore,
      props: getData().props,
    });

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'info');
  });

  it('should show a loading indicator when results are loading', () => {
    const loadingStore = {
      getState: () => ({
        form: form2,
        results: {
          data: [],
          error: null,
          isError: false,
          isLoading: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const { container } = subject({
      mockStore: loadingStore,
      props: getData().props,
    });

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
  });
});

describe('ConfirmationPage - sortBenefits and filterBenefits', () => {
  sinon.stub(Date, 'getTime');

  const dispatchFilterApply = (filterComponent, filters) => {
    filterComponent.dispatchEvent(
      new CustomEvent('vaFilterApply', {
        detail: filters,
        bubbles: true,
      }),
    );
  };

  it('should sort benefits by goal', () => {
    const { mockStore, props } = getData(mockBenefits);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const sortSelect = container.querySelector('va-search-filter');
    sortSelect.dispatchEvent(
      new CustomEvent('vaFilterApply', {
        detail: [
          {
            label: 'Sort',
            category: [{ id: 'goal', label: 'Goal' }],
          },
        ],
        bubbles: true,
      }),
    );

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames[0]).to.contain('Education');
  });

  it('should sort benefits alphabetically', () => {
    const { mockStore, props } = getData(mockBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const filterComponent = container.querySelector('va-search-filter');

    dispatchFilterApply(filterComponent, [
      {
        label: 'Sort',
        category: [{ id: 'alphabetical', label: 'Alphabetical' }],
      },
    ]);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames[0]).to.contain('Careers');
    expect(benefitNames[1]).to.contain('Education');
  });

  it('should filter benefits by category', () => {
    const { mockStore, props } = getData(mockBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const filterComponent = container.querySelector('va-search-filter');

    dispatchFilterApply(filterComponent, [
      {
        label: 'Benefit Type',
        category: [{ id: 'Careers', label: 'Careers and employment' }],
      },
    ]);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames).to.have.lengthOf(1);
    expect(benefitNames[0]).to.contain('Careers');
  });

  it('should show all benefits when "All" filter is selected', () => {
    const { mockStore, props } = getData(mockBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const filterComponent = container.querySelector('va-search-filter');

    dispatchFilterApply(filterComponent, [
      {
        label: 'Benefit Type',
        category: [{ id: 'All', label: 'All' }],
      },
    ]);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames).to.have.lengthOf(3);
    expect(benefitNames[0]).to.contain('Careers');
    expect(benefitNames[1]).to.contain('Education');
  });

  it('should show all benefits when no results are found but allBenefits=true is in the query', () => {
    const { mockStore, props } = getData([], form2, { allBenefits: 'true' });

    const updatedStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        results: {
          data: [],
          error: null,
          isError: false,
          isLoading: false,
        },
      }),
    };

    const { getAllByRole } = subject({ mockStore: updatedStore, props });

    const items = getAllByRole('listitem');

    expect(items.length).to.equal(BENEFITS_LIST.length);
  });

  it('should sort benefits by time sensitivity', () => {
    const timeSensitiveBenefits = [
      { id: '1', name: 'Benefit A', isTimeSensitive: false, category: [] },
      { id: '2', name: 'Benefit B', isTimeSensitive: true, category: [] },
      { id: '3', name: 'Benefit C', isTimeSensitive: false, category: [] },
    ];

    const { mockStore, props } = getData(timeSensitiveBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const filterComponent = container.querySelector('va-search-filter');

    dispatchFilterApply(filterComponent, [
      {
        label: 'Sort',
        category: [{ id: 'isTimeSensitive', label: 'Time-sensitive' }],
      },
    ]);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames[0]).to.contain('Benefit B');
  });
});

describe('<ConfirmationPage> with <va-banner />', () => {
  sinon.stub(Date, 'getTime');

  it('should render a <va-banner /> when results not found', () => {
    const { mockStore, props } = getData([], form2);
    const { container } = subject({ mockStore, props });

    const banner = container.querySelector('va-banner');
    expect(banner).to.exist;
    expect(banner).to.have.attribute('headline', 'No Results Found');
    expect(banner).to.have.attribute('type', 'warning');
  });

  it('should handle "Go back" link', async () => {
    sinon.stub(window, 'history').value({ length: 10 });

    const { mockStore, props } = getData([], form2);
    const { container } = subject({ mockStore, props });

    const backLink = container.querySelector('[data-testid="back-link"]');
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(props.router.goBack.called).to.be.true;
    });
  });
});
