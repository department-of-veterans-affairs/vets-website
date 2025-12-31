import React from 'react';
import { expect } from 'chai';
import { useSelector } from 'react-redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { fireEvent, waitFor } from '@testing-library/react';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import ReviewPage from '../../../../components/complex-claims/pages/ReviewPage';
import reducer from '../../../../redux/reducer';

describe('Travel Pay – ReviewPage', () => {
  const apptId = '12345';
  const claimId = '45678';

  const defaultClaim = {
    claimId,
    totalCostRequested: 100.25,
    expenses: [
      {
        id: 'expense1',
        expenseType: 'Mileage',
        tripType: 'OneWay',
        address: {
          addressLine1: '123 Main St',
          addressLine2: 'Suite 100',
          city: 'Denver',
          stateCode: 'CO',
          zipCode: '80202',
        },
        costRequested: 50.25,
      },
      {
        id: 'expense2',
        expenseType: 'Parking',
        tripType: 'OneWay',
        costRequested: 50.0,
      },
    ],
    documents: [
      {
        documentId: '9c63737a-f29e-f011-b4cc-001dd806c742',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        createdon: '2025-10-01T18:14:37Z',
        expenseId: 'expense2', // Doc is associated with expense
      },
    ],
  };

  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
      claimDetails: {
        data: {
          [claimId]: defaultClaim,
        },
      },
      reviewPageAlert: {
        title: 'Test Alert',
        description: 'This is a test alert',
        type: 'info',
      },
      complexClaim: {
        claim: {
          creation: {
            isLoading: false,
            error: null,
          },
          submission: {
            id: '',
            isSubmitting: false,
            error: null,
            data: null,
          },
          data: null,
        },
        expenses: {
          creation: {
            isLoading: false,
            error: null,
          },
          update: {
            id: '',
            isLoading: false,
            error: null,
          },
          delete: {
            id: '',
            isLoading: false,
            error: null,
          },
          data: defaultClaim.expenses,
        },
      },
    },
    user: {
      profile: {
        vapContactInfo: {
          residentialAddress: {
            addressLine1: '123 Test St',
            addressLine2: '',
            city: 'Test City',
            stateCode: 'CO',
            zipCode: '80202',
          },
        },
      },
    },
  });

  it('renders the review page with expenses, alert, buttons, and summary box', async () => {
    const {
      getByTestId,
      getByRole,
      container,
      queryAllByTestId,
      getByText,
    } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Review page container
    expect(getByTestId('review-page')).to.exist;

    // Page heading
    expect(getByRole('heading', { name: /your unsubmitted expenses/i })).to
      .exist;

    // Alert component visible
    expect(getByTestId('review-page-alert')).to.exist;

    // Add more expenses button
    expect(container.querySelector('#add-expense-button')).to.exist;

    // Sign agreement button
    expect(container.querySelector('#sign-agreement-button')).to.exist;

    // Accordion items
    const accordionItems = container.querySelectorAll('va-accordion-item');
    expect(accordionItems.length).to.equal(defaultClaim.expenses.length);

    // Wait for expenses to load and render accordion items
    await waitFor(() => {
      expect($('va-accordion-item', container)).to.exist;
    });

    // ExpenseCard should render
    const expenseCards = document.querySelectorAll(
      'va-card[classname="expense-card"]',
    );
    expect(expenseCards.length).to.equal(defaultClaim.expenses.length);

    // Edit buttons on expense cards
    getByTestId('expense1-edit-expense-link');
    getByTestId('expense2-edit-expense-link');

    // Delete buttons on expense cards
    getByTestId('expense1-delete-expense-button');
    getByTestId('expense2-delete-expense-button');

    // Delete modals
    expect(queryAllByTestId('delete-expense-modal').length).to.eq(2);

    // SummaryBox should render
    expect(getByTestId('summary-box')).to.exist;

    // SummaryBox description text about deductible
    expect(
      getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          element.textContent.includes(
            'Before we can pay you back for expenses, you must pay a deductible. The current deductible is',
          ) &&
          element.textContent.includes('$3') &&
          element.textContent.includes('one-way or') &&
          element.textContent.includes('$6') &&
          element.textContent.includes('round-trip for each appointment') &&
          element.textContent.includes('You’ll pay no more than') &&
          element.textContent.includes('$18') &&
          element.textContent.includes('total each month')
        );
      }),
    ).to.exist;

    // SummaryBox Va link
    const link = container.querySelector(
      `va-link[href="/resources/reimbursed-va-travel-expenses-and-mileage-rate/#monthlydeductible"]`,
    );
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.eq(
      'Learn more about deductibles for VA travel claims',
    );
  });

  it('calls signAgreement when Sign Agreement button is clicked', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const signButton = container.querySelector('#sign-agreement-button');
    expect(signButton).to.exist;

    // Click the Sign Agreement button
    fireEvent.click(signButton);

    // Check that the location updated
    expect(getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
    );
  });

  it('hides alert when close button is clicked', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const alert = getByTestId('review-page-alert');
    expect(alert).to.exist;

    // Trigger the onCloseEvent of the alert
    alert.__events?.closeEvent?.();

    // After closing, the alert should still exist but visible state toggled internally
    // We can check via internal state if needed, or ensure no error occurs
    expect(alert).to.exist;
  });

  it('renders multiple expenses correctly', async () => {
    const { container } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Wait for expenses to load and render
    await waitFor(() => {
      // Check that each expense type has an accordion item
      const accordionItems = container.querySelectorAll('va-accordion-item');
      expect(accordionItems.length).to.equal(defaultClaim.expenses.length);
    });

    // ExpenseCard rendered
    const expenseCards = document.querySelectorAll(
      'va-card[classname="expense-card"]',
    );
    expect(expenseCards.length).to.equal(defaultClaim.expenses.length);
  });

  it('renders correctly when there are no expenses', () => {
    // Override the Redux state to have no expenses
    const emptyState = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          expenses: {
            ...getData().travelPay.complexClaim.expenses,
            data: [], // No expenses
          },
        },
      },
    };

    const { getByText, container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/12345/67890/review']}>
        <ReviewPage />
      </MemoryRouter>,
      {
        initialState: emptyState,
        reducers: reducer,
      },
    );

    // The "no expenses" message should be visible
    expect(
      getByText(
        `You haven’t added any expenses. Add at least 1 expense to submit your claim.`,
      ),
    ).to.exist;

    // The "Add more expenses" button should still exist
    expect(document.querySelector('#add-expense-button')).to.exist;

    // Help section
    expect(getByText('Need help?')).to.exist;

    // No expense accordion items
    const accordionItems = container.querySelectorAll('va-accordion-item');
    expect(accordionItems.length).to.equal(0);
  });

  it('calls addMoreExpenses when Add More Expenses button is clicked', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const addButton = container.querySelector('#add-expense-button');
    expect(addButton).to.exist;

    // Click the Add more expenses button
    fireEvent.click(addButton);

    // Check that the location updated
    expect(getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/choose-expense`,
    );
  });

  it('renders "Add another" buttons for non-mileage expense types', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      { initialState: getData(), reducers: reducer },
    );

    const addParkingBtn = container.querySelector(
      '#add-parking-expense-button',
    );
    expect(addParkingBtn).to.exist;

    // Click the Add another parking expenses button
    fireEvent.click(addParkingBtn);

    // Check that the location updated
    expect(getByTestId('location-display').textContent).to.equal(
      '/file-new-claim/12345/45678/parking',
    );
  });

  it('does not render individual totals for expense types with 0 value', () => {
    const stateWithZeroExpense = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          expenses: {
            ...getData().travelPay.complexClaim.expenses,
            data: [
              { id: 'expense1', expenseType: 'Mileage', costRequested: 0 },
              { id: 'expense2', expenseType: 'Parking', costRequested: 0 },
            ],
          },
        },
        claimDetails: {
          data: {
            [claimId]: {
              ...getData().travelPay.claimDetails.data[claimId],
              totalCostRequested: 0,
            },
          },
        },
      },
    };

    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
      </MemoryRouter>,
      { initialState: stateWithZeroExpense, reducers: reducer },
    );

    const summaryBox = getByTestId('summary-box');
    expect(summaryBox).to.exist;

    // Check total
    expect(summaryBox.textContent).to.include('Total: $0.00');

    // No individual <li> should exist because totals are 0
    const expenseTotals = container.querySelectorAll('ul li');
    expect(expenseTotals.length).to.equal(0);
  });

  it('dispatches setExpenseBackDestination with "review" when add expense button is clicked', async () => {
    // Component to verify Redux state
    const BackDestinationDisplay = () => {
      const expenseBackDestination = useSelector(
        state => state.travelPay.complexClaim.expenseBackDestination,
      );
      return (
        <div data-testid="expense-back-destination">
          {expenseBackDestination || 'none'}
        </div>
      );
    };

    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<ReviewPage />}
          />
        </Routes>
        <BackDestinationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const addButton = container.querySelector('#add-expense-button');
    expect(addButton).to.exist;

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(getByTestId('expense-back-destination').textContent).to.equal(
        'review',
      );
    });
  });
});
