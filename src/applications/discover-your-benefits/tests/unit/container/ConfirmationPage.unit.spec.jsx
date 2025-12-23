import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationPage from '../../../containers/ConfirmationPage';
import formConfig from '../../../config/form';
import { categories, BENEFITS_LIST } from '../../../constants/benefits';

const mockBenefits = [
  {
    id: '1',
    name: 'GI Bill benefits',
    category: categories.EDUCATION,
    whenToApplyDescription: 'Up to 2 years before you separate from service',
  },
  {
    id: '2',
    name: 'Careers and employment benefit',
    category: categories.EMPLOYMENT,
    whenToApplyDescription: 'Up to 180 days before you separate from service',
  },
  {
    id: '3',
    name: 'More Support benefit',
    category: categories.MORE_SUPPORT,
    whenToApplyDescription: 'Before you separate from service',
  },
  {
    id: '4',
    name: 'Disability Compensation benefit',
    category: categories.DISABILITY,
    whenToApplyDescription:
      'Up to 180 days before you separate from service or up to 1 year after you separate from service',
  },
  {
    id: '5',
    name: 'Foreign Medical Program benefit',
    category: categories.HEALTH_CARE,
    whenToApplyDescription:
      'Up to 1 year and 120 days after you separate from service',
  },
  {
    id: '6',
    name: 'Veterans Pension benefit',
    category: categories.PENSION,
    whenToApplyDescription: 'Before or after you separate from service',
  },
  {
    id: '7',
    name: 'VA national cemetery burial benefit',
    category: categories.BURIALS,
    whenToApplyDescription: 'After you separate from service',
  },
  {
    id: '8',
    name: 'Veterans Affairs Life Insurance benefit',
    category: categories.LIFE_INSURANCE,
    whenToApplyDescription: 'After you separate from service',
  },
  {
    id: '9',
    name: 'Disability housing grant benefit',
    category: categories.HOUSING,
    whenToApplyDescription: 'After you separate from service',
  },
  {
    id: '10',
    name: 'Quick Access Benefit benefit',
    category: categories.MORE_SUPPORT,
    whenToApplyDescription: 'After you separate from service',
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
  describe('initial render and state', () => {
    it('renders additional info for transitioning service members', () => {
      const { mockStore, props } = getData([], form2);
      const { container } = subject({ mockStore, props });

      const additionalInfo = container.querySelector('va-additional-info');
      expect(additionalInfo).to.exist;
      expect(additionalInfo).to.have.attribute(
        'trigger',
        'Benefits for transitioning service members',
      );

      const vaLink = additionalInfo.querySelector('va-link');
      expect(vaLink).to.exist;
      expect(vaLink).to.have.attribute(
        'href',
        'https://www.va.gov/service-member-benefits/',
      );
      expect(vaLink).to.have.attribute(
        'label',
        'Learn more about VA benefits for service members (opens in a new tab)',
      );
    });

    it('renders results container when query string is provided', () => {
      const { mockStore, props } = getData();
      props.location.query.benefits = 'SVC,FHV';
      const { container } = subject({ mockStore, props });

      expect(container.querySelector('#results-container')).to.exist;
    });

    it('shows loading indicator when results are loading', () => {
      const { mockStore, props } = getData([], form2);
      const { rerender } = subject({ mockStore, props });

      const loadingStore = {
        ...mockStore,
        getState: () => ({
          ...mockStore.getState(),
          results: {
            data: null,
            error: null,
            isError: false,
            isLoading: true,
          },
        }),
      };

      rerender(
        <Provider store={loadingStore}>
          <ConfirmationPage {...props} />
        </Provider>,
      );

      const loadingIndicator = document.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
    });

    it('renders new results when results data updates', () => {
      const { mockStore, props } = getData([], form2);
      const { rerender, queryByText, getByText } = subject({
        mockStore,
        props,
      });

      mockBenefits.forEach(({ name }) => {
        expect(queryByText(name)).to.not.exist;
      });

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

      mockBenefits.forEach(({ name }) => {
        expect(getByText(name)).to.exist;
      });
    });

    it('renders banner when results not found', () => {
      const { mockStore, props } = getData([], form2);
      const { container } = subject({ mockStore, props });

      const banner = container.querySelector('va-banner');
      expect(banner).to.exist;
      expect(banner).to.have.attribute('headline', 'No Results Found');
      expect(banner).to.have.attribute('type', 'warning');
    });
  });

  describe('navigation', () => {
    it('handles back link', async () => {
      sinon.stub(window, 'history').value({ length: 10 });

      const { mockStore, props } = getData();
      const { container } = subject({ mockStore, props });

      const backLink = container.querySelector('[data-testid="back-link"]');
      fireEvent.click(backLink);

      await waitFor(() => {
        expect(props.router.goBack.called).to.be.true;
      });
    });
  });
});

