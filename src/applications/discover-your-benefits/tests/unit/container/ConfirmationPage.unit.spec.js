import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import configureStore from 'redux-mock-store';
import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import { BENEFITS_LIST } from '../../../constants/benefits';

describe('<ConfirmationPage>', () => {
  sinon.stub(Date, 'getTime');
  const getData = resultsData => ({
    props: {
      formConfig,
      route: {
        path: 'confirmation',
      },
      router: {
        push: sinon.mock(),
        replace: sinon.mock(),
        // goBack: sinon.stub(),
        goBack: sinon.mock(),
      },
      displayResults: sinon.mock(),
      setSubmission: sinon.mock(),
      location: {
        basename: '/discover-your-benefits',
        pathname: '/confirmation',
        query: {},
        search: '',
      },
    },
    mockStore: {
      getState: () => ({
        form: {
          formId: 'T-QSTNR',
          data: {
            giBillStatus: 'No',
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
        },
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

  it('should render results page', () => {
    const { mockStore, props } = getData([BENEFITS_LIST[0]]);
    const { container } = subject({ mockStore, props });

    const ulQualified = container.querySelectorAll('ul.benefit-list');
    expect(container.querySelector('#results-container')).to.exist;
    expect(ulQualified[1].querySelectorAll('li')).to.have.lengthOf(19);
  });

  it('should render results page when query string is provided', () => {
    const { mockStore, props } = getData([]);
    props.location.query.benefits = 'SVC,FHV';
    const { container } = subject({ mockStore, props });

    expect(container.querySelector('#results-container')).to.exist;
  });

  it('should handle back link', async () => {
    const { mockStore, props } = getData();
    const { container } = subject({ mockStore, props });

    const backLink = container.querySelector('[data-testid="back-link"]');
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(props.router.goBack.called).to.be.true;
    });
  });
});

// Mock store configuration
const mockStoreInstance = configureStore([]);

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

describe('ConfirmationPage - sortBenefits and filterBenefits', () => {
  let wrapper;
  let store;
  let container;

  const setup = storeState => {
    store = mockStoreInstance(storeState);
    return render(
      <Provider store={store}>
        <ConfirmationPage
          results={{ data: mockBenefits, isLoading: false }}
          location={{ basename: '/', pathname: '/confirmation', query: {} }}
        />
      </Provider>,
    );
  };

  // it('should sort benefits by goal', () => {
  //   wrapper = setup({ results: { data: mockBenefits } });
  //   container = wrapper.container;

  //   const sortSelect = container.querySelector('[name="sort-benefits"]');
  //   sortSelect.__events.vaSelect({ target: { value: 'goal' } });
  //   const updateButton = container.querySelector('#update-results');
  //   fireEvent.click(updateButton);

  //   const benefitNames = wrapper
  //     .getAllByRole('listitem')
  //     .map(li => li.textContent);

  //   expect(benefitNames[0]).to.contain('Careers & Employment');
  // });

  it('should sort benefits alphabetically', () => {
    wrapper = setup({ results: { data: mockBenefits } });
    container = wrapper.container;

    const sortSelect = container.querySelector('[name="sort-benefits"]');
    sortSelect.__events.vaSelect({ target: { value: 'alphabetical' } });
    const updateButton = container.querySelector('#update-results');
    fireEvent.click(updateButton);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);

    expect(benefitNames[0]).to.contain('Careers');
    expect(benefitNames[1]).to.contain('Education');
  });

  it('should filter benefits by category', () => {
    wrapper = setup({ results: { data: mockBenefits } });
    container = wrapper.container;

    const filterSelect = container.querySelector('[name="filter-benefits"]');
    filterSelect.__events.vaSelect({ target: { value: 'Careers' } });
    const updateButton = container.querySelector('#update-results');
    fireEvent.click(updateButton);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);
    expect(benefitNames).to.have.lengthOf(6);
    expect(benefitNames[0]).to.contain('Careers and Employment');
  });

  it('should show all benefits when "All" filter is selected', () => {
    wrapper = setup({ results: { data: mockBenefits } });
    container = wrapper.container;

    const filterSelect = container.querySelector('[name="filter-benefits"]');
    filterSelect.__events.vaSelect({ target: { value: 'All' } });
    const updateButton = container.querySelector('#update-results');
    fireEvent.click(updateButton);

    const benefitNames = wrapper
      .getAllByRole('listitem')
      .map(li => li.textContent);
    expect(benefitNames).to.have.lengthOf(23);
    expect(benefitNames[0]).to.contain('Careers');
    expect(benefitNames[1]).to.contain('Education');
  });
});

describe('<ConfirmationPage> with <va-banner />', () => {
  sinon.stub(Date, 'getTime');

  const getData = resultsData => {
    return {
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
          query: {},
          search: '',
        },
      },
      mockStore: {
        getState: () => ({
          form: {
            formId: 'T-QSTNR',
            data: {
              privacyAgreementAccepted: true,
            },
          },
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
    };
  };

  const subject = ({ mockStore, props }) =>
    render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

  it('should render a <va-banner /> when results not found', () => {
    const { mockStore, props } = getData([]);
    const { container } = subject({ mockStore, props });

    const banner = container.querySelector('va-banner');
    expect(banner).to.exist;
    expect(banner).to.have.attribute('headline', 'No Results Found');
    expect(banner).to.have.attribute('type', 'warning');
  });

  it('should handle "Go back" link', async () => {
    const { mockStore, props } = getData([]);
    const { container } = subject({ mockStore, props });

    const backLink = container.querySelector('[data-testid="back-link"]');
    fireEvent.click(backLink);

    await waitFor(() => {
      expect(props.router.goBack.called).to.be.true;
    });
  });

  it('should handle "Filter and sort" action link', async () => {
    const { mockStore, props } = getData([]);
    const { container } = subject({ mockStore, props });

    window.innerWidth = 430;
    window.innerHeight = 932;

    const actionLink = container.querySelector(
      'va-link-action[text="Filter and sort"]',
    );
    fireEvent.click(actionLink);

    await waitFor(() => {
      const filterSelect = container.querySelector('[name="filter-benefits"]');
      const sortSelect = container.querySelector('[name="sort-benefits"]');
      expect(filterSelect).to.exist;
      expect(sortSelect).to.exist;
    });
  });
});
