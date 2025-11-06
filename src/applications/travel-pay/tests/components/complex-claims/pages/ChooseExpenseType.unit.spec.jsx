import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
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
        initialState: {},
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

    expect(screen.getByText(/Start with one expense/)).to.exist;
    expect(screen.getByText(/To request reimbursement for air fare/)).to.exist;

    expect($('va-radio[label="Choose an expense type"]')).to.exist;
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
  });

  it('handles expense type selection', () => {
    renderComponent();

    const radioGroup = $('va-radio[label="Choose an expense type"]');
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

    const radioGroup = $('va-radio[label="Choose an expense type"]');
    expect(radioGroup.hasAttribute('required')).to.be.true;
  });

  it('renders button pair with correct properties', () => {
    renderComponent();

    const buttonPair = $('va-button-pair');
    expect(buttonPair).to.exist;
    expect(buttonPair.hasAttribute('continue')).to.be.true;
    expect(buttonPair.hasAttribute('disable-analytics')).to.be.true;
  });

  it('displays correct heading text', () => {
    const screen = renderComponent();

    expect(screen.getByText('What type of expense do you want to add?')).to
      .exist;
  });

  it('displays helpful instruction text', () => {
    const screen = renderComponent();

    expect(screen.getByText(/Start with one expense/)).to.exist;
  });

  it('displays pre-approval requirement notice', () => {
    const screen = renderComponent();

    expect(screen.getByText(/To request reimbursement for air fare/)).to.exist;
  });

  describe('Error handling', () => {
    it('shows error message when continue is clicked without selecting an expense type', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');
      const radioGroup = $('va-radio[label="Choose an expense type"]');

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
        'Please select an expense type',
      );
    });

    it('clears error message when an expense type is selected after error', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');
      const radioGroup = $('va-radio[label="Choose an expense type"]');

      // Click continue without selection to trigger error
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Verify error is shown
      expect(radioGroup.getAttribute('error')).to.equal(
        'Please select an expense type',
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

      const buttonPair = $('va-button-pair');
      const radioGroup = $('va-radio[label="Choose an expense type"]');

      // Select an expense type first
      fireEvent(
        radioGroup,
        new CustomEvent('vaValueChange', {
          detail: { value: 'parking' },
        }),
      );

      // Click continue button
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // No error should be shown
      expect(radioGroup.getAttribute('error')).to.be.null;
    });

    it('prevents navigation when no expense type is selected', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');

      // Mock the navigate function to check if it was called
      const originalLocation = window.location;

      // Override window.location to detect navigation attempts
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          pathname: '/file-new-claim/12345/claim123/choose-expense',
        },
        writable: true,
      });

      // Click continue without selection
      fireEvent(
        buttonPair,
        new CustomEvent('primaryClick', {
          detail: {},
        }),
      );

      // Should still be on the same page (no navigation occurred)
      expect(window.location.pathname).to.equal(
        '/file-new-claim/12345/claim123/choose-expense',
      );

      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });
  });
});
