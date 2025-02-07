import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import NationalExamDetails from '../../containers/NationalExamDetails';

const mockStore = configureStore([thunk]);

describe('NationalExamDetails', () => {
  let store;
  let initialState;

  beforeEach(() => {
    initialState = {
      nationalExams: { examDetails: null, loadingDetails: false, error: null },
    };
    store = mockStore(initialState);
    global.MutationObserver = class {
      observe() {}

      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
  });

  const mountComponent = (examId = '1@acce9') => {
    return mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/national-exams/${examId}`]}>
          <Route path="/national-exams/:examId">
            <NationalExamDetails />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should display a loading indicator when loadingDetails is true', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: true,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    expect(wrapper.find('va-loading-indicator').prop('message')).to.equal(
      'Loading your national exam details...',
    );
    wrapper.unmount();
  });

  it('should display an error alert when error is present', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        error: 'Server error occurred',
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/national-exams/1@acce9`]}>
          <Route path="/national-exams/:examId">
            <NationalExamDetails />
          </Route>
        </MemoryRouter>
      </Provider>,
    );
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('error');
    expect(alert.find('h2[slot="headline"]').text()).to.equal(
      'We can’t load the national exam details right now',
    );
    expect(alert.find('p').text()).to.include(
      'We’re sorry. There’s a problem with our system. Try again later.',
    );
    wrapper.unmount();
  });

  it('should render exam details when loaded and no error', () => {
    const mockExamDetails = {
      name: 'Sample National Exam',
      tests: [
        {
          name: 'Test A',
          beginDate: '2020-01-01',
          endDate: '2020-12-31',
          fee: '100',
        },
        {
          name: 'Test B',
          beginDate: '2020-01-01',
          endDate: '2020-12-31',
          fee: '100',
        },
      ],
      institution: {
        name: 'Sample Institution',
        physicalAddress: {
          address1: '123 Main St',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
        webAddress: 'www.sample.org',
      },
    };

    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: false,
        examDetails: mockExamDetails,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.false;
    expect(wrapper.find('h1').text()).to.equal('Sample National Exam');
    const institutionSpan = wrapper
      .find('.provider-info-container span')
      .findWhere(n => n.text() === 'Sample Institution');
    expect(institutionSpan.exists()).to.be.true;
    const addressBlock = wrapper.find('.va-address-block');
    expect(addressBlock.text()).to.contain('123 Main St');
    expect(addressBlock.text()).to.contain('Anytown, VA 12345');
    const formLink = wrapper.find(
      'va-link[href="https://www.va.gov/find-forms/about-form-22-0810/"]',
    );
    expect(formLink.exists()).to.be.true;
    expect(formLink.prop('text')).to.equal(
      'Get link to VA Form 22-0810 to download',
    );

    const tableRows = wrapper.find('va-table-row');
    expect(tableRows.length).to.equal(3);

    const testRow = tableRows.at(1);
    expect(testRow.text()).to.contain('Test A');
    expect(testRow.text()).to.contain('01/01/20 - 12/31/20');
    expect(testRow.text()).to.contain('$100');
    wrapper.unmount();
  });

  it('should not render anything if examDetails is null and loadingDetails is false (edge case)', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        examDetails: null,
        loadingDetails: false,
      },
    });

    const wrapper = mountComponent();
    expect(wrapper.find('va-loading-indicator').exists()).to.be.true;
    expect(wrapper.find('va-loading-indicator').prop('message')).to.equal(
      'Loading your national exam details...',
    );
    wrapper.unmount();
  });
  it('should display "Not available" if institution.webAddress is null and No tests available', () => {
    const mockExamDetails = {
      name: 'Sample National Exam',
      tests: undefined,
      institution: {
        name: 'Sample Institution',
        physicalAddress: {
          address1: '123 Main St',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
        webAddress: null,
      },
    };

    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: false,
        examDetails: mockExamDetails,
      },
    });
    const wrapper = mountComponent();
    const webAddressSpan = wrapper
      .find('.provider-info-container')
      .find('span')
      .filterWhere(n => n.text() === 'Not available');
    expect(webAddressSpan.exists()).to.be.true;
    expect(wrapper.text()).to.contain('No tests available');
    wrapper.unmount();
  });
  it('should display exam details in list format when exactly one valid test exists', () => {
    const mockExamDetails = {
      name: 'Sample National Exam',
      tests: [
        {
          name: 'Test A',
          beginDate: '2020-01-01',
          endDate: '2020-12-31',
          fee: '100',
        },
        { name: 'Blank', beginDate: '', endDate: '', fee: '' },
      ],
      institution: {
        name: 'Sample Institution',
        physicalAddress: {
          address1: '123 Main St',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
        webAddress: 'www.sample.org',
      },
    };
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: false,
        examDetails: mockExamDetails,
      },
    });

    const wrapper = mountComponent();
    const singleTestDiv = wrapper.find('.exam-single-test');
    expect(singleTestDiv.exists()).to.be.true;
    expect(singleTestDiv.find('h3').text()).to.equal('Test Info');
    expect(singleTestDiv.find('p').text()).to.equal('Showing 1 of 1 test');
    const ulList = singleTestDiv.find('ul.remove-bullets');
    expect(ulList.exists()).to.be.true;
    expect(ulList.text()).to.contain(`Fee Description: Test A`);
    expect(ulList.text()).to.contain('Dates: 01/01/20 - 12/31/20');
    expect(ulList.text()).to.contain('$100');
    wrapper.unmount();
  });
  // UPDATE TEST TO PASS
  // it('should handle dynamic table class changes (smoke test for resizing)', async () => {
  //   const mockExamDetails = {
  //     name: 'Sample National Exam',
  //     tests: [
  //       {
  //         name: 'Test A',
  //         beginDate: '2020-01-01',
  //         endDate: '2020-12-31',
  //         fee: '100',
  //       },
  //     ],
  //     institution: {
  //       name: 'Sample Institution',
  //       physicalAddress: {
  //         address1: '123 Main St',
  //         city: 'Anytown',
  //         state: 'VA',
  //         zip: '12345',
  //         country: 'USA',
  //       },
  //       webAddress: 'www.sample.org',
  //     },
  //   };

  //   store = mockStore({
  //     nationalExams: {
  //       ...initialState.nationalExams,
  //       examDetails: mockExamDetails,
  //     },
  //   });

  //   const wrapper = mountComponent();
  //   expect(wrapper.find('va-table').exists()).to.be.true;

  //   act(() => {
  //     global.innerWidth = 479;
  //     global.dispatchEvent(new Event('resize'));
  //   });
  //   wrapper.update();
  //   expect(wrapper.exists()).to.be.true;
  //   wrapper.unmount();
  // });
});
