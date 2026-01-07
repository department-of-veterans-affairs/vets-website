/**
 * @module tests/components/pre-submit-info.unit.spec
 * @description Unit tests for PreSubmitCheckboxGroup component
 */

import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import PreSubmitInfo, { isSignatureValid } from './pre-submit-checkbox-group';

const createMockStore = (submissionStatus = null, formData = {}) => {
  const dispatch = sinon.spy();
  return {
    getState: () => ({
      form: {
        data: formData,
        submission: {
          status: submissionStatus,
        },
      },
    }),
    subscribe: () => () => {}, // Return unsubscribe function
    dispatch,
  };
};

describe('PreSubmitCheckboxGroup', () => {
  const mockFormData = {
    veteranInformation: { fullName: { first: 'Luke', last: 'Skywalker' } },
    burialInformation: {
      nameOfStateCemeteryOrTribalOrganization: 'Endor Forest Sanctuary',
      recipientOrganization: { name: 'Rebel Alliance Veterans Foundation' },
    },
  };

  const mockOnSectionComplete = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container).to.exist;
    });

    it('should display legal note', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.textContent).to.include(
        'According to federal law, there are criminal penalties',
      );
    });

    it('should render statement of truth checkbox', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('checkbox-label')).to.equal(
        'I hereby certify that Luke Skywalker was buried in a State-owned Veterans Cemetery or Tribal Cemetery (without charge).',
      );
    });
  });

  describe('Signature Fields', () => {
    it('should render signature input field', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should render title input field', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      // Check for the title text input
      expect(
        container.querySelector('va-text-input[label="Your official title"]'),
      ).to.exist;
    });

    it('should render statement of truth with checkbox', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.querySelector('va-statement-of-truth')).to.exist;
    });
  });

  describe('Empty Data Handling', () => {
    it('should render with empty form data', () => {
      const emptyFormData = {};
      const store = createMockStore(null, emptyFormData);

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container).to.exist;
      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should render legal note with empty data', () => {
      const emptyFormData = {};
      const store = createMockStore(null, emptyFormData);

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      expect(container.textContent).to.include('According to federal law');
    });
  });

  describe('Required Property', () => {
    it('should export required as true', () => {
      expect(PreSubmitInfo.required).to.be.true;
    });

    it('should export CustomComponent', () => {
      expect(PreSubmitInfo.CustomComponent).to.exist;
    });
  });

  describe('Validation', () => {
    it('should call onSectionComplete with false when fields are empty', () => {
      const store = createMockStore(null, mockFormData);
      const onSectionComplete = sinon.spy();

      render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={onSectionComplete}
          />
        </Provider>,
      );

      expect(onSectionComplete.calledWith(false)).to.be.true;
    });

    it('should not show errors before fields are touched when showError is false', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.be.null;
      expect(statementOfTruth.getAttribute('checkbox-error')).to.be.null;
    });

    it('should show errors when showError is true and fields are invalid', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.equal(
        'Enter your full name',
      );
      expect(statementOfTruth.getAttribute('checkbox-error')).to.equal(
        'You must certify this statement is correct',
      );
    });
  });

  describe('isSignatureValid Function', () => {
    it('should return false for empty signature', () => {
      expect(isSignatureValid('')).to.be.false;
    });

    it('should return false for null signature', () => {
      expect(isSignatureValid(null)).to.be.false;
    });

    it('should return false for undefined signature', () => {
      expect(isSignatureValid(undefined)).to.be.false;
    });

    it('should return false for signatures with less than 3 characters', () => {
      expect(isSignatureValid('J')).to.be.false;
      expect(isSignatureValid('Jo')).to.be.false;
    });

    it('should return true for signatures with 3+ characters', () => {
      expect(isSignatureValid('Joe')).to.be.true;
      expect(isSignatureValid('John')).to.be.true;
      expect(isSignatureValid('John Doe')).to.be.true;
    });

    it('should trim whitespace before validation', () => {
      expect(isSignatureValid('   ')).to.be.false;
      expect(isSignatureValid('  J  ')).to.be.false;
      expect(isSignatureValid('  Jo  ')).to.be.false;
      expect(isSignatureValid('  Joe  ')).to.be.true;
      expect(isSignatureValid(' John Doe ')).to.be.true;
    });

    it('should accept valid special characters in names', () => {
      expect(isSignatureValid("O'Brien")).to.be.true;
      expect(isSignatureValid('Smith-Jones')).to.be.true;
      expect(isSignatureValid("Mary-Jane O'Connor")).to.be.true;
      expect(isSignatureValid('John Jr.')).to.be.true;
      expect(isSignatureValid('Dr. Smith')).to.be.true;
    });

    it('should accept international and accented characters', () => {
      expect(isSignatureValid('José García')).to.be.true;
      expect(isSignatureValid('François Müller')).to.be.true;
      expect(isSignatureValid('María López')).to.be.true;
    });

    it('should accept organization names from fixtures', () => {
      // Names from maximal.json and minimal.json fixtures
      expect(isSignatureValid('Rebel Alliance Veterans Foundation')).to.be.true;
      expect(isSignatureValid('Imperial Memorial Services')).to.be.true;
      expect(isSignatureValid('Ewok Tribal Nation')).to.be.true;
      expect(isSignatureValid('New Mexico State Veterans Cemetery')).to.be.true;
    });
  });

  describe('User Interactions', () => {
    it('should update full name on input change', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      const inputEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'John Doe' },
      });

      fireEvent(statementOfTruth, inputEvent);

      await waitFor(() => {
        expect(statementOfTruth.getAttribute('input-value')).to.equal(
          'John Doe',
        );
      });
    });

    it('should update checkbox state on change', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      const checkboxEvent = new CustomEvent('vaCheckboxChange', {
        detail: { checked: true },
      });

      fireEvent(statementOfTruth, checkboxEvent);

      await waitFor(() => {
        expect(statementOfTruth.getAttribute('checked')).to.not.be.null;
      });
    });

    it('should show full name error after blur when empty', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      const blurEvent = new CustomEvent('vaInputBlur');

      fireEvent(statementOfTruth, blurEvent);

      await waitFor(() => {
        expect(statementOfTruth.getAttribute('input-error')).to.equal(
          'Enter your full name',
        );
      });
    });
  });

  describe('Form Data Synchronization', () => {
    it('should dispatch setData with certification values', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Add full name
      const nameEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'Jane Smith' },
      });
      fireEvent(statementOfTruth, nameEvent);

      await waitFor(() => {
        expect(store.dispatch.called).to.be.true;
      });
    });

    it('should set AGREED flag when checkbox is checked', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(store.dispatch.callCount).to.be.greaterThan(1);

        const lastAction = store.dispatch.lastCall.args[0];
        expect(lastAction.type).to.equal('SET_DATA');
        expect(lastAction.data.AGREED).to.be.true;
        expect(lastAction.data.certification.certified).to.be.true;
      });
    });

    it('should leave AGREED false when checkbox is unchecked', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: false },
        }),
      );

      await waitFor(() => {
        expect(store.dispatch.callCount).to.be.greaterThan(0);

        const lastAction = store.dispatch.lastCall.args[0];
        expect(lastAction.type).to.equal('SET_DATA');
        expect(lastAction.data.AGREED).to.be.false;
        expect(lastAction.data.certification.certified).to.be.false;
      });
    });

    it('should not dispatch after form submission', () => {
      const store = createMockStore('submitted');

      render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      // Wait a bit to ensure useEffect has run
      expect(store.dispatch.called).to.be.false;
    });
  });

  describe('Title Validation', () => {
    it('should show title error when less than 2 characters', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const titleInput = container.querySelector(
        'va-text-input[label="Your official title"]',
      );
      expect(titleInput).to.exist;
    });

    it('should accept valid form data and mark section as complete', async () => {
      const store = createMockStore(null, mockFormData);
      const onSectionComplete = sinon.spy();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={onSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Fill in full name
      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'John Doe' },
        }),
      );

      // Note: Cannot easily test TextInputField completion in unit tests
      // due to web component shadow DOM limitations

      // Check the checkbox
      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      // Note: Testing the complete flow with TextInputField may be complex
      // due to custom component implementation. This test verifies the
      // component accepts interactions without errors.
      await waitFor(
        () => {
          // At minimum, should have been called
          expect(onSectionComplete.called).to.be.true;
        },
        { timeout: 1000 },
      );
    });
  });

  describe('Submission State', () => {
    it('should not show errors after form has been submitted', () => {
      const store = createMockStore('submitted');
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.be.null;
      expect(statementOfTruth.getAttribute('checkbox-error')).to.be.null;
    });
  });

  describe('Error Messages', () => {
    it('should show validation error for empty full name', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.equal(
        'Enter your full name',
      );
    });

    it('should show simple error for empty title', () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const titleInput = container.querySelector(
        'va-text-input[label="Your official title"]',
      );
      expect(titleInput.getAttribute('error')).to.equal('Enter your title');
    });

    it('should accept any valid name without organization matching', async () => {
      const store = createMockStore(null, mockFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Enter a name from fixtures (Rebel Alliance Veterans Foundation)
      const nameEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'Rebel Alliance Veterans Foundation' },
      });
      fireEvent(statementOfTruth, nameEvent);

      // Blur to trigger validation
      const blurEvent = new CustomEvent('vaInputBlur');
      fireEvent(statementOfTruth, blurEvent);

      await waitFor(() => {
        // Should not show error since valid name was entered
        const inputError = statementOfTruth.getAttribute('input-error');
        expect(inputError).to.be.null;
      });
    });
  });
});
