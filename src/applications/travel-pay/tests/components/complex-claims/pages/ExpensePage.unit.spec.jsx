import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor, act } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import sinon from 'sinon';
import * as scrollUtils from 'platform/utilities/scroll/scroll';

import ExpensePage, {
  toBase64,
} from '../../../../components/complex-claims/pages/ExpensePage';
import ChooseExpenseType from '../../../../components/complex-claims/pages/ChooseExpenseType';
import reducer from '../../../../redux/reducer';
import {
  EXPENSE_TYPES,
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
  TRIP_TYPES,
} from '../../../../constants';

//
// Helper for capturing current route
//
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

//
// Helper for mocking FileReader in Node 22+ environments
//
const mockFileReader = () => {
  const originalFileReader = global.FileReader;
  const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
  const mockDataUrl = `data:application/pdf;base64,${mockBase64}`;

  global.FileReader = function MockFileReader() {
    this.readAsDataURL = function readAsDataURL() {
      this.result = mockDataUrl;
      setTimeout(() => this.onload(), 0);
    };
  };

  return () => {
    global.FileReader = originalFileReader;
  };
};

describe('Travel Pay – ExpensePage (Dynamic w/ EXPENSE_TYPES)', () => {
  //
  // Base store
  //
  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
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
          fetch: {
            isLoading: false,
            error: null,
          },
          data: null,
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [],
        },
        documentDelete: {
          id: '',
          isLoading: false,
          error: null,
        },
      },
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
    const root = containerWrapper?.baseElement || containerWrapper;
    if (!root) return;

    // ---- COMMON FIELDS ----
    const purchaseDate = root.querySelector('va-date[name="purchaseDate"]');
    const costRequested = root.querySelector(
      'va-text-input[name="costRequested"]',
    );
    const description = root.querySelector('va-textarea[name="description"]');
    const fileInput = root.querySelector('va-file-input');

    if (purchaseDate) {
      purchaseDate.value = '2025-10-31';
      purchaseDate.dispatchEvent(
        new CustomEvent('dateChange', {
          detail: { value: '2025-10-31' },
          bubbles: true,
          composed: true,
        }),
      );
    }

    if (costRequested) {
      costRequested.value = '50.00';
      const blurEvent = new Event('blur', { bubbles: true });
      Object.defineProperty(blurEvent, 'target', {
        writable: false,
        value: { value: '50.00', name: 'costRequested' },
      });
      costRequested.dispatchEvent(blurEvent);
    }

    if (description) {
      description.value = 'Test description for expense';

      const blurEvent = new Event('blur', { bubbles: true });
      Object.defineProperty(blurEvent, 'target', {
        writable: false,
        value: { value: 'Test description for expense', name: 'description' },
      });
      description.dispatchEvent(blurEvent);
    }

    if (fileInput) {
      const testFile = new File(['dummy'], 'receipt.pdf', {
        type: 'application/pdf',
      });
      fileInput.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { files: [testFile] },
          bubbles: true,
          composed: true,
        }),
      );
    }

    // ---- EXPENSE-SPECIFIC ----
    switch (expenseKey) {
      case 'Meal': {
        const vendor = root.querySelector('va-text-input[name="vendorName"]');
        if (vendor) {
          vendor.value = 'Test Vendor';
          const vendorEvent = new Event('input', { bubbles: true });
          Object.defineProperty(vendorEvent, 'target', {
            writable: false,
            value: { value: 'Test Vendor', name: 'vendorName' },
          });
          vendor.dispatchEvent(vendorEvent);
        }
        break;
      }
      case 'Lodging': {
        const vendor = root.querySelector('va-text-input[name="vendor"]');
        const checkIn = root.querySelector('va-date[name="checkInDate"]');
        const checkOut = root.querySelector('va-date[name="checkOutDate"]');
        if (vendor) {
          vendor.value = 'Test Hotel';
          const vendorEvent = new Event('input', { bubbles: true });
          Object.defineProperty(vendorEvent, 'target', {
            writable: false,
            value: { value: 'Test Hotel', name: 'vendor' },
          });
          vendor.dispatchEvent(vendorEvent);
        }
        if (checkIn) {
          checkIn.value = '2025-10-28';
          checkIn.dispatchEvent(
            new CustomEvent('dateChange', {
              detail: { value: '2025-10-28' },
              bubbles: true,
              composed: true,
            }),
          );
        }
        if (checkOut) {
          checkOut.value = '2025-10-30';
          checkOut.dispatchEvent(
            new CustomEvent('dateChange', {
              detail: { value: '2025-10-30' },
              bubbles: true,
              composed: true,
            }),
          );
        }
        break;
      }
      case 'CommonCarrier': {
        const carrierTypeOption = root.querySelector(
          `va-radio[name="carrierType"] va-radio-option`,
        );
        const reasonOption = root.querySelector(
          `va-radio[name="reasonNotUsingPOV"] va-radio-option`,
        );
        if (carrierTypeOption)
          carrierTypeOption.dispatchEvent(
            new CustomEvent('vaValueChange', {
              detail: { value: TRANSPORTATION_OPTIONS[0] },
              bubbles: true,
              composed: true,
            }),
          );
        if (reasonOption)
          reasonOption.dispatchEvent(
            new CustomEvent('vaValueChange', {
              detail: { value: Object.keys(TRANSPORTATION_REASONS)[0] },
              bubbles: true,
              composed: true,
            }),
          );
        break;
      }
      case 'AirTravel': {
        const vendorName = root.querySelector(
          'va-text-input[name="vendorName"]',
        );
        const tripTypeOption = root.querySelector(
          `va-radio[name="tripType"] va-radio-option[value="${
            TRIP_TYPES.ROUND_TRIP.value
          }"]`,
        );
        const departureDate = root.querySelector(
          'va-date[name="departureDate"]',
        );
        const returnDate = root.querySelector('va-date[name="returnDate"]');
        const departedFrom = root.querySelector(
          'va-text-input[name="departedFrom"]',
        );
        const arrivedTo = root.querySelector('va-text-input[name="arrivedTo"]');

        if (vendorName) {
          vendorName.value = 'Airline Vendor';
          const vendorEvent = new Event('input', { bubbles: true });
          Object.defineProperty(vendorEvent, 'target', {
            writable: false,
            value: { value: 'Airline Vendor', name: 'vendorName' },
          });
          vendorName.dispatchEvent(vendorEvent);
        }
        if (tripTypeOption)
          tripTypeOption.dispatchEvent(
            new CustomEvent('vaValueChange', {
              detail: { value: TRIP_TYPES.ROUND_TRIP.value },
              bubbles: true,
              composed: true,
            }),
          );
        if (departureDate) {
          departureDate.value = '2025-10-31';
          departureDate.dispatchEvent(
            new CustomEvent('dateChange', {
              detail: { value: '2025-10-31' },
              bubbles: true,
              composed: true,
            }),
          );
        }
        if (returnDate) {
          returnDate.value = '2025-11-01';
          returnDate.dispatchEvent(
            new CustomEvent('dateChange', {
              detail: { value: '2025-11-01' },
              bubbles: true,
              composed: true,
            }),
          );
        }
        if (departedFrom) {
          departedFrom.value = 'SFO';
          const departedEvent = new Event('input', { bubbles: true });
          Object.defineProperty(departedEvent, 'target', {
            writable: false,
            value: { value: 'SFO', name: 'departedFrom' },
          });
          departedFrom.dispatchEvent(departedEvent);
        }
        if (arrivedTo) {
          arrivedTo.value = 'LAX';
          const arrivedEvent = new Event('input', { bubbles: true });
          Object.defineProperty(arrivedEvent, 'target', {
            writable: false,
            value: { value: 'LAX', name: 'arrivedTo' },
          });
          arrivedTo.dispatchEvent(arrivedEvent);
        }
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
      ['Meal', 'Lodging', 'CommonCarrier', 'AirTravel'].includes(key),
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

        it('renders correct description', () => {
          const { getByText } = renderPage(config);

          if (key === 'AirTravel') {
            expect(
              getByText(
                `Upload a receipt or proof of the expense here. If you’re adding a round-trip flight, you only need to add 1 expense. If you have receipts for 2 one-way flights, you’ll need to add 2 separate expenses.`,
              ),
            ).to.exist;
          } else {
            expect(
              getByText(
                `Upload a receipt or proof of the expense here. If you have multiple ${
                  config.expensePageText
                } expenses, add just 1 on this page. You’ll be able to add more expenses after this.`,
              ),
            ).to.exist;
          }
        });

        it('renders "Cancel adding this expense" button only in add mode', () => {
          const { container } = renderPage(config);
          const cancelButton = Array.from(
            container.querySelectorAll('va-button'),
          ).find(
            btn => btn.getAttribute('text') === 'Cancel adding this expense',
          );
          expect(cancelButton).to.exist;
        });

        it('renders correct buttons', () => {
          const { container } = renderPage(config);

          // Get all buttons, will either see 3 or 2
          const buttons = container.querySelectorAll('va-button');
          expect(buttons.length).to.be.at.least(3);

          // Find the back/continue buttons in the button group
          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          expect(buttonGroup).to.exist;

          const backButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Back');
          expect(backButton).to.exist;

          const continueButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');
          expect(continueButton).to.exist;

          // Find "Cancel adding this expense" button - only in add mode
          const cancelButton = Array.from(buttons).find(
            btn => btn.getAttribute('text') === 'Cancel adding this expense',
          );
          expect(cancelButton).to.exist;
        });

        it('renders date hint text for Lodging expense', () => {
          const lodgingConfig = EXPENSE_TYPES.Lodging;
          const { container } = renderWithStoreAndRouter(
            <MemoryRouter
              initialEntries={[
                `/file-new-claim/12345/43555/${lodgingConfig.route}`,
              ]}
            >
              <Routes>
                <Route
                  path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
                  element={<ExpensePage />}
                />
              </Routes>
            </MemoryRouter>,
            {
              initialState: getData(),
              reducers: reducer,
            },
          );

          const dateInput = container.querySelector(
            'va-date[name="purchaseDate"]',
          );
          expect(dateInput).to.exist;

          // The hint text is rendered in the 'hint' attribute of the va-date component
          const hintAttr = dateInput.getAttribute('hint');
          expect(hintAttr).to.equal(
            'Enter the date on your receipt, even if it’s the same as your check in or check out dates.',
          );
        });

        it('does not render date hint text for non-Lodging expenses', () => {
          const mealConfig = EXPENSE_TYPES.Meal;
          const { container } = renderPage(mealConfig);
          const dateInput = container.querySelector(
            'va-date[name="purchaseDate"]',
          );
          expect(dateInput).to.exist;
          expect(dateInput.getAttribute('hint')).to.equal('');
        });

        it('displays validation error when required fields are missing', () => {
          const { container } = renderPage(config);

          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          const continueButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');

          fireEvent.click(continueButton);

          const purchaseDateInput = container.querySelector(
            'va-date[name="purchaseDate"]',
          );
          const amountInput = container.querySelector(
            'va-text-input[name="costRequested"]',
          );
          const descriptionInput = container.querySelector(
            'va-textarea[name="description"]',
          );

          expect(purchaseDateInput.getAttribute('error')).to.exist;
          expect(amountInput.getAttribute('error')).to.exist;
          expect(descriptionInput.getAttribute('error')).to.exist;
        });

        it('navigates forward when required fields are filled', () => {
          const { container, getByTestId } = renderPage(config);

          fillRequiredFields(container, key);

          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          const continueButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');
          fireEvent.click(continueButton);

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

          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          const backButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Back');
          fireEvent.click(backButton);

          expect(getByTestId('location-display').textContent).to.equal(
            '/file-new-claim/12345/43555/choose-expense',
          );
        });

        it('shows receipt error when continue is clicked without a file', async () => {
          const { container } = renderPage(config);

          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          const continueButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');

          fireEvent.click(continueButton);

          await waitFor(() => {
            const fileInput = container.querySelector('va-file-input');
            expect(fileInput).to.exist;
            expect(fileInput.getAttribute('error')).to.equal(
              'Select an approved file type under 5MB',
            );
          });
        });

        describe('Travel Pay – ExpensePage (Validation & Error Handling)', () => {
          describe(`${key} expense validation`, () => {
            it('shows error when required fields are empty', async () => {
              const { container } = renderPage(config);

              const continueButton = Array.from(
                container.querySelectorAll(
                  '.travel-pay-button-group va-button',
                ),
              ).find(btn => btn.getAttribute('text') === 'Continue');

              fireEvent.click(continueButton);

              await waitFor(() => {
                const dateInput = container.querySelector(
                  'va-date[name="purchaseDate"]',
                );
                const amountInput = container.querySelector(
                  'va-text-input[name="costRequested"]',
                );
                const descriptionInput = container.querySelector(
                  'va-textarea[name="description"]',
                );

                expect(dateInput.getAttribute('error')).to.exist;
                expect(amountInput.getAttribute('error')).to.exist;
                expect(descriptionInput.getAttribute('error')).to.exist;

                if (key === 'Meal') {
                  const vendorNameInput = container.querySelector(
                    'va-text-input[name="vendorName"]',
                  );
                  expect(vendorNameInput.getAttribute('error')).to.exist;
                }

                if (key === 'Lodging') {
                  const vendorInput = container.querySelector(
                    'va-text-input[name="vendor"]',
                  );
                  const checkInDateInput = container.querySelector(
                    'va-date[name="checkInDate"]',
                  );
                  const checkOutDate = container.querySelector(
                    'va-date[name="checkOutDate"]',
                  );
                  expect(vendorInput.getAttribute('error')).to.exist;
                  expect(checkInDateInput.getAttribute('error')).to.exist;
                  expect(checkOutDate.getAttribute('error')).to.exist;
                }

                if (key === 'Airtravel') {
                  const vendorNameInput = container.querySelector(
                    'va-text-input[name="vendorName"]',
                  );
                  const tripTypeRadio = container.querySelector(
                    'va-radio[name="tripType"]',
                  );
                  const departureDate = container.querySelector(
                    'va-date[name="departureDate"]',
                  );
                  const departedFromInput = container.querySelector(
                    'va-text-input[name="departedFrom"]',
                  );
                  const arrivedToInput = container.querySelector(
                    'va-text-input[name="arrivedTo"]',
                  );
                  const returnDate = container.querySelector(
                    'va-date[name="returnDate"]',
                  );
                  expect(vendorNameInput.getAttribute('error')).to.exist;
                  expect(tripTypeRadio.getAttribute('error')).to.exist;
                  expect(departureDate.getAttribute('error')).to.exist;
                  expect(departedFromInput.getAttribute('error')).to.exist;
                  expect(arrivedToInput.getAttribute('error')).to.exist;
                  expect(returnDate.getAttribute('error')).to.not.exist; // returnDate not required unless ROUND_TRIP
                }

                if (key === 'Commoncarrier') {
                  const carrierTypeRadio = container.querySelector(
                    'va-radio[name="carrierType"]',
                  );
                  const reasonNotUsingPOVRadio = container.querySelector(
                    'va-radio[name="reasonNotUsingPOV"]',
                  );

                  expect(carrierTypeRadio.getAttribute('error')).to.exist;
                  expect(reasonNotUsingPOVRadio.getAttribute('error')).to.exist;
                }
              });
            });

            it('clears errors when required fields are filled', async () => {
              const restoreFileReader = mockFileReader();

              const { container, getByTestId } = renderPage(config);

              // Trigger validation to show errors first
              const buttonGroup = container.querySelector(
                '.travel-pay-button-group',
              );
              const continueButton = Array.from(
                buttonGroup.querySelectorAll('va-button'),
              ).find(btn => btn.getAttribute('text') === 'Continue');

              fireEvent.click(continueButton);

              // Wait for errors to appear
              await waitFor(() => {
                const dateInput = container.querySelector(
                  'va-date[name="purchaseDate"]',
                );
                expect(dateInput.getAttribute('error')).to.exist;
                const amountInput = container.querySelector(
                  'va-text-input[name="costRequested"]',
                );
                expect(amountInput.getAttribute('error')).to.exist;
                const descriptionInput = container.querySelector(
                  'va-textarea[name="description"]',
                );
                expect(descriptionInput.getAttribute('error')).to.exist;
                const fileInput = container.querySelector('va-file-input');
                expect(fileInput.getAttribute('error')).to.exist;
                if (key === 'Commoncarrier') {
                  const carrierType = container.querySelector(
                    'va-radio[name="carrierType"]',
                  );
                  const reason = container.querySelector(
                    'va-radio[name="reasonNotUsingPOV"]',
                  );

                  expect(carrierType.getAttribute('error')).to.exist;
                  expect(reason.getAttribute('error')).to.exist;
                }
              });

              // Fill in all required fields
              fillRequiredFields(container, key);

              // Click continue again - if validation passes, navigation should occur
              fireEvent.click(continueButton);

              // Verify navigation happened (proving validation passed/errors cleared)
              await waitFor(() => {
                expect(getByTestId('location-display').textContent).to.equal(
                  `/file-new-claim/12345/43555/${config.route}`,
                );
              });

              restoreFileReader();
            });

            it('clears receipt error when a file is uploaded', async () => {
              const restoreFileReader = mockFileReader();

              const { container } = renderPage(config);

              // Trigger validation
              const continueButton = Array.from(
                container.querySelectorAll(
                  '.travel-pay-button-group va-button',
                ),
              ).find(btn => btn.getAttribute('text') === 'Continue');

              fireEvent.click(continueButton);

              const fileInput = container.querySelector('va-file-input');
              expect(fileInput.getAttribute('error')).to.exist;

              // Upload a file
              const testFile = new File(['dummy content'], 'receipt.pdf', {
                type: 'application/pdf',
              });

              // Dispatch the vaChange event wrapped in act
              await act(async () => {
                fileInput.dispatchEvent(
                  new CustomEvent('vaChange', {
                    detail: { files: [testFile] },
                    bubbles: true,
                    composed: true,
                  }),
                );
              });

              // Wait for the component to update
              await waitFor(() => {
                expect(fileInput.getAttribute('error')).to.be.null;
              });

              restoreFileReader();
            });

            it('shows errors for missing Common Carrier fields on continue', async () => {
              if (key !== 'Commoncarrier') return;

              const { container } = renderPage(config);

              const continueButton = Array.from(
                container.querySelectorAll(
                  '.travel-pay-button-group va-button',
                ),
              ).find(btn => btn.getAttribute('text') === 'Continue');

              fireEvent.click(continueButton);

              await waitFor(() => {
                const carrierType = container.querySelector(
                  'va-radio[name="carrierType"]',
                );
                const reason = container.querySelector(
                  'va-radio[name="reasonNotUsingPOV"]',
                );

                expect(carrierType.getAttribute('error')).to.equal(
                  'Select a transportation type',
                );
                expect(reason.getAttribute('error')).to.equal(
                  'Select a reason',
                );
              });
            });

            it('clears carrierType error when a transportation option is selected', async () => {
              if (key !== 'CommonCarrier') return;

              const { container } = renderPage(config);

              // Trigger error
              const continueButton = Array.from(
                container.querySelectorAll(
                  '.travel-pay-button-group va-button',
                ),
              ).find(btn => btn.getAttribute('text') === 'Continue');

              fireEvent.click(continueButton);

              const carrierRadio = container.querySelector(
                'va-radio[name="carrierType"]',
              );

              expect(carrierRadio.getAttribute('error')).to.exist;

              // Select an option
              carrierRadio.dispatchEvent(
                new CustomEvent('vaValueChange', {
                  detail: { value: TRANSPORTATION_OPTIONS[0] },
                  bubbles: true,
                  composed: true,
                }),
              );

              await waitFor(() => {
                expect(carrierRadio.getAttribute('error')).to.not.exist;
              });
            });

            it('validates AirTravel required fields', async () => {
              if (key !== 'AirTravel') return;

              const { container } = renderPage(config);

              // Trigger error
              const continueButton = Array.from(
                container.querySelectorAll(
                  '.travel-pay-button-group va-button',
                ),
              ).find(btn => btn.getAttribute('text') === 'Continue');

              fireEvent.click(continueButton);

              await waitFor(() => {
                const tripType = container.querySelector(
                  'va-radio[name="tripType"]',
                );
                const departureDate = container.querySelector(
                  'va-date[name="departureDate"]',
                );

                expect(tripType.getAttribute('error')).to.exist;
                expect(departureDate.getAttribute('error')).to.exist;
              });
            });
          });

          it('requires return date when Airtravel tripType is Round Trip', async () => {
            if (key !== 'Airtravel') return;

            const restoreFileReader = mockFileReader();
            const { container } = renderPage(EXPENSE_TYPES.Airtravel);

            const tripTypeRadio = container.querySelector(
              'va-radio[name="tripType"]',
            );

            // Select an option
            tripTypeRadio.dispatchEvent(
              new CustomEvent('vaValueChange', {
                detail: { value: TRIP_TYPES.ROUND_TRIP.value },
                bubbles: true,
                composed: true,
              }),
            );

            // Intentionally do NOT fill returnDate - leave it empty

            // Click Continue to trigger validation
            const continueButton = Array.from(
              container.querySelectorAll('.travel-pay-button-group va-button'),
            ).find(btn => btn.getAttribute('text') === 'Continue');

            fireEvent.click(continueButton);

            // Wait for error to appear on return date
            await waitFor(() => {
              const returnDate = container.querySelector(
                'va-date[name="returnDate"]',
              );
              expect(returnDate.getAttribute('error')).to.equal(
                'Enter a return date',
              );
            });

            restoreFileReader();
          });

          it('updates formState when a document is uploaded', async () => {
            const { container } = renderPage(config);
            const input = container.querySelector('va-file-input');
            if (!input) return;

            const testFile = new File(['dummy'], 'receipt.pdf', {
              type: 'application/pdf',
            });

            fireEvent.change(input, { target: { files: [testFile] } });

            await waitFor(() => {
              expect(input.files[0]).to.eq(testFile);
            });
          });
        });

        it('does not require return date when AirTravel tripType is One Way', async () => {
          if (key !== 'AirTravel') return;

          const restoreFileReader = mockFileReader();
          const { container, getByTestId } = renderPage(
            EXPENSE_TYPES.AirTravel,
          );

          const tripTypeRadio = container.querySelector(
            'va-radio[name="tripType"]',
          );

          // Select One Way
          tripTypeRadio.dispatchEvent(
            new CustomEvent('vaValueChange', {
              detail: { value: TRIP_TYPES.ONE_WAY.value },
              bubbles: true,
              composed: true,
            }),
          );

          // Intentionally leave returnDate empty

          // Fill required fields except returnDate
          const purchaseDate = container.querySelector(
            'va-date[name="purchaseDate"]',
          );
          const costRequested = container.querySelector(
            'va-text-input[name="costRequested"]',
          );
          const description = container.querySelector(
            'va-textarea[name="description"]',
          );
          const vendorName = container.querySelector(
            'va-text-input[name="vendorName"]',
          );
          const departureDate = container.querySelector(
            'va-date[name="departureDate"]',
          );
          const departedFrom = container.querySelector(
            'va-text-input[name="departedFrom"]',
          );
          const arrivedTo = container.querySelector(
            'va-text-input[name="arrivedTo"]',
          );

          purchaseDate.value = '2025-10-31';
          purchaseDate.dispatchEvent(
            new CustomEvent('dateChange', {
              detail: { value: '2025-10-31' },
              bubbles: true,
              composed: true,
            }),
          );
          costRequested.value = '100';
          costRequested.dispatchEvent(new Event('blur', { bubbles: true }));
          description.value = 'Test one way';
          description.dispatchEvent(new Event('blur', { bubbles: true }));
          vendorName.value = 'Test Airline';
          vendorName.dispatchEvent(new Event('input', { bubbles: true }));
          departureDate.value = '2025-10-31';
          departureDate.dispatchEvent(
            new CustomEvent('dateChange', {
              detail: { value: '2025-10-31' },
              bubbles: true,
              composed: true,
            }),
          );
          departedFrom.value = 'SFO';
          departedFrom.dispatchEvent(new Event('input', { bubbles: true }));
          arrivedTo.value = 'LAX';
          arrivedTo.dispatchEvent(new Event('input', { bubbles: true }));

          // Click Continue
          const continueButton = Array.from(
            container.querySelectorAll('.travel-pay-button-group va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');

          fireEvent.click(continueButton);

          // Wait and assert that navigation occurs, meaning validation passed
          await waitFor(() => {
            expect(getByTestId('location-display').textContent).to.equal(
              `/file-new-claim/12345/43555/${EXPENSE_TYPES.AirTravel.route}`,
            );
          });

          restoreFileReader();
        });
      });

      describe('DocumentUpload behavior', () => {
        const expenseTypesWithDocumentUpload = [
          'Meal',
          'Lodging',
          'AirTravel',
          'CommonCarrier',
          'Parking',
          'Toll',
          'Lodging',
          'Other',
        ];
        it('renders DocumentUpload for expense types that support documents', () => {
          const { container } = renderPage(config);

          // If the type should have document upload
          if (expenseTypesWithDocumentUpload.includes(key)) {
            expect(container.querySelector('va-file-input')).to.exist;
          } else {
            expect(container.querySelector('va-file-input')).to.not.exist;
          }
        });

        it('updates formState when a file is uploaded', async () => {
          if (!expenseTypesWithDocumentUpload.includes(key)) return;

          const { container } = renderPage(config);
          const input = container.querySelector('va-file-input');

          const testFile = new File(['dummy'], 'receipt.pdf', {
            type: 'application/pdf',
          });

          fireEvent.change(input, {
            target: { files: [testFile] },
          });

          await waitFor(() => {
            // Verify the uploaded file exists in input
            expect(input.files[0]).to.eq(testFile);
          });
        });
        it('does not appear for expense types that do not accept documents', () => {
          if (['Mileage'].includes(key)) {
            const { container } = renderPage(config);
            expect(container.querySelector('va-file-input')).to.not.exist;
          }
        });
      });
    });
});

