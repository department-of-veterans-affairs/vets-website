/**
 * @module tests/components/PreSubmitInfo.unit.spec
 * @description Unit tests for PreSubmitInfo component
 */

import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import PreSubmitInfo, { isSignatureValid } from './pre-submit-info';

const mockStore = configureStore([]);

describe('PreSubmitInfo Component', () => {
  describe('Component Export', () => {
    it('should export a React functional component as default', () => {
      expect(PreSubmitInfo).to.exist;
      expect(PreSubmitInfo).to.be.a('function');
    });

    it('should export isSignatureValid utility function', () => {
      expect(isSignatureValid).to.exist;
      expect(isSignatureValid).to.be.a('function');
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

    it('should handle special characters in names', () => {
      expect(isSignatureValid("O'Brien")).to.be.true;
      expect(isSignatureValid('Smith-Jones')).to.be.true;
      expect(isSignatureValid('José')).to.be.true;
      expect(isSignatureValid("Mary-Jane O'Connor")).to.be.true;
    });

    it('should handle very long signatures', () => {
      const longName = 'A'.repeat(100);
      expect(isSignatureValid(longName)).to.be.true;
    });
  });

  describe('Component Rendering', () => {
    let store;

    beforeEach(() => {
      store = mockStore({});
    });

    it('should render VaStatementOfTruth component', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth).to.exist;
    });

    it('should render with statement of truth text', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { getByText } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      expect(
        getByText(
          'I confirm that the identifying information in this form is accurate and has been represented correctly.',
        ),
      ).to.exist;
    });

    it('should render with empty signature initially', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-value')).to.equal('');
    });

    it('should render with existing signature value', () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-value')).to.equal('John Doe');
    });

    it('should render with checkbox checked when certified is true', () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.hasAttribute('checked')).to.be.true;
    });

    it('should handle missing certification object in formData', () => {
      const formData = {};

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-value')).to.equal('');
    });
  });

  describe('Error Display', () => {
    let store;

    beforeEach(() => {
      store = mockStore({});
    });

    it('should not show signature error initially without showError', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} showError={false} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.not.exist;
    });

    it('should show signature error when showError is true and signature invalid', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} showError />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.equal(
        'Please enter a name (at least 3 characters)',
      );
    });

    it('should show checkbox error when showError is true and not certified', () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} showError />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('checkbox-error')).to.equal(
        'You must certify by checking the box',
      );
    });

    it('should not show errors when form is valid', () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} showError />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.not.exist;
      expect(statementOfTruth.getAttribute('checkbox-error')).to.not.exist;
    });
  });

  describe('User Interactions', () => {
    let store;

    beforeEach(() => {
      store = mockStore({});
    });

    it('should dispatch setData when signature changes', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Simulate signature input change
      statementOfTruth.dispatchEvent(
        new CustomEvent('vaInputChange', {
          detail: { value: 'John Doe' },
          bubbles: true,
        }),
      );

      const actions = store.getActions();
      expect(actions.length).to.be.greaterThan(0);
      expect(actions[0].type).to.equal('SET_DATA');
      expect(actions[0].data.certification.signature).to.equal('John Doe');
    });

    it('should dispatch setData when checkbox changes', () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Simulate checkbox change
      statementOfTruth.dispatchEvent(
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
          bubbles: true,
        }),
      );

      const actions = store.getActions();
      expect(actions.length).to.be.greaterThan(0);
      expect(actions[0].type).to.equal('SET_DATA');
      expect(actions[0].data.certification.certified).to.be.true;
    });

    it('should update signature blur state on blur event', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      // Simulate blur event
      statementOfTruth.dispatchEvent(
        new CustomEvent('vaInputBlur', {
          bubbles: true,
        }),
      );

      // After blur with invalid signature, error should appear
      expect(statementOfTruth.getAttribute('input-error')).to.equal(
        'Please enter a name (at least 3 characters)',
      );
    });
  });

  describe('onSectionComplete Callback', () => {
    let store;
    let onSectionComplete;

    beforeEach(() => {
      store = mockStore({});
      onSectionComplete = sinon.spy();
    });

    it('should call onSectionComplete with false when form is invalid', async () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      render(
        <Provider store={store}>
          <PreSubmitInfo
            formData={formData}
            onSectionComplete={onSectionComplete}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(onSectionComplete.called).to.be.true;
        expect(onSectionComplete.getCall(0).args[0]).to.be.false;
      });
    });

    it('should call onSectionComplete with true when form is valid', async () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: true,
        },
      };

      render(
        <Provider store={store}>
          <PreSubmitInfo
            formData={formData}
            onSectionComplete={onSectionComplete}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(onSectionComplete.called).to.be.true;
        expect(onSectionComplete.getCall(0).args[0]).to.be.true;
      });
    });

    it('should call onSectionComplete with false when signature too short', async () => {
      const formData = {
        certification: {
          signature: 'Jo',
          certified: true,
        },
      };

      render(
        <Provider store={store}>
          <PreSubmitInfo
            formData={formData}
            onSectionComplete={onSectionComplete}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(onSectionComplete.called).to.be.true;
        expect(onSectionComplete.getCall(0).args[0]).to.be.false;
      });
    });

    it('should call onSectionComplete with false when not certified', async () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: false,
        },
      };

      render(
        <Provider store={store}>
          <PreSubmitInfo
            formData={formData}
            onSectionComplete={onSectionComplete}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(onSectionComplete.called).to.be.true;
        expect(onSectionComplete.getCall(0).args[0]).to.be.false;
      });
    });

    it('should not fail when onSectionComplete is undefined', () => {
      const formData = {
        certification: {
          signature: 'John Doe',
          certified: true,
        },
      };

      expect(() => {
        render(
          <Provider store={store}>
            <PreSubmitInfo formData={formData} />
          </Provider>,
        );
      }).to.not.throw();
    });
  });

  describe('Default Props', () => {
    let store;

    beforeEach(() => {
      store = mockStore({});
    });

    it('should use default formData when not provided', () => {
      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-value')).to.equal('');
      // Checked attribute exists but should be falsy or undefined when not checked
      const checkedAttr = statementOfTruth.getAttribute('checked');
      expect(
        checkedAttr === null ||
          checkedAttr === 'false' ||
          checkedAttr === false,
      ).to.be.true;
    });

    it('should use default showError as false', () => {
      const formData = {
        certification: {
          signature: '',
          certified: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <PreSubmitInfo formData={formData} />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.not.exist;
    });
  });
});
