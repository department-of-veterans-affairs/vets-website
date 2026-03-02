import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import {
  PreSubmitSignature,
  preSubmitSignatureConfig,
  normalizeName,
  getValidSignerNames,
  isSignatureValid,
} from './pre-submit-signature';

describe('21-2680 PreSubmitSignature Component', () => {
  let store;
  let dispatchSpy;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatchSpy = sandbox.spy();
    store = {
      getState: () => ({
        form: {
          submission: {
            status: false,
          },
        },
      }),
      subscribe: () => {},
      dispatch: dispatchSpy,
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Helper Functions', () => {
    describe('normalizeName', () => {
      it('should return empty string for null input', () => {
        expect(normalizeName(null)).to.equal('');
      });

      it('should return empty string for undefined input', () => {
        expect(normalizeName(undefined)).to.equal('');
      });

      it('should return empty string for non-string input', () => {
        expect(normalizeName(123)).to.equal('');
        expect(normalizeName({})).to.equal('');
        expect(normalizeName([])).to.equal('');
      });

      it('should trim whitespace', () => {
        expect(normalizeName('  John Doe  ')).to.equal('john doe');
      });

      it('should convert to lowercase', () => {
        expect(normalizeName('JOHN DOE')).to.equal('john doe');
      });

      it('should normalize multiple spaces to single space', () => {
        expect(normalizeName('John   Doe')).to.equal('john doe');
      });

      it('should handle mixed case and spaces', () => {
        expect(normalizeName('  JoHn   DoE  ')).to.equal('john doe');
      });
    });

    describe('getValidSignerNames', () => {
      it('should return veteran name when claimant is veteran', () => {
        const formData = {
          claimantRelationship: { relationship: 'veteran' },
          veteranInformation: {
            veteranFullName: { first: 'John', last: 'Doe' },
          },
        };
        const names = getValidSignerNames(formData);
        expect(names).to.deep.equal(['John Doe']);
      });

      it('should return both names when claimant is not veteran', () => {
        const formData = {
          claimantRelationship: { relationship: 'spouse' },
          veteranInformation: {
            veteranFullName: { first: 'John', last: 'Doe' },
          },
          claimantInformation: {
            claimantFullName: { first: 'Jane', last: 'Doe' },
          },
        };
        const names = getValidSignerNames(formData);
        expect(names).to.deep.equal(['John Doe', 'Jane Doe']);
      });

      it('should return only veteran name when claimant name is missing', () => {
        const formData = {
          claimantRelationship: { relationship: 'spouse' },
          veteranInformation: {
            veteranFullName: { first: 'John', last: 'Doe' },
          },
          claimantInformation: {},
        };
        const names = getValidSignerNames(formData);
        expect(names).to.deep.equal(['John Doe']);
      });

      it('should return empty array when no names available', () => {
        const formData = {
          claimantRelationship: { relationship: 'veteran' },
          veteranInformation: {},
        };
        const names = getValidSignerNames(formData);
        expect(names).to.deep.equal([]);
      });

      it('should handle child relationship', () => {
        const formData = {
          claimantRelationship: { relationship: 'child' },
          veteranInformation: {
            veteranFullName: { first: 'John', last: 'Doe' },
          },
          claimantInformation: {
            claimantFullName: { first: 'Junior', last: 'Doe' },
          },
        };
        const names = getValidSignerNames(formData);
        expect(names).to.deep.equal(['John Doe', 'Junior Doe']);
      });

      it('should handle parent relationship', () => {
        const formData = {
          claimantRelationship: { relationship: 'parent' },
          veteranInformation: {
            veteranFullName: { first: 'John', last: 'Doe' },
          },
          claimantInformation: {
            claimantFullName: { first: 'Senior', last: 'Doe' },
          },
        };
        const names = getValidSignerNames(formData);
        expect(names).to.deep.equal(['John Doe', 'Senior Doe']);
      });
    });

    describe('isSignatureValid', () => {
      it('should return true when signature matches one of the valid names', () => {
        const validNames = ['John Doe', 'Jane Doe'];
        expect(isSignatureValid('John Doe', validNames)).to.be.true;
        expect(isSignatureValid('Jane Doe', validNames)).to.be.true;
      });

      it('should return false when signature does not match', () => {
        const validNames = ['John Doe', 'Jane Doe'];
        expect(isSignatureValid('Bob Smith', validNames)).to.be.false;
      });

      it('should be case insensitive', () => {
        const validNames = ['John Doe'];
        expect(isSignatureValid('JOHN DOE', validNames)).to.be.true;
        expect(isSignatureValid('john doe', validNames)).to.be.true;
      });

      it('should handle extra whitespace', () => {
        const validNames = ['John Doe'];
        expect(isSignatureValid('  John   Doe  ', validNames)).to.be.true;
      });

      it('should return false for empty signature', () => {
        const validNames = ['John Doe'];
        expect(isSignatureValid('', validNames)).to.be.false;
      });
    });
  });

  describe('Component Rendering', () => {
    it('should render without errors when veteran is claimant', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should render without errors when claimant is spouse', () => {
      const formData = {
        claimantRelationship: { relationship: 'spouse' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
        claimantInformation: {
          claimantFullName: { first: 'Jane', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      expect(container).to.exist;
    });

    it('should display legal warning text', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      expect(container.textContent).to.include('According to federal law');
      expect(container.textContent).to.include('18 U.S.C. 1001');
    });

    it('should display veteran name when veteran is claimant', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      expect(container.textContent).to.include('John Doe');
    });

    it('should display both names when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: { relationship: 'spouse' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
        claimantInformation: {
          claimantFullName: { first: 'Jane', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      expect(container.textContent).to.include('John Doe');
      expect(container.textContent).to.include('Jane Doe');
    });

    it('should render VaStatementOfTruth component', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth).to.exist;
    });
  });

  describe('Missing Name Handling', () => {
    it('should show error alert when no names available', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {},
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(container.textContent).to.include('Missing information');
    });

    it('should display helpful message in error alert', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {},
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      expect(container.textContent).to.include('We need your full name');
      expect(container.textContent).to.include('Please go back');
    });
  });

  describe('Signature Validation', () => {
    it('should accept veteran signature when veteran is claimant', async () => {
      const callback = sandbox.spy();
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'John Doe' },
        }),
      );

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(callback.called).to.be.true;
        const { lastCall } = callback;
        expect(lastCall.args[0]).to.be.true;
      });
    });

    it('should accept veteran signature when claimant is not veteran', async () => {
      const callback = sandbox.spy();
      const formData = {
        claimantRelationship: { relationship: 'spouse' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
        claimantInformation: {
          claimantFullName: { first: 'Jane', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'John Doe' },
        }),
      );

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(callback.called).to.be.true;
        const { lastCall } = callback;
        expect(lastCall.args[0]).to.be.true;
      });
    });

    it('should accept claimant signature when claimant is not veteran', async () => {
      const callback = sandbox.spy();
      const formData = {
        claimantRelationship: { relationship: 'spouse' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
        claimantInformation: {
          claimantFullName: { first: 'Jane', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'Jane Doe' },
        }),
      );

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(callback.called).to.be.true;
        const { lastCall } = callback;
        expect(lastCall.args[0]).to.be.true;
      });
    });

    it('should reject invalid signature', async () => {
      const callback = sandbox.spy();
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'Bob Smith' },
        }),
      );

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(callback.called).to.be.true;
        const { lastCall } = callback;
        expect(lastCall.args[0]).to.be.false;
      });
    });

    it('should validate case-insensitive signature', async () => {
      const callback = sandbox.spy();
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'JOHN DOE' },
        }),
      );

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaCheckboxChange', {
          detail: { checked: true },
        }),
      );

      await waitFor(() => {
        expect(callback.called).to.be.true;
        const { lastCall } = callback;
        expect(lastCall.args[0]).to.be.true;
      });
    });
  });

  describe('Error States', () => {
    it('should not show errors when showError is false', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-error')).to.be.null;
    });

    it('should show error with veteran name only when veteran is claimant', async () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      await waitFor(() => {
        const statementOfTruth = container.querySelector(
          'va-statement-of-truth',
        );
        const inputError = statementOfTruth.getAttribute('input-error');
        expect(inputError).to.include('John Doe');
        expect(inputError).to.not.include(' or ');
      });
    });

    it('should show error with both names when claimant is not veteran', async () => {
      const formData = {
        claimantRelationship: { relationship: 'spouse' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
        claimantInformation: {
          claimantFullName: { first: 'Jane', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      await waitFor(() => {
        const statementOfTruth = container.querySelector(
          'va-statement-of-truth',
        );
        const inputError = statementOfTruth.getAttribute('input-error');
        expect(inputError).to.include('John Doe');
        expect(inputError).to.include('Jane Doe');
        expect(inputError).to.include(' or ');
      });
    });

    it('should show checkbox error when showError is true and not checked', async () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      await waitFor(() => {
        const statementOfTruth = container.querySelector(
          'va-statement-of-truth',
        );
        expect(statementOfTruth.getAttribute('checkbox-error')).to.not.be.null;
      });
    });

    it('should not show errors after form submission', async () => {
      const submittedStore = {
        getState: () => ({
          form: {
            submission: {
              status: 'submitted',
            },
          },
        }),
        subscribe: () => {},
        dispatch: dispatchSpy,
      };

      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };

      const { container } = render(
        <Provider store={submittedStore}>
          <PreSubmitSignature
            formData={formData}
            showError
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      await waitFor(() => {
        const statementOfTruth = container.querySelector(
          'va-statement-of-truth',
        );
        expect(statementOfTruth.getAttribute('input-error')).to.be.null;
        expect(statementOfTruth.getAttribute('checkbox-error')).to.be.null;
      });
    });
  });

  describe('Dispatch Behavior', () => {
    it('should call dispatch when signature data changes', async () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(dispatchSpy.called).to.be.true;
      });
    });

    it('should not dispatch when form is already submitted', () => {
      const submittedStore = {
        getState: () => ({
          form: {
            submission: {
              status: 'submitted',
            },
          },
        }),
        subscribe: () => {},
        dispatch: dispatchSpy,
      };

      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };

      render(
        <Provider store={submittedStore}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      expect(dispatchSpy.called).to.be.false;
    });
  });

  describe('Event Handlers', () => {
    it('should handle input change event', async () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'John Doe' },
        }),
      );

      await waitFor(() => {
        expect(dispatchSpy.called).to.be.true;
      });
    });

    it('should handle input blur event', async () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      const statementOfTruth = container.querySelector('va-statement-of-truth');
      fireEvent(statementOfTruth, new CustomEvent('vaInputBlur'));

      expect(statementOfTruth).to.exist;
    });

    it('should handle checkbox change event', async () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
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
        expect(dispatchSpy.called).to.be.true;
      });
    });
  });

  describe('Existing Form Data', () => {
    it('should initialize with existing signature data', () => {
      const formData = {
        claimantRelationship: { relationship: 'veteran' },
        veteranInformation: {
          veteranFullName: { first: 'John', last: 'Doe' },
        },
        statementOfTruthSignature: 'John Doe',
        statementOfTruthCertified: true,
      };
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );
      const statementOfTruth = container.querySelector('va-statement-of-truth');
      expect(statementOfTruth.getAttribute('input-value')).to.equal('John Doe');
      expect(statementOfTruth.getAttribute('checked')).to.equal('true');
    });
  });

  describe('Configuration Export', () => {
    it('should export preSubmitSignatureConfig', () => {
      expect(preSubmitSignatureConfig).to.exist;
      expect(preSubmitSignatureConfig).to.be.an('object');
    });

    it('should have required property set to true', () => {
      expect(preSubmitSignatureConfig.required).to.be.true;
    });

    it('should have CustomComponent property', () => {
      expect(preSubmitSignatureConfig.CustomComponent).to.exist;
      expect(preSubmitSignatureConfig.CustomComponent).to.equal(
        PreSubmitSignature,
      );
    });
  });
});