describe('sortBenefits', () => {
  it('sorts benefits alphabetically', async () => {
    const { mockStore, props } = getData(mockBenefits, form2);

    const screen = render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

    const sortSelect = screen.getByLabelText(/Sort Benefits/i);

    fireEvent(
      sortSelect,
      new CustomEvent('vaSelect', {
        detail: { value: 'alphabetical' },
        bubbles: true,
      }),
    );

    const listItems = await screen.findAllByRole('listitem');
    const benefitNames = listItems.map(li => li.textContent);

    expect(benefitNames[0]).to.include('Careers and Employment');
    expect(benefitNames[1]).to.include('Disability Compensation');
    expect(benefitNames[2]).to.include('Disability housing grant');
    expect(benefitNames[3]).to.include('Foreign Medical Program');
    expect(benefitNames[4]).to.include('GI Bill benefits');
    expect(benefitNames[5]).to.include('More Support');
    expect(benefitNames[6]).to.include('Quick Access Benefit');
    expect(benefitNames[7]).to.include('VA national cemetery burial');
    expect(benefitNames[8]).to.include('Veterans Affairs Life Insurance');
    expect(benefitNames[9]).to.include('Veterans Pension');
  });

  it('sorts benefits by type', async () => {
    const { mockStore, props } = getData(mockBenefits);

    const screen = render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

    const sortSelect = screen.getByLabelText(/Sort Benefits/i);

    fireEvent(
      sortSelect,
      new CustomEvent('vaSelect', {
        detail: { value: 'category' },
        bubbles: true,
      }),
    );

    const listItems = await screen.findAllByRole('listitem');
    const benefitNames = listItems.map(li => li.textContent);

    expect(benefitNames[0]).to.include('VA national cemetery burial');
    expect(benefitNames[1]).to.include('Careers and Employment');
    expect(benefitNames[2]).to.include('Disability Compensation');
    expect(benefitNames[3]).to.include('GI Bill benefits');
    expect(benefitNames[4]).to.include('Foreign Medical Program');
    expect(benefitNames[5]).to.include('Disability housing grant');
    expect(benefitNames[6]).to.include('Veterans Affairs Life Insurance');
    expect(benefitNames[7]).to.include('More Support');
    expect(benefitNames[8]).to.include('Quick Access Benefit');
    expect(benefitNames[9]).to.include('Veterans Pension');
  });

  it('sorts benefits by time by expiring soonest', async () => {
    const { mockStore, props } = getData(mockBenefits);

    const screen = render(
      <Provider store={mockStore}>
        <ConfirmationPage {...props} />
      </Provider>,
    );

    const sortSelect = screen.getByTestId('sort-select');

    fireEvent(
      sortSelect,
      new CustomEvent('vaSelect', {
        detail: { value: 'expiringSoonest' },
        bubbles: true,
      }),
    );

    const listItems = await screen.findAllByRole('listitem');
    const benefitNames = listItems.map(li => li.textContent);

    for (let i = 0; i < benefitNames.length; i++) {
      expect(benefitNames[i]).to.include(mockBenefits[i].name);
    }
  });
});

