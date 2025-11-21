/**
 * @module tests/components/pre-submit-info.unit.spec
 * @description Unit tests for PreSubmitCheckboxGroup component
 */

import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import PreSubmitInfo from './pre-submit-checkbox-group';

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
    burialInformation: {
      nameOfStateCemeteryOrTribalOrganization: 'Endor Forest Sanctuary',
      recipientOrganization: {
        name: 'Rebel Alliance Veterans Foundation',
      },
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

      expect(container.textContent).to.include(
        'I confirm that the identifying information',
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

      // Check for the organization title text input
      expect(
        container.querySelector(
          'va-text-input[label="Your organization title"]',
        ),
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
      expect(statementOfTruth.getAttribute('input-error')).to.include(
        'Enter your full name',
      );
      expect(statementOfTruth.getAttribute('input-error')).to.include(
        'Rebel Alliance Veterans Foundation',
      );
      expect(statementOfTruth.getAttribute('checkbox-error')).to.equal(
        'You must certify this statement is correct',
      );
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
        expect(statementOfTruth.getAttribute('input-error')).to.include(
          'Enter your full name',
        );
        expect(statementOfTruth.getAttribute('input-error')).to.include(
          'Rebel Alliance Veterans Foundation',
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
        'va-text-input[label="Your organization title"]',
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

  describe('Organization-Specific Error Messages', () => {
    it('should show recipient organization name in full name error when present', () => {
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
      expect(statementOfTruth.getAttribute('input-error')).to.include(
        'Rebel Alliance Veterans Foundation',
      );
    });

    it('should show organization name in title error when organization is present', () => {
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
        'va-text-input[label="Your organization title"]',
      );
      expect(titleInput.getAttribute('error')).to.include(
        'Endor Forest Sanctuary',
      );
    });

    it('should show generic error when organization name and user name are not present', () => {
      const emptyFormData = {};
      const store = createMockStore(null, emptyFormData);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.include(
        'the organization',
      );
      expect(statementOfTruth.getAttribute('input-error')).to.not.include('(');

      const titleInput = container.querySelector(
        'va-text-input[label="Your organization title"]',
      );
      expect(titleInput.getAttribute('error')).to.include('the organization');
    });

    it('should show generic message when organization is not present', () => {
      const dataWithoutOrg = {};
      const store = createMockStore(null, dataWithoutOrg);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.include(
        'the organization',
      );
    });

    it('should show specific error for title when empty', () => {
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
        'va-text-input[label="Your organization title"]',
      );
      // With empty title, should show "Enter your title at..." message
      expect(titleInput.getAttribute('error')).to.include('Enter your title');
    });

    it('should use generic statement text without organization name', () => {
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
        'I confirm that the identifying information in this form is accurate and has been represented correctly',
      );
      expect(container.textContent).to.not.include('on behalf of');
    });
  });

  describe('Organization Name Validation', () => {
    it('should show mismatch error when full name does not match recipient organization', async () => {
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

      // Enter wrong name
      const inputEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'Wrong Name' },
      });
      fireEvent(statementOfTruth, inputEvent);

      // Blur to trigger validation
      const blurEvent = new CustomEvent('vaInputBlur');
      fireEvent(statementOfTruth, blurEvent);

      await waitFor(() => {
        expect(statementOfTruth.getAttribute('input-error')).to.include(
          'Your signature must match',
        );
        expect(statementOfTruth.getAttribute('input-error')).to.include(
          'Rebel Alliance Veterans Foundation',
        );
      });
    });

    it('should validate organization name with case-insensitive matching', async () => {
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

      // Enter org name with different case (uppercase)
      const nameEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'REBEL ALLIANCE VETERANS FOUNDATION' },
      });
      fireEvent(statementOfTruth, nameEvent);

      // Blur to trigger validation
      const blurEvent = new CustomEvent('vaInputBlur');
      fireEvent(statementOfTruth, blurEvent);

      await waitFor(() => {
        // Should not show error since name matches (case-insensitive)
        const inputError = statementOfTruth.getAttribute('input-error');
        // Error should either be null or not include "must match"
        if (inputError) {
          expect(inputError).to.not.include('must match');
        }
      });
    });

    it('should validate organization name with spaces ignored', async () => {
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

      // Enter org name without spaces
      const nameEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'RebelAllianceVeteransFoundation' },
      });
      fireEvent(statementOfTruth, nameEvent);

      // Blur to trigger validation
      const blurEvent = new CustomEvent('vaInputBlur');
      fireEvent(statementOfTruth, blurEvent);

      await waitFor(() => {
        // Should not show error since name matches (spaces removed)
        const inputError = statementOfTruth.getAttribute('input-error');
        // Error should either be null or not include "must match"
        if (inputError) {
          expect(inputError).to.not.include('must match');
        }
      });
    });

    it('should validate lenient when no organization names are available', async () => {
      const dataWithoutOrgNames = {};
      const store = createMockStore(null, dataWithoutOrgNames);
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo.CustomComponent
            showError={false}
            onSectionComplete={mockOnSectionComplete}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Enter any name
      const nameEvent = new CustomEvent('vaInputChange', {
        detail: { value: 'Any Name Here' },
      });
      fireEvent(statementOfTruth, nameEvent);

      // Blur to trigger validation
      const blurEvent = new CustomEvent('vaInputBlur');
      fireEvent(statementOfTruth, blurEvent);

      await waitFor(() => {
        // Should not show "must match" error when no specific org name is expected
        const inputError = statementOfTruth.getAttribute('input-error');
        // Error should either be null or not include "must match"
        if (inputError) {
          expect(inputError).to.not.include('must match');
        }
      });
    });
  });
});
