import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { EXPENSE_TYPES } from '../../../../constants';
import ChooseExpenseType from '../../../../components/complex-claims/pages/ChooseExpenseType';
import ExpensePage from '../../../../components/complex-claims/pages/ExpensePage';
import reducer from '../../../../redux/reducer';

describe('ChooseExpenseType', () => {
  const defaultApptId = '12345';
  const expenseOptions = Object.values(EXPENSE_TYPES);

  const renderComponent = (apptId = defaultApptId, claimId = 'claim123') => {
    return renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/choose-expense`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
            element={<ExpensePage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState: {
          travelPay: {
            complexClaim: {
              claim: {
                data: {
                  claimId,
                  expenses: [],
                },
              },
            },
          },
        },
        reducers: reducer,
      },
    );
  };

  it('renders the component with all required elements', () => {
    const screen = renderComponent();

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'What type of expense do you want to add?',
    );

    expect(screen.getByText(/Select 1 expense/)).to.exist;
    expect(
      screen.getByText(
        /We’ll need to pre-approve any lodging or meals before you request reimbursement/,
      ),
    ).to.exist;

    expect($('va-radio[label="Select an expense type"]')).to.exist;
    expect($('va-button-pair')).to.exist;
  });

  it('renders all expense type options', () => {
    renderComponent();
    expenseOptions.forEach(option => {
      expect($(`va-radio-option[label="${option.title}"]`)).to.exist;
    });
  });

  it('renders expense options with correct values', () => {
    renderComponent();
    expenseOptions.forEach(option => {
      expect(
        $(`va-radio-option[value="${option.route}"][label="${option.title}"]`),
      ).to.exist;
    });
  });

  it('renders radio options with tile property', () => {
    renderComponent();

    const radioOptions = document.querySelectorAll('va-radio-option');
    expect(radioOptions.length).to.be.greaterThan(0);

    // Check that all radio options have the tile attribute
    radioOptions.forEach(option => {
      expect(option.hasAttribute('tile')).to.be.true;
    });

    // Find the mileage option specifically
    const mileageOption = Array.from(radioOptions).find(
      option =>
        option.getAttribute('value')?.toLowerCase() ===
        EXPENSE_TYPES.Mileage.name,
    );

    expect(mileageOption).to.exist;

    // Mileage option should have a description
    expect(mileageOption.hasAttribute('description')).to.be.true;

    // All other options should NOT have description
    radioOptions.forEach(option => {
      if (option.getAttribute('value') !== EXPENSE_TYPES.Mileage.name) {
        expect(option.getAttribute('description')).to.eq('');
      }
    });
  });

  it('handles expense type selection', () => {
    renderComponent();

    const radioGroup = $('va-radio[label="Select an expense type"]');
    expect(radioGroup).to.exist;

    fireEvent(
      radioGroup,
      new CustomEvent('vaValueChange', {
        detail: { value: 'mileage' },
      }),
    );

    // Check that the selection is reflected in the component
    const mileageOption = $('va-radio-option[value="mileage"]');
    expect(mileageOption.hasAttribute('checked')).to.be.true;
  });

  it('requires an expense type selection', () => {
    renderComponent();

    const radioGroup = $('va-radio[label="Select an expense type"]');
    expect(radioGroup.hasAttribute('required')).to.be.true;
  });

  it('renders button pair with correct properties', () => {
    renderComponent();

    const buttonPair = $('va-button-pair');
    expect(buttonPair).to.exist;
    expect(buttonPair.hasAttribute('continue')).to.be.true;
  });

  it('displays correct heading text', () => {
    const screen = renderComponent();

    expect(screen.getByText('What type of expense do you want to add?')).to
      .exist;
  });

  it('displays helpful instruction text', () => {
    const screen = renderComponent();

    expect(screen.getByText(/Select 1 expense/)).to.exist;
  });

  it('displays pre-approval requirement notice', () => {
    const screen = renderComponent();

    expect(
      screen.getByText(
        /We’ll need to pre-approve any lodging or meals before you request reimbursement/,
      ),
    ).to.exist;
  });

  describe('Error handling', () => {
    it('shows error message when continue is clicked without selecting an expense type', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');
      const radioGroup = $('va-radio[label="Select an expense type"]');

      // Initially no error should be shown
      expect(radioGroup.getAttribute('error')).to.be.null;

      // Click continue button without selecting an expense type
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Error message should now be displayed
      expect(radioGroup.getAttribute('error')).to.equal(
        'Select an expense type',
      );
    });

    it('clears error message when an expense type is selected after error', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');
      const radioGroup = $('va-radio[label="Select an expense type"]');

      // Click continue without selection to trigger error
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Verify error is shown
      expect(radioGroup.getAttribute('error')).to.equal(
        'Select an expense type',
      );

      // Select an expense type
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'mileage' },
        }),
      );

      // Error should be cleared
      expect(radioGroup.getAttribute('error')).to.be.null;
    });

    it('does not show error when continue is clicked with a valid selection', () => {
      renderComponent();

      const radioGroup = $('va-radio[label="Select an expense type"]');

      // Select an expense type first
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'parking' },
        }),
      );

      // No error should be shown when a valid selection is made
      expect(radioGroup.getAttribute('error')).to.be.null;
    });

    it('prevents navigation when no expense type is selected', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');

      // Click continue without selection
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Error should be shown, preventing navigation
      const radioGroup = $('va-radio[label="Select an expense type"]');
      expect(radioGroup.getAttribute('error')).to.equal(
        'Select an expense type',
      );
    });
  });

  describe('Mileage expense validation', () => {
    const renderComponentWithExistingMileage = (
      apptId = defaultApptId,
      claimId = 'claim123',
    ) => {
      return renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[
            `/file-new-claim/${apptId}/${claimId}/choose-expense`,
          ]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpenseType />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/:expenseTypeRoute"
              element={<ExpensePage />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState: {
            travelPay: {
              complexClaim: {
                claim: {
                  data: {
                    claimId,
                    expenses: [
                      {
                        id: 'expense-1',
                        expenseType: 'Mileage',
                        costRequested: 50.0,
                      },
                    ],
                  },
                },
              },
            },
          },
          reducers: reducer,
        },
      );
    };

    it('shows error when trying to add a second mileage expense', () => {
      renderComponentWithExistingMileage();

      const radioGroup = $('va-radio[label="Select an expense type"]');
      const buttonPair = $('va-button-pair');

      // Select mileage expense type
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'mileage' },
        }),
      );

      // Click continue button
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Error message should be displayed
      expect(radioGroup.getAttribute('error')).to.equal(
        'You can only add 1 mileage expense for each claim. Select another expense type or submit your claim.',
      );
    });

    it('prevents navigation when trying to add a second mileage expense', () => {
      const screen = renderComponentWithExistingMileage();

      const radioGroup = $('va-radio[label="Select an expense type"]');
      const buttonPair = $('va-button-pair');

      // Select mileage expense type
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'mileage' },
        }),
      );

      // Click continue button
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Should still be on the same page with error shown
      expect(screen.getByText('What type of expense do you want to add?')).to
        .exist;
      expect(radioGroup.getAttribute('error')).to.exist;
    });

    it('does not show error when selecting non-mileage expense type with existing mileage', () => {
      renderComponentWithExistingMileage();

      const radioGroup = $('va-radio[label="Select an expense type"]');

      // Select a different expense type (parking)
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'parking' },
        }),
      );

      // Verify parking is selected
      const parkingOption = $('va-radio-option[value="parking"]');
      expect(parkingOption.hasAttribute('checked')).to.be.true;

      // No error should be shown for non-mileage expense types
      expect(radioGroup.getAttribute('error')).to.be.null;
    });

    it('clears mileage error when switching to a different expense type', () => {
      renderComponentWithExistingMileage();

      const radioGroup = $('va-radio[label="Select an expense type"]');
      const buttonPair = $('va-button-pair');

      // Select mileage to trigger error
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'mileage' },
        }),
      );

      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Verify error is shown
      expect(radioGroup.getAttribute('error')).to.exist;

      // Switch to different expense type
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'toll' },
        }),
      );

      // Error should be cleared
      expect(radioGroup.getAttribute('error')).to.be.null;
    });

    it('allows adding mileage expense when no mileage exists yet', () => {
      renderComponent();

      const radioGroup = $('va-radio[label="Select an expense type"]');

      // Select mileage expense type
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'mileage' },
        }),
      );

      // No error should be shown when selecting mileage with no existing mileage
      expect(radioGroup.getAttribute('error')).to.be.null;
    });
  });

  describe('Navigation', () => {
    const initialState = {
      travelPay: {
        appointment: {
          data: {
            id: '12345',
            appointmentDateTime: '2024-01-01T10:00:00Z',
            facilityName: 'Test Facility',
          },
          isLoading: false,
          error: null,
        },
        complexClaim: {
          claim: { data: null },
        },
        claimDetails: {
          data: {},
          isLoading: false,
          error: null,
        },
      },
    };

    it('navigates back to intro page with skipRedirect state when backDestination is not set', async () => {
      const IntroWithStateCheck = () => {
        const location = useLocation();
        return (
          <div>
            <div data-testid="intro-page">Intro</div>
            <div data-testid="skip-redirect">
              {location.state?.skipRedirect ? 'true' : 'false'}
            </div>
          </div>
        );
      };

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim123/choose-expense']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpenseType />}
            />
            <Route
              path="/file-new-claim/:apptId"
              element={<IntroWithStateCheck />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState: { ...initialState },
          reducers: reducer,
        },
      );

      const buttonPair = $('va-button-pair');

      fireEvent(
        buttonPair,
        new CustomEvent('secondaryClick', {
          detail: {},
        }),
      );

      await waitFor(() => {
        expect(getByTestId('skip-redirect').textContent).to.equal('true');
      });
    });

    it('navigates back to intro page when backDestination is "intro"', async () => {
      const LocationDisplay = () => {
        const location = useLocation();
        return <div data-testid="location-display">{location.pathname}</div>;
      };

      const modifiedState = { ...initialState };
      modifiedState.travelPay.complexClaim.expenseBackDestination = 'intro';

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim123/choose-expense']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpenseType />}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        {
          initialState: { ...modifiedState },
          reducers: reducer,
        },
      );

      const buttonPair = $('va-button-pair');
      fireEvent(
        buttonPair,
        new CustomEvent('secondaryClick', {
          detail: {},
        }),
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/file-new-claim/12345',
        );
      });
    });

    it('navigates back to review page when backDestination is "review"', async () => {
      const LocationDisplay = () => {
        const location = useLocation();
        return <div data-testid="location-display">{location.pathname}</div>;
      };

      const modifiedState = { ...initialState };
      modifiedState.travelPay.complexClaim.expenseBackDestination = 'review';

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim123/choose-expense']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpenseType />}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        {
          initialState: { ...modifiedState },
          reducers: reducer,
        },
      );

      const buttonPair = $('va-button-pair');
      fireEvent(
        buttonPair,
        new CustomEvent('secondaryClick', {
          detail: {},
        }),
      );

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/file-new-claim/12345/claim123/review',
        );
      });
    });
  });
});
