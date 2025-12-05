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
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import sinon from 'sinon';

import ExpensePage from '../../../../components/complex-claims/pages/ExpensePage';
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
    const root = containerWrapper?.baseElement || containerWrapper; // safe fallback

    if (!root) return; // just in case

    // ---- COMMON FIELDS ----
    const purchaseDate = root.querySelector('va-date[name="purchaseDate"]');
    const costRequested = root.querySelector(
      'va-text-input[name="costRequested"]',
    );

    if (purchaseDate) {
      purchaseDate.dispatchEvent(
        new CustomEvent('dateChange', {
          detail: { value: '2025-10-31' },
          bubbles: true,
          composed: true,
        }),
      );
    }

    if (costRequested) {
      costRequested.dispatchEvent(
        new CustomEvent('input', {
          detail: { value: '50.00' },
          bubbles: true,
          composed: true,
        }),
      );
    }

    const upload = root.querySelector('document-upload');
    if (upload) {
      upload.dispatchEvent(
        new CustomEvent('fileChange', {
          detail: {
            files: [
              new File(['dummy'], 'receipt.pdf', { type: 'application/pdf' }),
            ],
          },
          bubbles: true,
          composed: true,
        }),
      );
    }

    // ---- EXPENSE-SPECIFIC FIELDS ----
    switch (expenseKey) {
      case 'Meal': {
        const vendor = root.querySelector('va-text-input[name="vendorName"]');
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
          `va-radio[name="carrierType"] va-radio-option[value="${
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
          `va-radio[name="reasonNotUsingPOV"] va-radio-option[value="${
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
            TRIP_TYPES.ROUND_TRIP.label
          }"]`,
        );
        tripType?.dispatchEvent(
          new CustomEvent('vaValueChange', {
            detail: { value: TRIP_TYPES.ROUND_TRIP.label },
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

        const departedFrom = root.querySelector(
          'va-text-input[name="departedFrom"]',
        );
        departedFrom?.dispatchEvent(
          new CustomEvent('input', {
            detail: { value: 'SFO' },
            bubbles: true,
            composed: true,
          }),
        );

        const returnDate = root.querySelector('va-date[name="returnDate"]');
        returnDate?.dispatchEvent(
          new CustomEvent('dateChange', {
            detail: { value: '2025-11-01' },
            bubbles: true,
            composed: true,
          }),
        );

        const arrivedTo = root.querySelector('va-text-input[name="arrivedTo"]');
        arrivedTo?.dispatchEvent(
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

        it('renders correct description', () => {
          const { getByText } = renderPage(config);

          if (key === 'Airtravel') {
            expect(
              getByText(
                `Upload a receipt or proof of the expense here. If youre adding a round-trip flight, you only need to add 1 expense. If you have receipts for 2 one-way flights, you’ll need to add 2 separate expenses.`,
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
          const { getByText, container } = renderPage(config);
          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          const continueButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');

          fireEvent.click(continueButton);

          expect(getByText(/please fill out all required fields/i)).to.exist;
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

        it('focuses the error message on validation failure', async () => {
          const { container, getByTestId, getByText } = renderPage(config);
          const buttonGroup = container.querySelector(
            '.travel-pay-button-group',
          );
          const continueButton = Array.from(
            buttonGroup.querySelectorAll('va-button'),
          ).find(btn => btn.getAttribute('text') === 'Continue');

          fireEvent.click(continueButton);

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
      describe('DocumentUpload behavior', () => {
        const expenseTypesWithDocumentUpload = [
          'Meal',
          'Lodging',
          'Airtravel',
          'Commoncarrier',
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

// ---------------------------------------------------------------
// EDIT MODE TESTS
// ---------------------------------------------------------------
describe('Travel Pay – ExpensePage (Editing existing expense)', () => {
  const TEST_EXPENSE_ID = 'abc123';
  const TEST_DOCUMENT_ID = 'doc789';

  //
  // Store containing an existing expense
  //
  const getEditState = () => ({
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
                fileData: 'data:application/pdf;base64,AA==',
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
          data: [
            {
              id: TEST_EXPENSE_ID,
              expenseType: 'Meal',
              vendorName: 'Saved Vendor',
              dateIncurred: '2025-11-17',
              costRequested: '10.50',
              documentId: TEST_DOCUMENT_ID,
            },
          ],
        },
      },
    },
  });

  const renderEditPage = () =>
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
      { initialState: getEditState(), reducers: reducer },
    );

  let apiStub;
  beforeEach(() => {
    apiStub = sinon.stub(api, 'apiRequest').resolves({
      headers: {
        get: key => (key === 'Content-Type' ? 'application/pdf' : '1024'),
      },
      arrayBuffer: async () => new TextEncoder().encode('dummy').buffer,
    });
  });
  afterEach(() => {
    apiStub.restore();
  });

  it('pre-fills formState with the stored expense', () => {
    const { container } = renderEditPage();

    const vendorField = container.querySelector(
      'va-text-input[name="vendorName"]',
    );
    expect(vendorField.getAttribute('value')).to.equal('Saved Vendor');
    const costField = container.querySelector(
      'va-text-input[name="costRequested"]',
    );
    expect(costField.getAttribute('value')).to.equal('10.50');
  });

  it('uses "Save and continue" text for continue button', () => {
    const { container } = renderEditPage();

    const button = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('text') === 'Save and continue',
    );

    expect(button).to.exist;
  });

  it('uses "Cancel" text for back button', () => {
    const { container } = renderEditPage();

    const button = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('text') === 'Cancel',
    );

    expect(button).to.exist;
  });

  it('does NOT render "Cancel adding this expense" button when in add mode', () => {
    const { container } = renderEditPage();
    const addCancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Cancel adding this expense');
    expect(addCancelButton).to.not.exist;
  });

  it('"Back" button opens modal in edit mode', () => {
    const { container } = renderEditPage();
    const backButton = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('text') === 'Cancel',
    );
    fireEvent.click(backButton);
    const modal = container.querySelector('va-modal');
    expect(modal.getAttribute('visible')).to.equal('true');
  });

  it('loads existing document when documentId is present', async () => {
    const { container } = renderEditPage();

    // Component renders space for existing file
    const uploadLoading = container.querySelector('va-loading-indicator');
    expect(uploadLoading).to.exist;

    await waitFor(() => {
      expect(container.querySelector('va-file-input')).to.exist;
    });
  });

  it('shows description error for min and max length', async () => {
    const { container } = renderEditPage();

    const inputText = container.querySelector(
      'va-textarea[name="description"]',
    );

    // Less than min length
    inputText.value = 'abc';
    inputText.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
      }),
    );

    // Trigger validation
    fireEvent.blur(inputText);

    await waitFor(() => {
      const errorAttr = inputText.getAttribute('error');
      expect(errorAttr).to.exist;
      expect(errorAttr).to.include('Enter at least 5 characters');
    });

    inputText.value = 'a'.repeat(2001);
    inputText.dispatchEvent(
      new CustomEvent('input', {
        bubbles: true,
        composed: true,
      }),
    );

    // Trigger validation
    fireEvent.blur(inputText);

    await waitFor(() => {
      const errorAttr = inputText.getAttribute('error');
      expect(errorAttr).to.exist;
      expect(errorAttr).to.include('Enter no more than 2,000 characters');
    });
  });
});
