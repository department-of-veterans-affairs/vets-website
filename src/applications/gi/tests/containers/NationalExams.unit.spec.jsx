import React from 'react';
import { expect } from 'chai';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { MemoryRouter } from 'react-router-dom';
import NationalExamsList from '../../containers/NationalExamsList';
import { formatNationalExamName } from '../../utils/helpers';

const mockExams = [
  { enrichedId: '1@acce9', name: 'AP-ADVANCED PLACEMENT EXAMS' },
  { enrichedId: '2@5bf2b', name: 'CLEP-COLLEGE LEVEL EXAMINATION PROGRAM' },
  { enrichedId: '3@48003', name: 'DANTES SPONSORED CLEP EXAMS' },
  { enrichedId: '4@a359f', name: 'DAT-DENTAL ADMISSION TEST' },
  { enrichedId: '5@8527d', name: 'GMAT-GRADUATE MGMT ADMISSION TEST' },
  { enrichedId: '6@a4d71', name: 'GRE-GRADUATE RECORD EXAM' },
  { enrichedId: '7@5073b', name: 'TOEFL' },
  { enrichedId: '8@2eef3', name: 'MCAT' },
  { enrichedId: '9@f683b', name: 'OAT-OPTOMETRY ADMISSION TEST' },
  { enrichedId: '10@b4bfb', name: 'SAT-SCHOLASTIC ASSESSMENT TEST' },
  { enrichedId: '11@fc1dd', name: 'CAS' },
  { enrichedId: '12@53d2a', name: 'LSAT-LAW SCHOOL ADMISSION TEST' },
  { enrichedId: '13@8eca8', name: 'ACT' },
  { enrichedId: '14@2db24', name: 'DSST-DANTES' },
  { enrichedId: '15@8fd2a', name: 'MAT-MILLER ANALOGIES TEST' },
  { enrichedId: '16@e477d', name: 'PCAT-PHARMACY COLLEGE ADMISSON TEST' },
  { enrichedId: '17@8479c', name: 'ECE (4 hours)' },
  { enrichedId: '18@07aaf', name: 'ECE (6 hours)' },
  { enrichedId: '19@a36f3', name: 'ECE 8 HOURS NURSING' },
];

const mockStore = configureStore([thunk]);

describe('NationalExamsList', () => {
  let store;
  const initialState = {
    nationalExams: { nationalExams: mockExams, loading: false, error: null },
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    cleanup();
  });

  const mountComponent = (location = { search: '' }) => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
      },
    });

    return mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[location]}>
          <NationalExamsList location={location} />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render National exams when not loading', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('National exams');
    expect(wrapper.find('p').exists()).to.be.true;
    expect(wrapper.find(VaPagination).length).to.equal(1);
    expect(wrapper.find(VaPagination).props().page).to.equal(1);
    wrapper.unmount();
  });
  it('should render the GI Bill reimbursement link correctly', () => {
    const wrapper = mountComponent();
    const link = wrapper.find('va-link').at(0);
    expect(link.prop('href')).to.equal(
      'https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/national-tests/',
    );
    expect(link.prop('text')).to.equal(
      'Find out how to get reimbursed for national tests',
    );
    wrapper.unmount();
  });

  it('should render the correct number of exams for the first page', () => {
    const wrapper = mountComponent();
    const examItems = wrapper.find('va-card');
    expect(examItems.length).to.equal(10);
  });

  it('should calculate the correct total number of pages', () => {
    const wrapper = mountComponent();
    const totalPages = wrapper.find(VaPagination).props().pages;
    expect(totalPages).to.equal(2);
  });
  it('calculates the total number of pages correctly in VaPagination', () => {
    const wrapper = mountComponent();
    const itemsPerPage = 10;
    const totalItems = store.getState().nationalExams.nationalExams.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationComponent = wrapper.find('VaPagination');
    expect(paginationComponent.prop('pages')).to.equal(totalPages);

    wrapper.unmount();
  });

  it('simulates page change in VaPagination to page 2 and verifies displayed items', async () => {
    const wrapper = mountComponent();
    const newPage = 2;
    const itemsPerPage = 10;

    wrapper.find('VaPagination').prop('onPageSelect')({
      detail: {
        page: newPage,
      },
    });
    wrapper.update();
    await new Promise(resolve => setTimeout(resolve, 0));
    const expectedItems = initialState.nationalExams.nationalExams
      .slice((newPage - 1) * itemsPerPage, newPage * itemsPerPage)
      .map(exam => exam.name);
    const expectedItemsFormatted = expectedItems.map(name =>
      formatNationalExamName(name),
    );
    const displayedItems = wrapper.find('li h3').map(node => node.text());
    expect(displayedItems).to.deep.equal(expectedItemsFormatted);
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
        <MemoryRouter initialEntries={[location]}>
          <NationalExamsList location={location} />
        </MemoryRouter>
      </Provider>,
    );

    // Check if the loading indicator is rendered
    const loadingIndicator = wrapper.find('va-loading-indicator');
    expect(loadingIndicator.exists()).to.be.true;
    expect(loadingIndicator.prop('label')).to.equal('Loading');
    expect(loadingIndicator.prop('message')).to.equal(
      'Loading your national exams...',
    );
    wrapper.unmount();
  });
  it('should hide the loading indicator once loading is complete', () => {
    store = mockStore({
      nationalExams: {
        nationalExams: mockExams,
        loading: true,
        error: null,
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[location]}>
          <NationalExamsList location={location} />
        </MemoryRouter>
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

    wrapper.setProps({
      store,
    });

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
        <MemoryRouter initialEntries={[location]}>
          <NationalExamsList location={location} />
        </MemoryRouter>
      </Provider>,
    );

    // Check that the error alert is displayed
    const alert = wrapper.find('va-alert');
    expect(alert.exists()).to.be.true;
    expect(alert.prop('status')).to.equal('error');
    expect(alert.find('h2[slot="headline"]').text()).to.equal(
      'We can’t load the national exams list right now',
    );
    expect(alert.find('p').text()).to.include(
      'We’re sorry. There’s a problem with our system. Try again later.',
    );

    // Check institution name and program type are displayed
    expect(wrapper.find('h1').text()).to.equal('National exams');

    wrapper.unmount();
  });
  it('should correctly reflect the page number in URL query parameters', () => {
    const wrapper = mountComponent({
      search: '?page=2',
    });
    expect(wrapper.find(VaPagination).props().page).to.equal(2);
    wrapper.unmount();
  });
  it('should navigate to the correct national exam details page when an exam link is clicked', () => {
    const testExam = mockExams[0];
    const expectedExamName = formatNationalExamName(testExam.name);
    const expectedEncodedName = encodeURIComponent(expectedExamName);
    const expectedPath = `/national-exams/${
      testExam.enrichedId
    }?examName=${expectedEncodedName}`;

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );

    const firstExamLink = wrapper
      .find('va-card')
      .find('va-link')
      .at(0);
    firstExamLink.simulate('click', { preventDefault() {} });
    const memoryRouter = wrapper.find(MemoryRouter).instance();
    expect(
      memoryRouter.history.location.pathname +
        memoryRouter.history.location.search,
    ).to.equal(expectedPath);

    wrapper.unmount();
  });
});