describe('filterBenefits', () => {
  const dispatchFilterApply = (filterComponent, filters) => {
    const customEvent = new CustomEvent('vaFilterApply', {
      detail: filters,
    });
    filterComponent.dispatchEvent(customEvent);
  };

  it('filters benefits by selected category', async () => {
    const { mockStore, props } = getData(mockBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const filterComponent = container.querySelector('va-search-filter');

    dispatchFilterApply(filterComponent, [
      {
        id: 0,
        label: 'Show results',
        category: [
          { id: 'recommended', label: 'Recommended for you', active: true },
        ],
      },
      {
        id: 2,
        label: 'Benefit type',
        category: [
          { id: 'Careers', label: 'Careers and employment', active: true },
        ],
      },
    ]);
    await waitFor(() => {
      const listItems = wrapper.getAllByRole('listitem');
      expect(listItems.length).to.equal(1);
      expect(listItems[0].textContent).to.include('Careers');
    });
  });

  it('filters benefits by all', async () => {
    const { mockStore, props } = getData(mockBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container } = wrapper;

    const filterComponent = container.querySelector('va-search-filter');

    await dispatchFilterApply(filterComponent, [
      {
        id: 0,
        label: 'Show results',
        category: [{ id: 'all', label: 'All results', active: true }],
      },
    ]);

    let listItems = wrapper.getAllByRole('listitem').map(li => li.textContent);

    const pagination = container.querySelector('va-pagination');
    await pagination.dispatchEvent(
      new CustomEvent('pageSelect', {
        detail: { page: 2 },
        bubbles: true,
      }),
    );
    listItems = listItems.concat(
      wrapper.getAllByRole('listitem').map(li => li.textContent),
    );

    await pagination.dispatchEvent(
      new CustomEvent('pageSelect', {
        detail: { page: 3 },
        bubbles: true,
      }),
    );
    listItems = listItems.concat(
      wrapper.getAllByRole('listitem').map(li => li.textContent),
    );

    expect(listItems.length).to.equal(BENEFITS_LIST.length);
  });

  it('clears filters when "Clear all filters" is clicked', async () => {
    const { mockStore, props } = getData(mockBenefits, form2);
    const wrapper = subject({ mockStore, props });
    const { container, getAllByRole } = wrapper;
    const filterComponent = container.querySelector('va-search-filter');
    dispatchFilterApply(filterComponent, [
      {
        id: 0,
        label: 'Show results',
        category: [
          { id: 'recommended', label: 'Recommended for you', active: true },
        ],
      },
      {
        label: 'Benefit type',
        category: [
          { id: 'Employment', label: 'Careers and employment', active: true },
        ],
      },
    ]);
    await waitFor(() => {
      const items = getAllByRole('listitem');
      expect(items.length).to.equal(1);
      expect(items[0].textContent).to.include('Careers');
    });
    filterComponent.dispatchEvent(
      new CustomEvent('vaFilterClearAll', {
        bubbles: true,
      }),
    );
    await waitFor(() => {
      const items = getAllByRole('listitem');
      expect(items.length).to.equal(mockBenefits.length);
    });
  });
});

describe('pagination', () => {
  it('displays the correct benefits when navigating between pages', async () => {
    const benefits = Array.from({ length: 23 }, (_, i) => ({
      id: String(i + 1),
      name: `Benefit ${i + 1}`,
      category: '',
      whenToApplyDescription: 'After you separate from service',
    }));
    const sortedBenefits = [...benefits].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    const { mockStore, props } = getData(benefits, form2);
    const screen = subject({
      mockStore,
      props,
    });
    const { container } = screen;
    const { getAllByRole } = screen;

    const sortSelect = screen.getByLabelText(/Sort Benefits/i);

    fireEvent(
      sortSelect,
      new CustomEvent('vaSelect', {
        detail: { value: 'alphabetical' },
        bubbles: true,
      }),
    );
    // Page 1 (items 0–9)
    await waitFor(() => {
      const items = getAllByRole('listitem').map(li => li.textContent);
      expect(items).to.have.lengthOf(10);
      expect(items[0]).to.include(sortedBenefits[0].name);
      expect(items[9]).to.include(sortedBenefits[9].name);
    });
    // Click to page 2
    const pagination = container.querySelector('va-pagination');
    pagination.dispatchEvent(
      new CustomEvent('pageSelect', {
        detail: { page: 2 },
        bubbles: true,
      }),
    );
    // Page 2 (items 10–19)
    await waitFor(() => {
      const items = getAllByRole('listitem').map(li => li.textContent);
      expect(items).to.have.lengthOf(10);
      expect(items[0]).to.include(sortedBenefits[10].name);
      expect(items[9]).to.include(sortedBenefits[19].name);
    });
    // Click to page 3
    pagination.dispatchEvent(
      new CustomEvent('pageSelect', {
        detail: { page: 3 },
        bubbles: true,
      }),
    );
    // Page 3 (items 20–22)
    await waitFor(() => {
      const items = getAllByRole('listitem').map(li => li.textContent);
      expect(items).to.have.lengthOf(3);
      expect(items[0]).to.include(sortedBenefits[20].name);
      expect(items[2]).to.include(sortedBenefits[22].name);
    });
  });
});
