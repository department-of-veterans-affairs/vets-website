import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import {
  VerifyButton,
  VerifyIdmeButton,
  VerifyLogingovButton,
  verifyHandler,
} from 'platform/user/authentication/components/VerifyButton';
import { TOGGLE_NAMES } from 'platform/utilities/feature-toggles';
import * as OAuthUtils from 'platform/utilities/oauth/utilities';
import * as AuthUtils from 'platform/user/authentication/utilities';

const sharedStore = () => ({
  getState: () => ({
    featureToggles: {
      [TOGGLE_NAMES.identityLogingovIal2Enforcement]: false,
      [TOGGLE_NAMES.identityIdmeIal2Enforcement]: false,
    },
  }),
  dispatch: () => {},
  subscribe: () => {},
});

describe('Verify Buttons', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(AuthUtils, 'verify');
    sandbox.spy(OAuthUtils, 'updateStateAndVerifier');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const buttonTests = [
    {
      component: VerifyIdmeButton,
      className: '.idme-verify-button',
      policy: 'idme',
    },
    {
      component: VerifyLogingovButton,
      className: '.logingov-verify-button',
      policy: 'logingov',
    },
  ];

  buttonTests.forEach(({ component: ButtonComponent, className, policy }) => {
    it(`should render the ${policy} button and call verifyHandler with correct parameters`, () => {
      const store = sharedStore();
      const queryParams = { operation: `${policy}_verification` };
      const useOAuth = true;

      const { container } = render(
        <Provider store={store}>
          <ButtonComponent queryParams={queryParams} useOAuth={useOAuth} />
        </Provider>,
      );

      const button = container.querySelector(className);
      expect(button).to.exist;

      fireEvent.click(button);

      // Verify that `verify` was called with correct parameters
      sinon.assert.calledOnce(AuthUtils.verify);
      sinon.assert.calledWith(AuthUtils.verify, {
        policy,
        acr: sinon.match.string,
        queryParams,
        useOAuth,
      });

      // Verify that `updateStateAndVerifier` was called if `useOAuth` is true
      if (useOAuth) {
        sinon.assert.calledOnce(OAuthUtils.updateStateAndVerifier);
        sinon.assert.calledWith(OAuthUtils.updateStateAndVerifier, policy);
      }
    });
  });
});

describe('VerifyButton', () => {
  it('should render and call verifyHandler with correct parameters', () => {
    const store = sharedStore();
    const queryParams = { operation: 'generic_verification' };
    const useOAuth = true;
    const csp = 'logingov';

    const verifyHandlerSpy = sinon.spy(verifyHandler);

    const { container } = render(
      <Provider store={store}>
        <VerifyButton
          csp={csp}
          onClick={verifyHandlerSpy}
          queryParams={queryParams}
          useOAuth={useOAuth}
        />
      </Provider>,
    );

    const button = container.querySelector(`.${csp}-verify-buttons`);
    expect(button).to.exist;

    fireEvent.click(button);

    sinon.assert.calledOnce(verifyHandlerSpy);
    sinon.assert.calledWith(verifyHandlerSpy, {
      ial2Enforcement: false,
      policy: csp,
      queryParams,
      useOAuth,
    });
  });
});

describe('verifyHandler', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(AuthUtils, 'verify');
    sandbox.spy(OAuthUtils, 'updateStateAndVerifier');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call verify and updateStateAndVerifier correctly when useOAuth is true', () => {
    const queryParams = { operation: 'test_operation' };
    const useOAuth = true;
    const policy = 'logingov';

    verifyHandler({ policy, queryParams, useOAuth });

    sinon.assert.calledOnce(AuthUtils.verify);
    sinon.assert.calledWith(AuthUtils.verify, {
      policy,
      acr: sinon.match.string,
      queryParams,
      useOAuth,
    });

    sinon.assert.calledOnce(OAuthUtils.updateStateAndVerifier);
    sinon.assert.calledWith(OAuthUtils.updateStateAndVerifier, policy);
  });
});
