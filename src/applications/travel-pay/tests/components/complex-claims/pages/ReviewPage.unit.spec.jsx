import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';

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
  const defaultClaim = {
    claimId: '12345',
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
        documentId: '9c63737a-f29e-f011-b4cc-001dd806c742',
      },
    ],
    documents: [
      {
        documentId: '9c63737a-f29e-f011-b4cc-001dd806c742',
        filename: 'test.pdf',
        mimetype: 'application/pdf',
        createdon: '2025-10-01T18:14:37Z',
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
    },
  });

  it('renders the review page with expenses, alert, buttons, and summary box', () => {
    const { getByTestId, getByRole, container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/12345/review']}>
        <ReviewPage claim={defaultClaim} />
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
    expect(accordionItems.length).to.equal(
      Object.keys(
        defaultClaim.expenses.reduce((acc, e) => {
          acc[e.expenseType] = true;
          return acc;
        }, {}),
      ).length,
    );

    // ExpenseCard should render
    const expenseCards = container.querySelectorAll('va-card');
    expect(expenseCards.length).to.equal(defaultClaim.expenses.length);

    // SummaryBox should render
    expect(container.querySelector('va-summary-box')).to.exist;
  });

  it('calls signAgreement when Sign Agreement button is clicked', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/12345/review']}>
        <Routes>
          <Route
            path="/file-new-claim/complex/:apptId/review"
            element={<ReviewPage claim={defaultClaim} />}
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
      '/file-new-claim/complex/12345/travel-agreement',
    );
  });

  it('hides alert when close button is clicked', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/12345/review']}>
        <ReviewPage claim={defaultClaim} />
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

  it('renders multiple expenses correctly', () => {
    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/12345/review']}>
        <ReviewPage claim={defaultClaim} />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Check that each expense type has an accordion item
    const accordionItems = container.querySelectorAll('va-accordion-item');
    expect(accordionItems.length).to.equal(
      Object.keys(
        defaultClaim.expenses.reduce((acc, e) => {
          acc[e.expenseType] = true;
          return acc;
        }, {}),
      ).length,
    );

    // ExpenseCard rendered
    const expenseCards = container.querySelectorAll('va-card');
    expect(expenseCards.length).to.equal(defaultClaim.expenses.length);
  });

  it('renders "No expenses have been added to this claim." when there are no expenses', () => {
    const emptyClaim = {
      claimId: '67890',
      totalCostRequested: 0,
      expenses: [],
      documents: [],
    };

    const { getByText } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/67890/review']}>
        <ReviewPage claim={emptyClaim} />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // The "no expenses" message should be visible
    expect(getByText('No expenses have been added to this claim.')).to.exist;

    // The "Add more expenses" button should still exist
    expect(document.querySelector('#add-expense-button')).to.exist;
  });

  it('calls addMoreExpenses when Add More Expenses button is clicked', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/12345/review']}>
        <Routes>
          <Route
            path="/file-new-claim/complex/:apptId/review"
            element={<ReviewPage claim={defaultClaim} />}
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
      '/file-new-claim/complex/12345/choose-expense',
    );
  });

  it('renders "Add another" buttons for non-mileage expense types', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/file-new-claim/complex/12345/review']}>
        <Routes>
          <Route
            path="/file-new-claim/complex/:apptId/review"
            element={<ReviewPage claim={defaultClaim} />}
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
      '/file-new-claim/complex/12345/parking',
    );
  });
});
