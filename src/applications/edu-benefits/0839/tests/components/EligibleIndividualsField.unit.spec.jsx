import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import EligibleIndividualsField from '../../components/EligibleIndividualsField';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      form: (
        state = initialState.form || {
          data: {},
        },
      ) => state,
    },
    preloadedState: initialState,
  });
};

describe('EligibleIndividualsField Component', () => {
  let onChangeSpy;
  let store;

  const getDefaultProps = (overrides = {}) => ({
    error: undefined,
    required: false,
    childrenProps: {
      formData: {},
      onChange: onChangeSpy,
      ...overrides.childrenProps,
    },
    ...overrides,
  });

  beforeEach(() => {
    onChangeSpy = sinon.spy();
    store = createMockStore({
      form: {
        data: {},
      },
    });
  });

  const renderWithProvider = (props = {}) => {
    const defaultProps = getDefaultProps(props);
    return render(
      <Provider store={store}>
        <EligibleIndividualsField {...defaultProps} />
      </Provider>,
    );
  };

  describe('Error Handling', () => {
    it('should display error message when error prop is provided and checkbox is not checked', () => {
      const { container } = renderWithProvider({
        error: 'This field is required',
        childrenProps: {
          formData: { unlimitedIndividuals: false },
        },
      });

      const textInput = $('va-text-input', container);
      expect(textInput.getAttribute('error')).to.equal(
        'This field is required',
      );
    });
  });

  describe('Required Field Behavior', () => {
    it('should mark text input as required when required prop is true and checkbox is not checked', () => {
      const { container } = renderWithProvider({
        required: true,
        childrenProps: {
          formData: { unlimitedIndividuals: false },
        },
      });

      const textInput = $('va-text-input', container);
      expect(textInput.getAttribute('required')).to.equal('true');
    });

    it('should not mark text input as required when checkbox is checked', () => {
      const { container } = renderWithProvider({
        required: true,
        childrenProps: {
          formData: { unlimitedIndividuals: true },
        },
      });

      const textInput = $('va-text-input', container);
      if (textInput) {
        expect(textInput.getAttribute('required')).to.equal('false');
      } else {
        expect(textInput).to.be.null;
      }
    });

    it('should not mark text input as required when required prop is false', () => {
      const { container } = renderWithProvider({
        required: false,
        childrenProps: {
          formData: { unlimitedIndividuals: false },
        },
      });

      const textInput = $('va-text-input', container);
      expect(textInput.getAttribute('required')).to.equal('false');
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes', () => {
      const { container } = renderWithProvider();

      const fieldContainer = $('.eligible-individuals-field', container);
      expect(fieldContainer).to.exist;
      expect(fieldContainer.classList.contains('container')).to.be.true;
    });
  });

  describe('Component Logic', () => {
    it('should handle undefined formData gracefully', () => {
      const { container } = renderWithProvider({
        childrenProps: {
          formData: undefined,
        },
      });

      const textInput = $('va-text-input', container);
      const checkbox = $('va-checkbox', container);

      expect(textInput.getAttribute('value')).to.equal('');
      expect(checkbox.getAttribute('checked')).to.equal('false');
    });
  });
});