describe('ExpensePage - Air Travel Receipt Date Validation', () => {
  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
      complexClaim: {
        claim: {
          creation: {
            isLoading: false,
            error: null,
            data: {
              id: '43555',
              claimNumber: null,
              claimStatus: 'InProgress',
              appointmentDateTime: '2025-02-02T00:00:00.000-06:00',
              facilityName: 'Cheyenne VA Medical Center',
            },
          },
        },
        expenses: [],
        backDestination: null,
      },
    },
    featureToggles: {
      travelPayEnableComplexClaims: true,
    },
  });

  const renderDateValidationPage = config => {
    return renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/12345/43555/${config.route}`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );
  };

  let restoreFileReader;

  beforeEach(() => {
    restoreFileReader = mockFileReader();
  });

  afterEach(() => {
    restoreFileReader();
  });

  it('validates future date when form is submitted', async () => {
    const { container } = renderDateValidationPage(EXPENSE_TYPES.AirTravel);

    // Fill in all required fields except date (or with invalid date)
    const vendorInput = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    vendorInput.value = 'Test Airline';
    fireEvent.blur(vendorInput);

    const tripTypeRadio = container.querySelector('va-radio[name="tripType"]');
    tripTypeRadio.dispatchEvent(
      new CustomEvent('vaValueChange', {
        detail: { value: 'OneWay' },
        bubbles: true,
        composed: true,
      }),
    );

    const departureDate = container.querySelector(
      'va-date[name="departureDate"]',
    );
    departureDate.value = '2025-10-31';
    departureDate.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '2025-10-31' },
        bubbles: true,
        composed: true,
      }),
    );

    const departedFrom = container.querySelector(
      'va-text-input[name="departedFrom"]',
    );
    departedFrom.value = 'LAX';
    fireEvent.blur(departedFrom);

    const arrivedTo = container.querySelector(
      'va-text-input[name="arrivedTo"]',
    );
    arrivedTo.value = 'JFK';
    fireEvent.blur(arrivedTo);

    // Set future date for purchaseDate
    const purchaseDateInput = container.querySelector(
      'va-date[name="purchaseDate"]',
    );
    purchaseDateInput.value = '2026-06-02';
    purchaseDateInput.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '2026-06-02' },
        bubbles: true,
        composed: true,
      }),
    );

    const costInput = container.querySelector(
      'va-text-input[name="costRequested"]',
    );
    costInput.value = '500.00';
    fireEvent.blur(costInput);

    const descInput = container.querySelector(
      'va-textarea[name="description"]',
    );
    descInput.value = 'Test flight expense';
    fireEvent.blur(descInput);

    // Upload a file
    const fileInput = container.querySelector('va-file-input');
    const testFile = new File(['dummy'], 'receipt.pdf', {
      type: 'application/pdf',
    });
    await act(async () => {
      fileInput.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { files: [testFile] },
          bubbles: true,
          composed: true,
        }),
      );
    });

    // Click Continue to trigger validation
    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Continue');

    fireEvent.click(continueButton);

    // Should show future date error
    await waitFor(() => {
      expect(purchaseDateInput.getAttribute('error')).to.equal(
        "Don't enter a future date",
      );
    });
  });

  it('validates incomplete date when form is submitted', async () => {
    const { container } = renderDateValidationPage(EXPENSE_TYPES.AirTravel);

    // Fill in all required fields except date (or with invalid date)
    const vendorInput = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    vendorInput.value = 'Test Airline';
    fireEvent.blur(vendorInput);

    const tripTypeRadio = container.querySelector('va-radio[name="tripType"]');
    tripTypeRadio.dispatchEvent(
      new CustomEvent('vaValueChange', {
        detail: { value: 'OneWay' },
        bubbles: true,
        composed: true,
      }),
    );

    const departureDate = container.querySelector(
      'va-date[name="departureDate"]',
    );
    departureDate.value = '2025-10-31';
    departureDate.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '2025-10-31' },
        bubbles: true,
        composed: true,
      }),
    );

    const departedFrom = container.querySelector(
      'va-text-input[name="departedFrom"]',
    );
    departedFrom.value = 'LAX';
    fireEvent.blur(departedFrom);

    const arrivedTo = container.querySelector(
      'va-text-input[name="arrivedTo"]',
    );
    arrivedTo.value = 'JFK';
    fireEvent.blur(arrivedTo);

    // Set incomplete date for purchaseDate (missing day)
    const purchaseDateInput = container.querySelector(
      'va-date[name="purchaseDate"]',
    );
    purchaseDateInput.value = '2026--01';
    purchaseDateInput.dispatchEvent(
      new CustomEvent('dateChange', {
        detail: { value: '2026--01' },
        bubbles: true,
        composed: true,
      }),
    );

    const costInput = container.querySelector(
      'va-text-input[name="costRequested"]',
    );
    costInput.value = '500.00';
    fireEvent.blur(costInput);

    const descInput = container.querySelector(
      'va-textarea[name="description"]',
    );
    descInput.value = 'Test flight expense';
    fireEvent.blur(descInput);

    // Upload a file
    const fileInput = container.querySelector('va-file-input');
    const testFile = new File(['dummy'], 'receipt.pdf', {
      type: 'application/pdf',
    });
    await act(async () => {
      fileInput.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { files: [testFile] },
          bubbles: true,
          composed: true,
        }),
      );
    });

    // Click Continue to trigger validation
    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Continue');

    fireEvent.click(continueButton);

    // Should show incomplete date error
    await waitFor(() => {
      expect(purchaseDateInput.getAttribute('error')).to.equal(
        'Please enter a complete date',
      );
    });
  });
});

// ---------------------------------------------------------------
// EDIT MODE TESTS
// ---------------------------------------------------------------
describe('Travel Pay – ExpensePage (Editing existing expense)', () => {
  const TEST_EXPENSE_ID = 'abc123';
  const TEST_DOCUMENT_ID = 'doc789';

  const defaultExpense = {
    id: TEST_EXPENSE_ID,
    expenseType: 'Meal',
    vendorName: 'Saved Vendor',
    dateIncurred: '2025-11-17',
    costRequested: '10.50',
    documentId: TEST_DOCUMENT_ID,
  };

  //
  // Store containing an existing expense
  //
  const getEditState = expenses => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
      complexClaim: {
        claim: {
          creation: { isLoading: false, error: null },
          submission: { id: '', isSubmitting: false, error: null, data: null },
          fetch: { isLoading: false, error: null },
          data: {
            documents: [
              {
                filename: 'saved.pdf',
                mimetype: 'application/pdf',
                fileData: 'AA==',
                documentId: TEST_DOCUMENT_ID,
                createdon: '2025-11-17',
              },
            ],
          },
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [...expenses],
        },
        documentDelete: {
          id: '',
          isLoading: false,
          error: null,
        },
      },
    },
  });

  const renderEditPage = (expenses = [{ ...defaultExpense }]) =>
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/12345/43555/meal/${TEST_EXPENSE_ID}`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute/:expenseId"
            element={<ExpensePage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<div data-testid="review-page" />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      { initialState: getEditState(expenses), reducers: reducer },
    );

  let apiStub;
  beforeEach(() => {
    apiStub = sinon.stub(api, 'apiRequest').callsFake(url => {
      // Mock expense fetch
      if (url.includes('/claims/43555/expenses/meal/')) {
        return Promise.resolve({
          id: TEST_EXPENSE_ID,
          expenseType: 'Meal',
          vendorName: 'Saved Vendor',
          dateIncurred: '2025-11-17',
          costRequested: '10.50',
          description: 'Test expense description',
        });
      }
      // Mock document fetch
      if (url.includes('/documents/')) {
        return Promise.resolve({
          headers: {
            get: key => (key === 'Content-Type' ? 'application/pdf' : '1024'),
          },
          arrayBuffer: async () => new TextEncoder().encode('dummy').buffer,
        });
      }
      return Promise.reject(new Error('Unmocked API call'));
    });
  });
  afterEach(() => {
    apiStub.restore();
  });

  it('pre-fills formState with the stored expense', async () => {
    const { container } = renderEditPage();

    // Wait for expense to load from API
    await waitFor(() => {
      const vendorField = container.querySelector(
        'va-text-input[name="vendorName"]',
      );
      expect(vendorField?.getAttribute('value')).to.equal('Saved Vendor');
    });

    const costField = container.querySelector(
      'va-text-input[name="costRequested"]',
    );
    expect(costField.getAttribute('value')).to.equal('10.50');
  });

  it('uses "Save and continue" text for continue button', async () => {
    const { container } = renderEditPage();

    // Wait for data to load and buttons to render
    await waitFor(() => {
      const button = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('text') === 'Save and continue',
      );
      expect(button).to.exist;
    });
  });

  it('uses "Cancel" text for back button', async () => {
    const { container } = renderEditPage();

    // Wait for data to load and buttons to render
    await waitFor(() => {
      const button = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('text') === 'Cancel',
      );
      expect(button).to.exist;
    });
  });

  it('does NOT render "Cancel adding this expense" button when in add mode', () => {
    const { container } = renderEditPage();
    const addCancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Cancel adding this expense');
    expect(addCancelButton).to.not.exist;
  });

  it('"Back" button opens modal in edit mode', async () => {
    const { container } = renderEditPage();

    // Wait for data to load and buttons to render
    let backButton;
    await waitFor(() => {
      backButton = Array.from(container.querySelectorAll('va-button')).find(
        btn => btn.getAttribute('text') === 'Cancel',
      );
      expect(backButton).to.exist;
    });

    fireEvent.click(backButton);
    const modal = container.querySelector('va-modal');
    expect(modal.getAttribute('visible')).to.equal('true');
  });

  it('loads existing document when documentId is present', async () => {
    const { container } = renderEditPage();

    // Component shows page-level loading indicator first
    await waitFor(() => {
      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
    });

    // Then shows the form after data loads
    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });
  });

  it('shows loading state when document is being deleted', async () => {
    const baseState = getEditState([{ ...defaultExpense }]);
    const stateWithDeletion = {
      ...baseState,
      travelPay: {
        ...baseState.travelPay,
        complexClaim: {
          ...baseState.travelPay.complexClaim,
          documentDelete: {
            id: TEST_DOCUMENT_ID,
            isLoading: true,
            error: null,
          },
        },
      },
    };

    const { container } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/12345/43555/meal/${TEST_EXPENSE_ID}`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute/:expenseId"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      { initialState: stateWithDeletion, reducers: reducer },
    );

    // Wait for data to load and buttons to render
    await waitFor(() => {
      const buttonGroup = container.querySelector('.travel-pay-button-group');
      expect(buttonGroup).to.exist;
    });

    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Save and continue');

    expect(continueButton.getAttribute('loading')).to.equal('true');
  });

  it('shows loading state when expense is being updated', async () => {
    const baseState = getEditState([{ ...defaultExpense }]);
    const stateWithUpdate = {
      ...baseState,
      travelPay: {
        ...baseState.travelPay,
        complexClaim: {
          ...baseState.travelPay.complexClaim,
          expenses: {
            ...baseState.travelPay.complexClaim.expenses,
            update: {
              id: TEST_EXPENSE_ID,
              isLoading: true,
              error: null,
            },
          },
        },
      },
    };

    const { container } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/12345/43555/meal/${TEST_EXPENSE_ID}`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute/:expenseId"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      { initialState: stateWithUpdate, reducers: reducer },
    );

    // Wait for data to load and buttons to render
    await waitFor(() => {
      const buttonGroup = container.querySelector('.travel-pay-button-group');
      expect(buttonGroup).to.exist;
    });

    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Save and continue');

    expect(continueButton.getAttribute('loading')).to.equal('true');
  });

  it('does not re-fetch document if already loaded (previousDocumentId check)', async () => {
    renderEditPage();

    await waitFor(() => {
      // Should call API twice: once for expense, once for document
      expect(apiStub.callCount).to.equal(2);
    });

    // apiStub should only be called twice total (expense + document), even if component re-renders
    expect(apiStub.callCount).to.equal(2);
  });

  it('initializes form fields only once (fieldsInitialized check)', async () => {
    const { container } = renderEditPage();

    // Wait for expense to load from API
    await waitFor(() => {
      const vendorField = container.querySelector(
        'va-text-input[name="vendorName"]',
      );
      expect(vendorField?.getAttribute('value')).to.equal('Saved Vendor');
    });

    // Fields should remain initialized even after potential re-renders
    const costField = container.querySelector(
      'va-text-input[name="costRequested"]',
    );
    expect(costField.getAttribute('value')).to.equal('10.50');
  });

  it('shows description error for min length', async () => {
    // Override API stub for this test to return short description
    apiStub.restore();
    apiStub = sinon.stub(api, 'apiRequest').callsFake(url => {
      if (url.includes('/claims/43555/expenses/meal/')) {
        return Promise.resolve({
          id: TEST_EXPENSE_ID,
          expenseType: 'Meal',
          vendorName: 'Saved Vendor',
          dateIncurred: '2025-11-17',
          costRequested: '10.50',
          description: '123',
        });
      }
      if (url.includes('/documents/')) {
        return Promise.resolve({
          headers: {
            get: key => (key === 'Content-Type' ? 'application/pdf' : '1024'),
          },
          arrayBuffer: async () => new TextEncoder().encode('dummy').buffer,
        });
      }
      return Promise.reject(new Error('Unmocked API call'));
    });

    const { container } = renderEditPage();

    // Wait for data to load
    await waitFor(() => {
      const inputText = container.querySelector(
        'va-textarea[name="description"]',
      );
      expect(inputText?.getAttribute('value')).to.equal('123');
    });

    const inputText = container.querySelector(
      'va-textarea[name="description"]',
    );

    // Click continue to trigger validation
    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Save and continue');

    fireEvent.click(continueButton);

    await waitFor(
      () => {
        const errorAttr = inputText.getAttribute('error');
        expect(errorAttr).to.exist;
        expect(errorAttr).to.equal('Enter at least 5 characters');
      },
      { timeout: 3000 },
    );
  });

  it('shows description error for max length', async () => {
    // Override API stub for this test to return long description
    apiStub.restore();
    apiStub = sinon.stub(api, 'apiRequest').callsFake(url => {
      if (url.includes('/claims/43555/expenses/meal/')) {
        return Promise.resolve({
          id: TEST_EXPENSE_ID,
          expenseType: 'Meal',
          vendorName: 'Saved Vendor',
          dateIncurred: '2025-11-17',
          costRequested: '10.50',
          description: 'a'.repeat(2001),
        });
      }
      if (url.includes('/documents/')) {
        return Promise.resolve({
          headers: {
            get: key => (key === 'Content-Type' ? 'application/pdf' : '1024'),
          },
          arrayBuffer: async () => new TextEncoder().encode('dummy').buffer,
        });
      }
      return Promise.reject(new Error('Unmocked API call'));
    });

    const { container } = renderEditPage();

    // Wait for data to load
    await waitFor(() => {
      const inputText = container.querySelector(
        'va-textarea[name="description"]',
      );
      expect(inputText?.getAttribute('value')).to.have.length.greaterThan(2000);
    });

    const inputText = container.querySelector(
      'va-textarea[name="description"]',
    );

    // Click continue to trigger validation
    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Save and continue');

    fireEvent.click(continueButton);

    await waitFor(
      () => {
        const errorAttr = inputText.getAttribute('error');
        expect(errorAttr).to.exist;
        expect(errorAttr).to.equal('Enter no more than 2,000 characters');
      },
      { timeout: 3000 },
    );
  });

  it('shows cost requested amount error when value is 0', async () => {
    // Override API stub for this test to return 0 cost
    apiStub.restore();
    apiStub = sinon.stub(api, 'apiRequest').callsFake(url => {
      if (url.includes('/claims/43555/expenses/meal/')) {
        return Promise.resolve({
          id: TEST_EXPENSE_ID,
          expenseType: 'Meal',
          vendorName: 'Saved Vendor',
          dateIncurred: '2025-11-17',
          costRequested: '0',
          description: 'Test expense description',
        });
      }
      if (url.includes('/documents/')) {
        return Promise.resolve({
          headers: {
            get: key => (key === 'Content-Type' ? 'application/pdf' : '1024'),
          },
          arrayBuffer: async () => new TextEncoder().encode('dummy').buffer,
        });
      }
      return Promise.reject(new Error('Unmocked API call'));
    });

    const { container } = renderEditPage();

    // Wait for data to load
    await waitFor(() => {
      const inputText = container.querySelector(
        'va-text-input[name="costRequested"]',
      );
      expect(inputText?.getAttribute('value')).to.equal('0');
    });

    const inputText = container.querySelector(
      'va-text-input[name="costRequested"]',
    );

    // Click continue to trigger validation
    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Save and continue');

    fireEvent.click(continueButton);

    await waitFor(
      () => {
        const errorAttr = inputText.getAttribute('error');
        expect(errorAttr).to.exist;
        expect(errorAttr).to.include('Enter an amount greater than 0');
      },
      { timeout: 3000 },
    );
  });

  describe('Back button navigation with backDestination', () => {
    it('navigates to review page when back button is clicked in add mode with backDestination="review"', async () => {
      const baseState = getEditState([]);
      const stateWithBackDestination = {
        ...baseState,
        travelPay: {
          ...baseState.travelPay,
          complexClaim: {
            ...baseState.travelPay.complexClaim,
            expenseBackDestination: 'review',
          },
        },
      };

      const { container, getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/43555/lodging']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
              element={<ExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<div>Review Page</div>}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<div>Choose Expense Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        { initialState: stateWithBackDestination, reducers: reducer },
      );

      // Wait for page to load
      await waitFor(() => {
        const vendorField = container.querySelector(
          'va-text-input[name="vendor"]',
        );
        expect(vendorField).to.exist;
      });

      // Find and click the Back button in the button pair
      const buttonGroup = container.querySelector('.travel-pay-button-group');
      const backButton = Array.from(
        buttonGroup.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Back');
      expect(backButton).to.exist;
      fireEvent.click(backButton);

      // Verify navigation to review page
      await waitFor(() => {
        const location = getByTestId('location-display');
        expect(location.textContent).to.equal(
          '/file-new-claim/12345/43555/review',
        );
      });
    });

    it('navigates to choose-expense page when back button is clicked in add mode without backDestination="review"', async () => {
      const baseState = getEditState([]);
      const stateWithoutReviewDestination = {
        ...baseState,
        travelPay: {
          ...baseState.travelPay,
          complexClaim: {
            ...baseState.travelPay.complexClaim,
            expenseBackDestination: 'choose-expense',
          },
        },
      };

      const { container, getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/43555/lodging']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
              element={<ExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<div>Review Page</div>}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<div>Choose Expense Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        { initialState: stateWithoutReviewDestination, reducers: reducer },
      );

      // Wait for page to load
      await waitFor(() => {
        const vendorField = container.querySelector(
          'va-text-input[name="vendor"]',
        );
        expect(vendorField).to.exist;
      });

      // Find and click the Back button in the button pair
      const buttonGroup = container.querySelector('.travel-pay-button-group');
      const backButton = Array.from(
        buttonGroup.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Back');
      expect(backButton).to.exist;
      fireEvent.click(backButton);

      // Verify navigation to choose-expense page
      await waitFor(() => {
        const location = getByTestId('location-display');
        expect(location.textContent).to.equal(
          '/file-new-claim/12345/43555/choose-expense',
        );
      });
    });

    it('navigates to choose-expense page when back button is clicked in add mode with undefined backDestination', async () => {
      const baseState = getEditState([]);
      const stateWithUndefinedDestination = {
        ...baseState,
        travelPay: {
          ...baseState.travelPay,
          complexClaim: {
            ...baseState.travelPay.complexClaim,
            expenseBackDestination: undefined,
          },
        },
      };

      const { container, getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/43555/toll']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
              element={<ExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<div>Review Page</div>}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<div>Choose Expense Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        { initialState: stateWithUndefinedDestination, reducers: reducer },
      );

      // Wait for page to load
      await waitFor(() => {
        const amountField = container.querySelector(
          'va-text-input[name="costRequested"]',
        );
        expect(amountField).to.exist;
      });

      // Find and click the Back button in the button pair
      const buttonGroup = container.querySelector('.travel-pay-button-group');
      const backButton = Array.from(
        buttonGroup.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Back');
      expect(backButton).to.exist;
      fireEvent.click(backButton);

      // Verify navigation to choose-expense page
      await waitFor(() => {
        const location = getByTestId('location-display');
        expect(location.textContent).to.equal(
          '/file-new-claim/12345/43555/choose-expense',
        );
      });
    });
  });

  describe('Cancel modal navigation with backDestination', () => {
    it('navigates to review page when confirming cancel in add mode with backDestination="review"', async () => {
      const baseState = getEditState([]);
      const stateWithBackDestination = {
        ...baseState,
        travelPay: {
          ...baseState.travelPay,
          complexClaim: {
            ...baseState.travelPay.complexClaim,
            expenseBackDestination: 'review',
          },
        },
      };

      const { container, getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/43555/meal']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
              element={<ExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<div data-testid="review-page" />}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        { initialState: stateWithBackDestination, reducers: reducer },
      );

      // Wait for page to load
      await waitFor(() => {
        expect(container.querySelector('h1')).to.exist;
      });

      // Open the cancel modal
      const cancelButton = Array.from(
        container.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Cancel adding this expense');
      expect(cancelButton).to.exist;
      fireEvent.click(cancelButton);

      // Wait for modal to be visible
      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal.getAttribute('visible')).to.equal('true');
      });

      // Confirm cancellation by triggering the modal's primary button click event
      const modal = container.querySelector('va-modal');
      modal.__events.primaryButtonClick();

      // Verify navigation to review page
      await waitFor(() => {
        const location = getByTestId('location-display');
        expect(location.textContent).to.equal(
          '/file-new-claim/12345/43555/review',
        );
      });
    });

    it('navigates to choose-expense page when confirming cancel in add mode without backDestination', async () => {
      const baseState = getEditState([]);
      const stateWithoutBackDestination = {
        ...baseState,
        travelPay: {
          ...baseState.travelPay,
          complexClaim: {
            ...baseState.travelPay.complexClaim,
            expenseBackDestination: undefined,
          },
        },
      };

      const { container, getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/43555/meal']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
              element={<ExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<div data-testid="choose-expense-page" />}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        { initialState: stateWithoutBackDestination, reducers: reducer },
      );

      // Wait for page to load
      await waitFor(() => {
        expect(container.querySelector('h1')).to.exist;
      });

      // Open the cancel modal
      const cancelButton = Array.from(
        container.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Cancel adding this expense');
      expect(cancelButton).to.exist;
      fireEvent.click(cancelButton);

      // Wait for modal to be visible
      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal.getAttribute('visible')).to.equal('true');
      });

      // Confirm cancellation by triggering the modal's primary button click event
      const modal = container.querySelector('va-modal');
      modal.__events.primaryButtonClick();

      // Verify navigation to choose-expense page
      await waitFor(() => {
        const location = getByTestId('location-display');
        expect(location.textContent).to.equal(
          '/file-new-claim/12345/43555/choose-expense',
        );
      });
    });

    it('navigates to review page when confirming cancel in edit mode', async () => {
      const { container, getByTestId } = renderEditPage();

      // Wait for data to load
      await waitFor(() => {
        const vendorField = container.querySelector(
          'va-text-input[name="vendorName"]',
        );
        expect(vendorField?.getAttribute('value')).to.equal('Saved Vendor');
      });

      // Click Cancel button to open modal
      const cancelButton = Array.from(
        container.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Cancel');
      expect(cancelButton).to.exist;
      fireEvent.click(cancelButton);

      // Wait for modal to be visible
      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal.getAttribute('visible')).to.equal('true');
      });

      // Confirm cancellation by triggering the modal's primary button click event
      const modal = container.querySelector('va-modal');
      modal.__events.primaryButtonClick();

      // Verify navigation to review page
      await waitFor(() => {
        const location = getByTestId('location-display');
        expect(location.textContent).to.equal(
          '/file-new-claim/12345/43555/review',
        );
      });
    });
  });
});

