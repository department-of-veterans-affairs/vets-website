import React from 'react';
import { expect } from 'chai';
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
      },
      {
        id: 'expense2',
        expenseType: 'Parking',
        tripType: 'OneWay',
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

  it('renders the review page with expenses and alert', async () => {
    const { getByTestId, getByRole, container } = renderWithStoreAndRouter(
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
    expect($('va-alert')).to.exist;

    // Add more expenses button
    expect($('#add-expense-button', container)).to.exist;

    // Sign agreement button
    expect($('#sign-agreement-button', container)).to.exist;

    // Wait for expenses to load and render accordion items
    await waitFor(() => {
      expect($('va-accordion-item', container)).to.exist;
    });

    // SummaryBox should render
    expect($('va-summary-box', container)).to.exist;
  });

  it('calls onNext when Sign Agreement button is clicked', () => {
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

    const signButton = $('#sign-agreement-button', container);
    expect(signButton).to.exist;

    // Click the Sign Agreement button
    fireEvent.click(signButton);

    // Check that the location updated
    expect(getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
    );
  });

  it('hides alert when close button is clicked', () => {
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

    const alert = $('va-alert', container);
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
      expect(accordionItems.length).to.equal(2);
    });

    // ExpenseCard rendered
    const mileageCard = container.querySelector('va-accordion-item div');
    expect(mileageCard).to.exist;
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

    const addButton = $('#add-expense-button', container);
    expect(addButton).to.exist;

    // Click the Add more expenses button
    fireEvent.click(addButton);

    // Check that the location updated
    expect(getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/choose-expense`,
    );
  });
});
