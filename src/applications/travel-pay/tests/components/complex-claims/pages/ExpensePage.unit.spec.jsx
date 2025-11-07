import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';

import ExpensePage from '../../../../components/complex-claims/pages/ExpensePage';
import ChooseExpenseType from '../../../../components/complex-claims/pages/ChooseExpenseType';
import reducer from '../../../../redux/reducer';
import {
  EXPENSE_TYPES,
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
  TRIP_OPTIONS,
} from '../../../../constants';

describe('Travel Pay – ExpensePage (Dynamic w/ EXPENSE_TYPES)', () => {
  //
  // Helper for capturing current route
  //
  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  //
  // Base store
  //
  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
    },
  });

  //
  // Render helper driven by EXPENSE_TYPES
  //
  const renderPage = expenseTypeConfig =>
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/12345/43555/${expenseTypeConfig.route}`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
            element={<ExpensePage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

  //
  // Fill required fields based on the expense type
  //
  const fillRequiredFields = (containerWrapper, expenseKey) => {
    const root = containerWrapper?.baseElement || containerWrapper; // safe fallback

    if (!root) return; // just in case

    // ---- COMMON FIELDS ----
    const date = root.querySelector('va-date[name="date"]');
    const amount = root.querySelector('va-text-input[name="amount"]');

    if (date) {
      date.dispatchEvent(
        new CustomEvent('dateChange', {
          detail: { value: '2025-10-31' },
          bubbles: true,
          composed: true,
        }),
      );
    }

    if (amount) {
      amount.dispatchEvent(
        new CustomEvent('input', {
          detail: { value: '50.00' },
          bubbles: true,
          composed: true,
        }),
      );
    }

    // ---- EXPENSE-SPECIFIC FIELDS ----
    switch (expenseKey) {
      case 'Meal': {
        const vendor = root.querySelector('va-text-input[name="vendor"]');
        vendor?.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: 'Test Vendor' },
            bubbles: true,
            composed: true,
          }),
        );
        break;
      }

      case 'Lodging': {
        const vendor = root.querySelector('va-text-input[name="vendor"]');
        vendor?.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: 'Test Hotel' },
            bubbles: true,
            composed: true,
          }),
        );

        const checkIn = root.querySelector('va-date[name="checkInDate"]');
        checkIn?.dispatchEvent(
          new CustomEvent('dateChange', {
            detail: { value: '2025-10-28' },
            bubbles: true,
            composed: true,
          }),
        );

        const checkOut = root.querySelector('va-date[name="checkOutDate"]');
        checkOut?.dispatchEvent(
          new CustomEvent('dateChange', {
            detail: { value: '2025-10-30' },
            bubbles: true,
            composed: true,
          }),
        );
        break;
      }

      case 'Commoncarrier': {
        const typeOption = root.querySelector(
          `va-radio[name="transportationType"] va-radio-option[value="${
            TRANSPORTATION_OPTIONS[0]
          }"]`,
        );
        typeOption?.dispatchEvent(
          new CustomEvent('vaValueChange', {
            detail: { value: TRANSPORTATION_OPTIONS[0] },
            bubbles: true,
            composed: true,
          }),
        );

        const reasonOption = root.querySelector(
          `va-radio[name="transportationReason"] va-radio-option[value="${
            Object.keys(TRANSPORTATION_REASONS)[0]
          }"]`,
        );
        reasonOption?.dispatchEvent(
          new CustomEvent('vaValueChange', {
            detail: { value: Object.keys(TRANSPORTATION_REASONS)[0] },
            bubbles: true,
            composed: true,
          }),
        );
        break;
      }

      case 'Airtravel': {
        const vendorName = root.querySelector(
          'va-text-input[name="vendorName"]',
        );
        vendorName?.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: 'Airline Vendor' },
            bubbles: true,
            composed: true,
          }),
        );

        const tripType = root.querySelector(
          `va-radio[name="tripType"] va-radio-option[value="${
            TRIP_OPTIONS[0]
          }"]`,
        );
        tripType?.dispatchEvent(
          new CustomEvent('vaValueChange', {
            detail: { value: TRIP_OPTIONS[0] },
            bubbles: true,
            composed: true,
          }),
        );

        const departureDate = root.querySelector(
          'va-date[name="departureDate"]',
        );
        departureDate?.dispatchEvent(
          new CustomEvent('dateChange', {
            detail: { value: '2025-10-31' },
            bubbles: true,
            composed: true,
          }),
        );

        const departureAirport = root.querySelector(
          'va-text-input[name="departureAirport"]',
        );
        departureAirport?.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: 'SFO' },
            bubbles: true,
            composed: true,
          }),
        );

        const arrivalDate = root.querySelector('va-date[name="arrivalDate"]');
        arrivalDate?.dispatchEvent(
          new CustomEvent('dateChange', {
            detail: { value: '2025-11-01' },
            bubbles: true,
            composed: true,
          }),
        );

        const arrivalAirport = root.querySelector(
          'va-text-input[name="arrivalAirport"]',
        );
        arrivalAirport?.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: 'LAX' },
            bubbles: true,
            composed: true,
          }),
        );
        break;
      }

      default:
        break;
    }
  };

  //
  // Loop through every applicable EXPENSE_TYPES value
  //
  Object.entries(EXPENSE_TYPES)
    .filter(([key]) =>
      ['Meal', 'Lodging', 'Commoncarrier', 'Airtravel'].includes(key),
    )
    .forEach(([key, config]) => {
      describe(`${key} expense`, () => {
        it('renders correct heading from EXPENSE_TYPES.expensePageText', () => {
          const { getByText } = renderPage(config);
          expect(
            getByText(
              `${config.expensePageText
                .charAt(0)
                .toUpperCase()}${config.expensePageText.slice(1)} expense`,
            ),
          ).to.exist;
        });

        it('renders correct buttons', () => {
          const { container } = renderPage(config);

          // Click the back button
          const buttonPair = container.querySelector('va-button-pair');
          expect(buttonPair).to.exist;
          expect(buttonPair.getAttribute('left-button-text')).to.contain(
            'Back',
          );
          expect(buttonPair.getAttribute('right-button-text')).to.contain(
            'Continue',
          );
          const button = container.querySelector('va-button');
          expect(button).to.exist;
          expect(button.getAttribute('text')).to.eq(
            'Cancel adding this expense',
          );
        });

        it('displays validation error when required fields are missing', () => {
          const { getByText, container } = renderPage(config);
          const buttonPair = container.querySelector('va-button-pair');

          buttonPair.__events.primaryClick();

          expect(getByText(/please fill out all required fields/i)).to.exist;
        });

        it('navigates forward when required fields are filled', () => {
          const { container, getByTestId } = renderPage(config);

          fillRequiredFields(container, key);

          const buttonPair = container.querySelector('va-button-pair');
          buttonPair.__events.primaryClick();

          expect(getByTestId('location-display').textContent).to.equal(
            `/file-new-claim/12345/43555/${config.route}`,
          );
        });

        it('opens cancel modal', () => {
          const { container } = renderPage(config);
          const button = container.querySelector('va-button');
          // Click Cancel button
          fireEvent.click(button);

          const modal = container.querySelector('va-modal');
          expect(modal).to.exist;
          expect(modal.visible).to.be.true;
        });

        it('navigates back correctly', () => {
          const { container, getByTestId } = renderPage(config);

          const buttonPair = container.querySelector('va-button-pair');
          buttonPair.__events.secondaryClick();

          expect(getByTestId('location-display').textContent).to.equal(
            '/file-new-claim/12345/43555/choose-expense',
          );
        });

        it('focuses the error message on validation failure', async () => {
          const { container, getByTestId, getByText } = renderPage(config);
          const buttonPair = container.querySelector('va-button-pair');

          buttonPair.__events.primaryClick();

          await waitFor(() => {
            const error = getByTestId('expense-page-error');
            expect(
              getByText(
                'Please fill out all required fields before continuing.',
              ),
            ).to.exist;
            expect(document.activeElement).to.eq(error);
          });
        });
      });
    });
});
