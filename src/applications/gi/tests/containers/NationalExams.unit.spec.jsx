import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NationalExamsList from '../../containers/NationalExamsList';

const mockExams = [
  {
    name: 'AP-ADVANCED PLACEMENT EXAMS',
    type: 'exam',
    state: 'all',
    tests: [
      {
        description: 'SAT International Language With Listening',
        dates: '1/1/15 - 11/30/23',
        amount: 74,
      },
      {
        description: 'SAT Language Test with Listening',
        dates: '1/1/15 - 11/30/23',
        amount: 74,
      },
      {
        description: 'SAT SUBJECT TEST',
        dates: '1/1/15 - 11/30/23',
        amount: 60,
      },
      { description: 'SAT USA', dates: '1/1/10 - 11/30/23', amount: 60 },
      {
        description: 'SAT WITH ESSAY',
        dates: '1/1/15 - 11/30/23',
        amount: 68,
      },
    ],
    institution: {
      name: 'COLLEGE BOARD',
      abbreviatedName: 'SAT',
      physicalStreet: 'PO BOX 025505',
      physicalCity: 'MIAMI',
      physicalState: 'FL',
      physicalZip: '33102',
      physicalCountry: 'USA',
      mailingStreet: 'PO BOX 025505',
      mailingCity: 'MIAMI',
      mailingState: 'FL',
      mailingZip: '33102',
      mailingCountry: 'USA',
      phone: '(866)756-7346',
      webAddress: 'http://www.collegeboard.com',
    },
  },
];

const mockStore = configureStore([thunk]);
describe('NationalExamsList', () => {
  let store;
  const initialState = {
    nationalExams: {
      nationalExams: Array.from({ length: 7 }, (_, i) => ({
        ...mockExams[0],
        name: `Exam ${i + 1}`,
      })),
      loading: false,
      error: null,
    },
  };
  beforeEach(() => {
    store = mockStore(initialState);
    global.MutationObserver = class {
      observe() {}

      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
  });

  const mountComponent = () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
      },
    });

    return mount(
      <Provider store={store}>
        <NationalExamsList />
      </Provider>,
    );
  };

  it('should render National Exams when not loading', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('National Exams');
    expect(wrapper.find('p').exists()).to.be.true;
    expect(wrapper.find(VaPagination).length).to.equal(1);
    expect(wrapper.find(VaPagination).props().page).to.equal(1);
    wrapper.unmount();
  });
  it('should render the VA Form link correctly', () => {
    const wrapper = mountComponent();
    const formLink = wrapper.find('a').at(1);
    expect(formLink.props().href).to.equal(
      'https://www.va.gov/find-forms/about-form-22-0810/',
    );
    expect(formLink.text()).to.equal('Get link to VA Form 22-0810 to print');
  });

  it('should render the correct number of exams for the first page', () => {
    const wrapper = mountComponent();
    const examItems = wrapper.find('va-accordion-item');
    expect(examItems.length).to.equal(5); // Check if it renders 5 items for the first page
  });

  it('should calculate the correct total number of pages', () => {
    const wrapper = mountComponent();
    const totalPages = wrapper.find(VaPagination).props().pages;
    expect(totalPages).to.equal(2);
  });
  it('calculates the total number of pages correctly in VaPagination', () => {
    const wrapper = mountComponent();
    const itemsPerPage = 5;

    // Calculate the expected number of pages
    const totalItems = store.getState().nationalExams.nationalExams.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Check if VaPagination is receiving the correct number of pages as a prop
    const paginationComponent = wrapper.find('VaPagination');
    expect(paginationComponent.prop('pages')).to.equal(totalPages);

    wrapper.unmount();
  });

  it('simulates page change in VaPagination to page 2 and verifies displayed items in VaAccordion', async () => {
    const wrapper = mountComponent();
    const newPage = 2;
    const itemsPerPage = 5;

    // Trigger a page change to the second page
    wrapper.find('VaPagination').prop('onPageSelect')({
      detail: { page: newPage },
    });
    wrapper.update();

    // Wait for asynchronous updates to propagate
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get the expected items from the state
    const expectedItems = initialState.nationalExams.nationalExams
      .slice((newPage - 1) * itemsPerPage, newPage * itemsPerPage)
      .map(program => program.name);

    // Get the displayed items in the VaAccordion
    const displayedItems = wrapper
      .find('va-accordion-item')
      .map(node => node.prop('header'));
    expect(displayedItems).to.deep.equal(expectedItems);

    wrapper.unmount();
  });

  it('should render the correct National Exam name', () => {
    const wrapper = mountComponent();
    const nationalExamsName = wrapper
      .find('.provider-info-container span')
      .first()
      .text();
    expect(nationalExamsName).to.include('COLLEGE BOARD');
  });

  it('should render the correct number of table rows for tests', () => {
    const wrapper = mountComponent();
    const examAccordion = wrapper.find('va-accordion-item').first();
    const tableRows = examAccordion.find('va-table-row');
    expect(tableRows.length).to.equal(6); // 5 test rows + 1 header row
  });
  it('should render exams for the selected page when page is changed', () => {
    const wrapper = mountComponent();
    // Simulate page navigation to page 2
    wrapper
      .find(VaPagination)
      .props()
      .onPageSelect({ detail: { page: 2 } });

    const newExamItems = wrapper.find('va-accordion-item');
    expect(newExamItems.length).to.equal(5); // Expect 5 items on the second page
    wrapper.unmount();
  });

  it('displays the loading indicator when loading is true', () => {
    // Mount the component with loading state set to true
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loading: true,
        error: null,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <NationalExamsList />
      </Provider>,
    );

    // Check if the loading indicator is rendered
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(loadingIndicator.exists()).to.be.true;
    expect(loadingIndicator.prop('label')).to.equal('Loading');
    expect(loadingIndicator.prop('message')).to.equal(
      'Loading your National Exams...',
    );
    wrapper.unmount();
  });
  it('should hide the loading indicator once loading is complete', () => {
    store = mockStore({
      nationalExams: { nationalExams: mockExams, loading: true, error: null },
    });

    const wrapper = mount(
      <Provider store={store}>
        <NationalExamsList />
      </Provider>,
    );

    // Initially, loading indicator is visible
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;

    // Update store to set loading to false
    store = mockStore({
      nationalExams: {
        nationalExams: mockExams,
        loading: false,
        error: null,
      },
    });

    wrapper.setProps({ store });

    // Check if loading indicator is no longer present
    expect(wrapper.find('va-loading-indicator').exists()).to.be.false;
    wrapper.unmount();
  });

  it('displays an error message when there is an error in the state', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loading: false,
        error: 'Server error occurred',
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <NationalExamsList />
      </Provider>,
    );

    // Check that the error alert is displayed
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('error');
    expect(alert.find('h2[slot="headline"]').text()).to.equal(
      'We can’t load the National Exams list right now',
    );
    expect(alert.find('p').text()).to.include(
      'We’re sorry. There’s a problem with our system. Try again later.',
    );

    // Check institution name and program type are displayed
    expect(wrapper.find('h1').text()).to.equal('National Exams');

    wrapper.unmount();
  });
});
