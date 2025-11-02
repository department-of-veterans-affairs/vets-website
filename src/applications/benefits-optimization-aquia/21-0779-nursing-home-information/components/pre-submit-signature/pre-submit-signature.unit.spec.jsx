/**
 * Unit tests for PreSubmitSignature component
 */

import React from 'react';
import { render } from '@testing-library/react';
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
          firstName: 'John',
          lastName: 'Doe',
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
          firstName: 'John',
          lastName: 'Doe',
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
          firstName: 'John',
          lastName: 'Doe',
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

    it('should render VaStatementOfTruth component', () => {
      const formData = {
        nursingOfficialInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
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
  });

  describe('Props and Configuration', () => {
    it('should accept formData prop', () => {
      const formData = {
        nursingOfficialInformation: {
          firstName: 'Test',
          lastName: 'User',
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
          firstName: 'Test',
          lastName: 'User',
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
          firstName: 'Test',
          lastName: 'User',
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
