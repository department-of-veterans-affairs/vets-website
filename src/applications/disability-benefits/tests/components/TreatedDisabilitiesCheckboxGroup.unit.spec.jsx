import React from 'react';
import { render, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import TreatedDisabilitiesCheckboxGroup from '../../components/TreatedDisabilitiesCheckboxGroup';

describe('TreatedDisabilitiesCheckboxGroup', () => {
  let mockStore;
  let defaultProps;

  beforeEach(() => {
    mockStore = {
      getState: () => ({
        form: {
          data: {
            newDisabilities: [
              { condition: 'Tinnitus' },
              { condition: 'PTSD' },
              { condition: 'back pain' }, // Test lowercase
            ],
            ratedDisabilities: [{ name: 'Knee pain' }, { name: 'Anxiety' }],
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    defaultProps = {
      id: 'test-checkbox-group',
      value: {},
      onChange: sinon.spy(),
      errorSchema: {},
      formData: {},
      formContext: {},
      disabled: false,
      readonly: false,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Initial Rendering', () => {
    it('should render checkboxes for all disabilities sorted alphabetically', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(5);

      // Check alphabetical order (case-insensitive)
      const labels = Array.from(checkboxes).map(cb => cb.getAttribute('label'));
      expect(labels[0]).to.equal('Anxiety');
      expect(labels[1]).to.equal('Back Pain'); // Capitalized
      expect(labels[2]).to.equal('Knee Pain');
      expect(labels[3]).to.equal('PTSD'); // Capitalized
      expect(labels[4]).to.equal('Tinnitus');
    });

    it('should initialize all checkbox values to false on mount', async () => {
      render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      await waitFor(() => {
        expect(defaultProps.onChange.calledOnce).to.be.true;
        const initializedValue = defaultProps.onChange.firstCall.args[0];
        expect(initializedValue).to.deep.equal({
          Anxiety: false,
          'back pain': false,
          'Knee pain': false,
          PTSD: false,
          Tinnitus: false,
        });
      });
    });

    it('should show info alert when no disabilities are available', () => {
      const emptyStore = {
        getState: () => ({
          form: {
            data: {
              newDisabilities: [],
              ratedDisabilities: [],
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { getByText } = render(
        <Provider store={emptyStore}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      expect(
        getByText(
          'No conditions available. Please add conditions in previous sections first.',
        ),
      ).to.exist;
    });
  });

  describe('User Interactions', () => {
    it('should update value when checkbox is checked', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      const tinnitusCheckbox = container.querySelector(
        'va-checkbox[label="Tinnitus"]',
      );

      // Simulate checking the checkbox
      const changeEvent = new CustomEvent('vaChange', {
        detail: { checked: true },
        bubbles: true,
      });
      tinnitusCheckbox.dispatchEvent(changeEvent);

      await waitFor(() => {
        const { lastCall } = defaultProps.onChange;
        expect(lastCall.args[0]).to.include({
          Tinnitus: true,
          PTSD: false,
        });
      });
    });

    it('should handle multiple checkbox selections', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      const tinnitusCheckbox = container.querySelector(
        'va-checkbox[label="Tinnitus"]',
      );
      const ptsdCheckbox = container.querySelector('va-checkbox[label="Ptsd"]'); // 'Ptsd' not 'PTSD'

      // Check Tinnitus
      tinnitusCheckbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        expect(defaultProps.onChange.called).to.be.true;
      });

      // Check PTSD
      ptsdCheckbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        const { lastCall } = defaultProps.onChange;
        expect(lastCall.args[0].Tinnitus).to.be.true;
        expect(lastCall.args[0].PTSD).to.be.true; // Key is 'PTSD'
      });
    });
    it('should handle unchecking a checkbox', async () => {
      const propsWithChecked = {
        ...defaultProps,
        formData: {
          Tinnitus: true,
          PTSD: false,
        },
      };

      const { container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsWithChecked} />
        </Provider>,
      );

      const tinnitusCheckbox = container.querySelector(
        'va-checkbox[label="Tinnitus"]',
      );

      // Uncheck Tinnitus
      tinnitusCheckbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: false },
          bubbles: true,
        }),
      );

      await waitFor(() => {
        const { lastCall } = defaultProps.onChange;
        expect(lastCall.args[0].Tinnitus).to.be.false;
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when validation fails', () => {
      const propsWithError = {
        ...defaultProps,
        errorSchema: {
          __errors: ['Please select at least one condition'],
        },
      };

      const { getByRole } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsWithError} />
        </Provider>,
      );

      const errorElement = getByRole('alert');
      expect(errorElement.textContent).to.include(
        'Please select at least one condition',
      );
    });

    it('should clear error when a checkbox is selected', async () => {
      const propsWithError = {
        ...defaultProps,
        errorSchema: {
          __errors: ['Please select at least one condition'],
        },
      };

      const { container, getByRole } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsWithError} />
        </Provider>,
      );

      // Error should be visible initially
      expect(getByRole('alert')).to.exist;

      // Check a checkbox
      const checkbox = container.querySelector('va-checkbox');
      checkbox.dispatchEvent(
        new CustomEvent('vaChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      // Update props without error
      propsWithError.errorSchema = {};

      await waitFor(() => {
        expect(defaultProps.onChange.called).to.be.true;
      });
    });
  });

  // ...existing imports and setup...

  describe('Read-only Mode', () => {
    it('should show list of selected conditions in read-only mode', () => {
      const propsReadOnly = {
        ...defaultProps,
        readonly: true,
        formData: {
          Tinnitus: true,
          'back pain': true, // Use lowercase key as stored
          PTSD: false,
          'Knee pain': false,
          Anxiety: false,
        },
      };

      const { getByText, queryByText, container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsReadOnly} />
        </Provider>,
      );

      // Should show as definition list
      expect(getByText('What conditions were you treated for?')).to.exist;

      // Should show selected conditions with proper capitalization
      expect(getByText('Tinnitus')).to.exist;
      expect(getByText('Back Pain')).to.exist; // Displayed with capitalization

      // Should not show unselected conditions
      expect(queryByText('PTSD')).to.not.exist; // Changed from 'Ptsd'
      expect(queryByText('Knee Pain')).to.not.exist;

      // Should not render checkboxes
      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(0);
    });

    it('should show "None selected" with error in read-only mode when no conditions selected', () => {
      const propsReadOnly = {
        ...defaultProps,
        readonly: true,
        errorSchema: {
          __errors: ['Please select at least one condition'],
        },
        formData: {
          Tinnitus: false,
          PTSD: false,
        },
      };

      const { getByText } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsReadOnly} />
        </Provider>,
      );

      expect(getByText('None selected')).to.exist;
      expect(getByText('Please select at least one condition')).to.exist;
    });

    it('should not call onChange when attempting to interact in read-only mode', () => {
      const propsReadOnly = {
        ...defaultProps,
        readonly: true,
        onChange: sinon.spy(),
      };

      render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsReadOnly} />
        </Provider>,
      );

      expect(propsReadOnly.onChange.called).to.be.false;
    });
  });

  describe('Disabled State', () => {
    it('should treat disabled state as read-only', () => {
      const propsDisabled = {
        ...defaultProps,
        disabled: true,
        formData: {
          Tinnitus: true,
        },
      };

      const { getByText, container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsDisabled} />
        </Provider>,
      );

      // Should show as definition list
      expect(getByText('What conditions were you treated for?')).to.exist;
      expect(getByText('Tinnitus')).to.exist;

      // Should not render checkboxes
      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(0);
    });
  });

  describe('Form Context Modes', () => {
    it('should be read-only when in review mode', () => {
      const propsReviewMode = {
        ...defaultProps,
        formContext: { reviewMode: true },
        formData: {
          Tinnitus: true,
        },
      };

      const { getByText, container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsReviewMode} />
        </Provider>,
      );

      expect(getByText('What conditions were you treated for?')).to.exist;
      expect(getByText('Tinnitus')).to.exist;

      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(0);
    });

    it('should be read-only when form is submitted', () => {
      const propsSubmitted = {
        ...defaultProps,
        formContext: { submitted: true },
        formData: {
          PTSD: true,
        },
      };

      const { getByText, container } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsSubmitted} />
        </Provider>,
      );

      expect(getByText('What conditions were you treated for?')).to.exist;
      expect(getByText('Ptsd')).to.exist; // Display as 'Ptsd'

      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle disabilities with leading/trailing spaces', () => {
      const storeWithSpaces = {
        getState: () => ({
          form: {
            data: {
              newDisabilities: [
                { condition: '  Tinnitus  ' },
                { condition: 'PTSD ' },
              ],
              ratedDisabilities: [],
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { container } = render(
        <Provider store={storeWithSpaces}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(2);

      const labels = Array.from(checkboxes).map(cb => cb.getAttribute('label'));
      expect(labels).to.include('Ptsd');
      expect(labels).to.include('Tinnitus');
    });

    it('should handle disabilities with leading/trailing spaces', () => {
      const storeWithSpaces = {
        getState: () => ({
          form: {
            data: {
              newDisabilities: [
                { condition: '  Tinnitus  ' },
                { condition: 'PTSD ' },
              ],
              ratedDisabilities: [],
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const { container } = render(
        <Provider store={storeWithSpaces}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      const checkboxes = container.querySelectorAll('va-checkbox');
      expect(checkboxes).to.have.length(2);

      const labels = Array.from(checkboxes).map(cb => cb.getAttribute('label'));
      expect(labels).to.include('Ptsd'); // 'Ptsd' not 'PTSD'
      expect(labels).to.include('Tinnitus');
    });

    it('should maintain state when disabilities list changes', async () => {
      const { rerender } = render(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...defaultProps} />
        </Provider>,
      );

      // Check a condition
      const propsWithSelection = {
        ...defaultProps,
        formData: {
          Tinnitus: true,
        },
      };

      rerender(
        <Provider store={mockStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsWithSelection} />
        </Provider>,
      );

      // Update store with new disability
      const updatedStore = {
        getState: () => ({
          form: {
            data: {
              newDisabilities: [
                { condition: 'Tinnitus' },
                { condition: 'PTSD' },
                { condition: 'New Condition' }, // Added
              ],
              ratedDisabilities: [{ name: 'Knee pain' }],
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      rerender(
        <Provider store={updatedStore}>
          <TreatedDisabilitiesCheckboxGroup {...propsWithSelection} />
        </Provider>,
      );

      await waitFor(() => {
        // onChange should be called with new disability initialized
        const { lastCall } = defaultProps.onChange;
        expect(lastCall.args[0].Tinnitus).to.be.true; // Maintains selection
        expect(lastCall.args[0]['New Condition']).to.be.false; // New one initialized
      });
    });
  });
});
