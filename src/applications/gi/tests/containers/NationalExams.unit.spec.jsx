import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
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
  const renderWithProviders = (location = '/national-exams') => {
    store = mockStore(initialState);
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[location]}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );
  };

  it('should render National exams when not loading', () => {
    const { container, getByRole } = renderWithProviders();
    const heading = getByRole('heading', {
      level: 1,
    });
    expect(heading.textContent).to.equal('National exams');
    const paragraph = container.querySelector('p');
    expect(paragraph).to.exist;
    const pagination = container.querySelector('va-pagination');
    expect(pagination).to.exist;
    expect(pagination.getAttribute('page')).to.equal('1');
  });
  it('should render the GI Bill reimbursement link correctly', () => {
    const { container } = renderWithProviders();
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/national-tests/',
    );
    expect(link.getAttribute('text')).to.equal(
      'Find out how to get reimbursed for national tests',
    );
  });

  it('should render the correct number of exams for the first page', () => {
    const { container } = renderWithProviders();
    const examCards = container.querySelectorAll('va-card');
    expect(examCards.length).to.equal(10);
  });
  it('should calculate the correct total number of pages', () => {
    const { container } = renderWithProviders();
    const pagination = container.querySelector('va-pagination');
    expect(Number(pagination.getAttribute('pages'))).to.equal(2);
  });

  it('calculates the total number of pages correctly in VaPagination', () => {
    const { container } = renderWithProviders();
    const itemsPerPage = 10;
    const totalItems = store.getState().nationalExams.nationalExams.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = container.querySelector('va-pagination');
    expect(Number(pagination.getAttribute('pages'))).to.equal(totalPages);
  });

  it('displays the loading indicator when loading is true', () => {
    const loadingState = {
      nationalExams: { nationalExams: [], loading: true, error: null },
    };
    const loadingStore = mockStore(loadingState);
    const { container } = render(
      <Provider store={loadingStore}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );
    const loader = container.querySelector('va-loading-indicator');
    expect(loader).to.exist;
    expect(loader.getAttribute('label')).to.equal('Loading');
    expect(loader.getAttribute('message')).to.equal(
      'Loading your national exams...',
    );
  });

  it('hides the loading indicator once loading is complete', () => {
    const loadingState = {
      nationalExams: { nationalExams: mockExams, loading: true, error: null },
    };
    const { container, rerender } = render(
      <Provider store={mockStore(loadingState)}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('va-loading-indicator')).to.exist;

    const loadedState = {
      nationalExams: { nationalExams: mockExams, loading: false, error: null },
    };
    rerender(
      <Provider store={mockStore(loadedState)}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );
    expect(container.querySelector('va-loading-indicator')).to.be.null;
  });

  it('displays an error message when there is an error in the state', () => {
    const errorState = {
      nationalExams: {
        nationalExams: mockExams,
        loading: false,
        error: 'Server error occurred',
      },
    };
    const errorStore = mockStore(errorState);
    const { container } = render(
      <Provider store={errorStore}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );
    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    const headline = container.querySelector('h2[slot="headline"]');
    expect(headline.textContent).to.equal(
      'We can’t load the national exams list right now',
    );
    const paragraph = alert.querySelector('p');
    expect(paragraph.textContent).to.include(
      'We’re sorry. There’s a problem with our system. Try again later.',
    );
    const heading = container.querySelector('h1');
    expect(heading.textContent).to.equal('National exams');
  });

  it('should correctly reflect the page number in URL query parameters', () => {
    const { container } = renderWithProviders('/national-exams?page=2');
    const pagination = container.querySelector('va-pagination');
    expect(pagination.getAttribute('page')).to.equal('2');
  });
  // TODO: Convert to use RTL
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
    const displayedItems = wrapper.find('li h2').map(node => node.text());
    expect(displayedItems).to.deep.equal(expectedItemsFormatted);
    wrapper.unmount();
  });

  it('should navigate to the correct national exam details page when an exam link is clicked', () => {
    const testExam = mockExams[0];
    const expectedExamName = formatNationalExamName(testExam.name);
    const expectedEncodedName = encodeURIComponent(expectedExamName);
    const expectedPath = `/national-exams/${testExam.enrichedId}?examName=${expectedEncodedName}`;

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/national-exams']}>
          <NationalExamsList />
        </MemoryRouter>
      </Provider>,
    );

    const firstExamLink = wrapper.find('va-card').find('va-link').at(0);
    firstExamLink.getDOMNode().click();
    const memoryRouter = wrapper.find(MemoryRouter).instance();
    expect(
      memoryRouter.history.location.pathname +
        memoryRouter.history.location.search,
    ).to.equal(expectedPath);

    wrapper.unmount();
  });
});
