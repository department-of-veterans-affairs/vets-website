import React from 'react';
import { expect } from 'chai';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import sinon from 'sinon';
import NationalExamDetails from '../../containers/NationalExamDetails';

const mockStore = configureStore([thunk]);

describe('NationalExamDetails', () => {
  let store;
  let initialState;
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let originalInnerWidth;
  let mockVaTableInner;
  let mockUsaTable;

  const renderWithProviders = (examId = '1@acce9') =>
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/national-exams/${examId}`]}>
          <Route path="/national-exams/:examId">
            <NationalExamDetails />
          </Route>
        </MemoryRouter>
      </Provider>,
    );

  beforeEach(() => {
    initialState = {
      nationalExams: { examDetails: null, loadingDetails: false, error: null },
    };
    store = mockStore(initialState);

    addEventListenerSpy = sinon.spy(window, 'addEventListener');
    removeEventListenerSpy = sinon.spy(window, 'removeEventListener');

    originalInnerWidth = global.innerWidth;

    mockUsaTable = { classList: { add: sinon.spy(), remove: sinon.spy() } };
    mockVaTableInner = {
      shadowRoot: {
        querySelector: sinon.stub().returns(mockUsaTable),
      },
    };
    sinon
      .stub(document, 'querySelector')
      .callsFake(
        selector =>
          selector === '.exams-table va-table-inner' ? mockVaTableInner : null,
      );
  });

  afterEach(() => {
    cleanup();
    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
    document.querySelector.restore();
    global.innerWidth = originalInnerWidth;
  });

  it('should display a loading indicator when loadingDetails is true', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        loadingDetails: true,
      },
    });

    const { container } = renderWithProviders();
    const loader = container.querySelector('va-loading-indicator');
    expect(loader).to.exist;
    expect(loader.getAttribute('message')).to.equal(
      'Loading your national exam details...',
    );
  });

  it('should display an error alert when error is present', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        error: 'Server error occurred',
      },
    });

    const { container, getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/national-exams/1@acce9']}>
          <Route path="/national-exams/:examId">
            <NationalExamDetails />
          </Route>
        </MemoryRouter>
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('error');
    expect(getByText('We can’t load the national exam details right now')).to
      .exist;
    expect(getByText(/problem with our system\. Try again later\./)).to.exist;
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

    const { container, getByText } = renderWithProviders();
    expect(container.querySelector('va-loading-indicator')).to.be.null;
    expect(getByText('Sample National Exam')).to.exist;
    expect(getByText('Sample Institution')).to.exist;
    const address = getByText(/123 Main St/).textContent;
    expect(address).to.include('123 Main St');
    expect(address).to.include('Anytown, VA 12345');
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      'https://www.va.gov/find-forms/about-form-22-0810/',
    );
    expect(link.getAttribute('text')).to.equal(
      'Get link to VA Form 22-0810 to download',
    );

    const rows = container.querySelectorAll('va-table-row');
    expect(rows).to.have.lengthOf(3);

    const secondRow = rows[1].textContent;
    expect(secondRow).to.include('Test A');
    expect(secondRow).to.include('$100');
    const vaTable = container.querySelector('va-table');
    expect(vaTable).to.exist;
    expect(vaTable.getAttribute('table-title')).to.equal(
      'Test fee description and reimbursement details',
    );
  });

  it('should not render anything if examDetails is null and loadingDetails is false (edge case)', () => {
    store = mockStore({
      nationalExams: {
        ...initialState.nationalExams,
        examDetails: null,
        loadingDetails: false,
      },
    });

    const { container } = renderWithProviders();
    const loader = container.querySelector('va-loading-indicator');
    expect(loader).to.exist;
    expect(loader.getAttribute('message')).to.equal(
      'Loading your national exam details...',
    );
  });

  it('displays "Not available" and "No tests available" when webAddress is null and no tests', () => {
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
    const { getByText } = renderWithProviders();
    expect(getByText('Not available')).to.exist;
    expect(getByText('No tests available')).to.exist;
  });

  it('renders single-test layout when exactly one valid test exists', () => {
    const mockExamDetails = {
      name: 'Single Test Exam',
      tests: [{ name: 'Single Test', fee: '150' }, { name: 'Blank', fee: '' }],
      institution: {
        name: 'Single Institution',
        physicalAddress: {
          address1: '123 Example St',
          city: 'Example City',
          state: 'EX',
          zip: '00000',
          country: 'USA',
        },
        webAddress: 'www.example.com',
      },
    };

    store = mockStore({
      nationalExams: {
        examDetails: mockExamDetails,
        loadingDetails: false,
        error: null,
      },
    });

    const { getByText, container } = renderWithProviders();
    expect(container.querySelector('.exam-single-test')).to.exist;
    expect(getByText('Test Info')).to.exist;
    expect(getByText('Showing 1 of 1 test')).to.exist;
    expect(getByText(/Fee description:/i)).to.exist;
    expect(getByText(/Maximum reimbursement:/i)).to.exist;
    expect(getByText('$150')).to.exist;
  });

  it('adds and removes the resize event listener on mount/unmount', () => {
    const { unmount } = renderWithProviders();
    expect(addEventListenerSpy.calledWith('resize')).to.be.true;
    unmount();
    expect(removeEventListenerSpy.calledWith('resize')).to.be.true;
  });

  it('sets table to borderless and removes bordered classes when width >= 481px', () => {
    global.innerWidth = 800;
    renderWithProviders();
    expect(mockUsaTable.classList.remove.calledWith('usa-table--bordered')).to
      .be.true;
    expect(mockUsaTable.classList.add.calledWith('usa-table--borderless')).to.be
      .true;
  });

  it('applies bordered classes when width < 481px', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });
    store = mockStore({
      nationalExams: {
        examDetails: {
          name: 'Sample National Exam',
          tests: [
            { name: 'Test A', fee: '100' },
            { name: 'Test B', fee: '200' },
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
        },
        loadingDetails: false,
        error: null,
      },
    });

    await act(async () => {
      renderWithProviders();
    });
    await waitFor(() => {
      expect(mockUsaTable.classList.add.calledWith('usa-table--bordered')).to.be
        .true;
      expect(mockUsaTable.classList.remove.calledWith('usa-table--borderless'))
        .to.be.true;
    });
  });
});