describe('toBase64 helper function', () => {
  let originalFileReader;

  beforeEach(() => {
    originalFileReader = global.FileReader;
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
  });

  it('should strip data URL prefix and return only base64 data', async () => {
    const mockBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA';
    const mockDataUrl = `data:image/png;base64,${mockBase64}`;

    global.FileReader = function MockFileReader() {
      this.readAsDataURL = function readAsDataURL() {
        this.result = mockDataUrl;
        setTimeout(() => this.onload(), 0);
      };
    };

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await toBase64(file);
    expect(result).to.equal(mockBase64);
  });

  it('should return empty string if result is malformed', async () => {
    global.FileReader = function MockFileReader() {
      this.readAsDataURL = function readAsDataURL() {
        this.result = 'malformed-no-comma';
        setTimeout(() => this.onload(), 0);
      };
    };

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await toBase64(file);
    expect(result).to.equal('');
  });

  it('should return empty string if result is null', async () => {
    global.FileReader = function MockFileReader() {
      this.readAsDataURL = function readAsDataURL() {
        this.result = null;
        setTimeout(() => this.onload(), 0);
      };
    };

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = await toBase64(file);
    expect(result).to.equal('');
  });

  it('should handle FileReader errors', async () => {
    global.FileReader = function MockFileReader() {
      this.readAsDataURL = function readAsDataURL() {
        setTimeout(() => this.onerror(new Error('Read failed')), 0);
      };
    };

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    try {
      await toBase64(file);
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).to.equal('Read failed');
    }
  });
});

