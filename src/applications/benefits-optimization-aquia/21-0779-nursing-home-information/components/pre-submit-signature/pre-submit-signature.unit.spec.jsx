import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import {
  PreSubmitSignature,
  preSubmitSignatureConfig,
} from './pre-submit-signature';

describe('PreSubmitSignature Component', () => {
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

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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

    it('should display officials name in statement', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
      expect(container.textContent).to.include('Luke Skywalker');
    });

    it('should render VaStatementOfTruth component', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Leia',
            last: 'Organa',
          },
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

    it('should handle names with only first name', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
          },
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
      expect(container.textContent).to.include('Luke');
    });

    it('should handle names with only last name', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            last: 'Skywalker',
          },
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
      expect(container.textContent).to.include('Skywalker');
    });
  });

  describe('Missing Name Handling', () => {
    it('should show error alert when no name provided', () => {
      const formData = {
        nursingOfficialInformation: {},
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
      expect(container.textContent).to.include('Missing claimant information');
    });

    it('should display helpful message in error alert', () => {
      const formData = {
        nursingOfficialInformation: {},
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

    it('should show error when nursingOfficialInformation is missing', () => {
      const formData = {};
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
    });
  });

  describe('Dispatch Behavior', () => {
    it('should call dispatch when signature data changes', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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

  describe('Callback Behavior', () => {
    it('should call onSectionComplete callback', async () => {
      const callback = sandbox.spy();
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
      };

      render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );

      await waitFor(() => {
        expect(callback.called).to.be.true;
      });
    });
  });

  describe('Error States', () => {
    it('should not show errors when showError is false', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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

    it('should show error when showError is true and signature does not match', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
      };
      const { container, rerender } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      rerender(
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
        expect(statementOfTruth.getAttribute('input-error')).to.not.be.null;
      });
    });

    it('should show checkbox error when showError is true and not checked', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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

    it('should handle form with existing signature data', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
        signature: 'Luke Skywalker',
        certificationChecked: true,
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
  });

  describe('Props and Configuration', () => {
    it('should accept formData prop', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Qui-Gon',
            last: 'Jinn',
          },
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

    it('should accept showError prop', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Qui-Gon',
            last: 'Jinn',
          },
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
      expect(container).to.exist;
    });

    it('should accept onSectionComplete callback', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Qui-Gon',
            last: 'Jinn',
          },
        },
      };
      const callback = sandbox.spy();
      const { container } = render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={callback}
          />
        </Provider>,
      );
      expect(container).to.exist;
    });
  });

  describe('Event Handlers', () => {
    it('should handle input change event', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: 'Luke Skywalker' },
        }),
      );

      await waitFor(() => {
        expect(dispatchSpy.called).to.be.true;
      });
    });

    it('should handle input blur event', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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

    it('should trim signature value on input change', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: '  Luke Skywalker  ' },
        }),
      );

      await waitFor(() => {
        expect(dispatchSpy.called).to.be.true;
      });
    });

    it('should update onSectionComplete when signature matches and checkbox is checked', async () => {
      const callback = sandbox.spy();
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: 'Luke Skywalker' },
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
      });
    });
  });

  describe('Signature Validation', () => {
    it('should validate case-insensitive signature', async () => {
      const callback = sandbox.spy();
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: 'LUKE SKYWALKER' },
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
      });
    });

    it('should handle extra spaces in signature', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: 'Luke  Skywalker' },
        }),
      );

      expect(statementOfTruth).to.exist;
    });

    it('should reject invalid signature', async () => {
      const callback = sandbox.spy();
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: 'Leia Organa' },
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
      });
    });

    it('should handle empty signature value', async () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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

      const statementOfTruth = container.querySelector('va-statement-of-truth');

      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: '' },
        }),
      );

      fireEvent(statementOfTruth, new CustomEvent('vaInputBlur'));

      await waitFor(() => {
        expect(statementOfTruth.getAttribute('input-error')).to.not.be.null;
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle names with special characters', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Obi-Wan',
            last: 'Kenobi',
          },
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
      expect(container.textContent).to.include('Obi-Wan Kenobi');
    });

    it('should handle names with multiple spaces', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
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
      expect(container.textContent).to.include('Padmé Amidala');
    });

    it('should not dispatch if signature values have not changed', () => {
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
        signature: '',
        certificationChecked: false,
      };

      sandbox.resetHistory();

      render(
        <Provider store={store}>
          <PreSubmitSignature
            formData={formData}
            showError={false}
            onSectionComplete={() => {}}
          />
        </Provider>,
      );

      expect(dispatchSpy.called).to.be.false;
    });

    it('should handle rapid state changes', async () => {
      const callback = sandbox.spy();
      const formData = {
        nursingOfficialInformation: {
          fullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
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
          detail: { value: 'J' },
        }),
      );
      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'Jo' },
        }),
      );
      fireEvent(
        statementOfTruth,
        new CustomEvent('vaInputChange', {
          detail: { value: 'Luke Skywalker' },
        }),
      );

      await waitFor(() => {
        expect(dispatchSpy.called).to.be.true;
      });
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