describe('ExpensePage - Scroll to Error on Validation Failure', () => {
  let scrollToFirstErrorSpy;
  let restoreFileReader;
  let apiRequestStub;

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
      complexClaim: {
        claim: {
          creation: { isLoading: false, error: null },
          submission: {
            id: '',
            isSubmitting: false,
            error: null,
            data: null,
          },
          fetch: { isLoading: false, error: null },
          data: null,
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [],
        },
        documentDelete: {
          id: '',
          isLoading: false,
          error: null,
        },
      },
    },
  });

  beforeEach(() => {
    scrollToFirstErrorSpy = sinon.spy(scrollUtils, 'scrollToFirstError');
    restoreFileReader = mockFileReader();
    // Mock API request for successful form submission
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves({
      data: { id: '123', status: 'success' },
    });
  });

  afterEach(() => {
    if (scrollToFirstErrorSpy) {
      scrollToFirstErrorSpy.restore();
    }
    restoreFileReader();
    apiRequestStub.restore();
  });

  it('should call scrollToFirstError after validation fails on continue click', async () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={['/file-new-claim/12345/43555/meal-expense']}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /meal expense/i })).to.exist;
    });

    // Click continue without filling required fields
    const root = screen.baseElement;
    const buttonGroup = root.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Continue');

    await act(async () => {
      fireEvent.click(continueButton);
      // Give time for all state updates and effects to complete
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    // Verify errors appeared in the DOM
    const purchaseDateInput = root.querySelector(
      'va-date[name="purchaseDate"]',
    );
    expect(purchaseDateInput.getAttribute('error')).to.exist;

    // Verify scroll was called after the useEffect ran
    expect(scrollToFirstErrorSpy.called).to.be.true;
    expect(scrollToFirstErrorSpy.calledWith({ focusOnAlertRole: true })).to.be
      .true;
  });

  it('should only call scrollToFirstError once per validation failure', async () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={['/file-new-claim/12345/43555/meal-expense']}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /meal expense/i })).to.exist;
    });

    // Click continue without filling required fields - first time
    const root = screen.baseElement;
    const buttonGroup = root.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Continue');
    fireEvent.click(continueButton);

    await waitFor(
      () => {
        expect(scrollToFirstErrorSpy.callCount).to.equal(1);
      },
      { timeout: 2000 },
    );

    // Now add a field to trigger state change but keep form invalid
    const vendorName = root.querySelector('va-text-input[name="vendorName"]');
    if (vendorName) {
      vendorName.value = 'Test Restaurant';
      const inputEvent = new Event('input', { bubbles: true });
      Object.defineProperty(inputEvent, 'target', {
        writable: false,
        value: { value: 'Test Restaurant', name: 'vendorName' },
      });
      vendorName.dispatchEvent(inputEvent);
    }

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // scrollToFirstError should still only be called once (from the continue click)
    expect(scrollToFirstErrorSpy.callCount).to.equal(1);
  });
});

describe('ExpensePage - File Upload Validation Error Messages', () => {
  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
      complexClaim: {
        claim: {
          creation: { isLoading: false, error: null },
          submission: {
            id: '',
            isSubmitting: false,
            error: null,
            data: null,
          },
          fetch: { isLoading: false, error: null },
          data: null,
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [],
        },
        documentDelete: {
          id: '',
          isLoading: false,
          error: null,
        },
      },
    },
  });

  const renderPage = () =>
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={['/file-new-claim/12345/43555/meal-expense']}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

  let restoreFileReader;

  beforeEach(() => {
    restoreFileReader = mockFileReader();
  });

  afterEach(() => {
    restoreFileReader();
  });

  it('shows specific error when file is too large (over 5MB)', async () => {
    const { container } = renderPage();

    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });

    const fileInput = container.querySelector('va-file-input');

    // Simulate vaFileInputError event for file too large
    await act(async () => {
      fileInput.dispatchEvent(
        new CustomEvent('vaFileInputError', {
          detail: {
            error:
              "We can't upload your file because it's too big. Files must be less than 5.0 MB.",
          },
          bubbles: true,
          composed: true,
        }),
      );
    });

    await waitFor(() => {
      const errorAttr = fileInput.getAttribute('error');
      expect(errorAttr).to.equal(
        "We can't upload your file because it's too big. Files must be less than 5.0 MB.",
      );
    });
  });

  it('shows specific error when file type is not supported', async () => {
    const { container } = renderPage();

    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });

    const fileInput = container.querySelector('va-file-input');

    // Simulate vaFileInputError event for unsupported file type
    await act(async () => {
      fileInput.dispatchEvent(
        new CustomEvent('vaFileInputError', {
          detail: {
            error: 'We do not accept .mov files. Choose a new file.',
          },
          bubbles: true,
          composed: true,
        }),
      );
    });

    await waitFor(() => {
      const errorAttr = fileInput.getAttribute('error');
      expect(errorAttr).to.equal(
        'We do not accept .mov files. Choose a new file.',
      );
    });
  });

  it('accepts a valid file without errors', async () => {
    const { container } = renderPage();

    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });

    const fileInput = container.querySelector('va-file-input');

    // Create a valid file (PDF, under 5MB)
    const validFile = new File(['dummy content'], 'receipt.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      fileInput.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { files: [validFile] },
          bubbles: true,
          composed: true,
        }),
      );
    });

    // Wait to ensure any error would have appeared
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should NOT have an error attribute
    const errorAttr = fileInput.getAttribute('error');
    expect(errorAttr).to.be.null;
  });

  it('shows required error when no file is uploaded and continue is clicked', async () => {
    const { container } = renderPage();

    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });

    const buttonGroup = container.querySelector('.travel-pay-button-group');
    const continueButton = Array.from(
      buttonGroup.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Continue');

    fireEvent.click(continueButton);

    await waitFor(() => {
      const fileInput = container.querySelector('va-file-input');
      expect(fileInput.getAttribute('error')).to.equal(
        'Select an approved file type under 5MB',
      );
    });
  });

  it('shows file size error even if file type would also be invalid', async () => {
    const { container } = renderPage();

    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });

    const fileInput = container.querySelector('va-file-input');

    // File is both too large AND wrong type
    await act(async () => {
      fileInput.dispatchEvent(
        new CustomEvent('vaFileInputError', {
          detail: {
            error:
              "We can't upload your file because it's too big. Files must be less than 5.0 MB.",
          },
          bubbles: true,
          composed: true,
        }),
      );
    });

    await waitFor(() => {
      const errorAttr = fileInput.getAttribute('error');
      // Should show file size error
      expect(errorAttr).to.equal(
        "We can't upload your file because it's too big. Files must be less than 5.0 MB.",
      );
    });
  });
});
