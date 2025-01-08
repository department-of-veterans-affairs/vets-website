import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import * as OAuthUtils from 'platform/utilities/oauth/utilities';
import * as AuthUtils from 'platform/user/authentication/utilities';

import {
  VerifyButton,
  VerifyIdmeButton,
  VerifyLogingovButton,
  verifyHandler,
} from 'platform/user/authentication/components/VerifyButton';

const { logingov, idme } = SERVICE_PROVIDERS;

const sharedStore = ({ authBroker = 'iam' } = {}) => ({
  getState: () => ({ user: { profile: { session: { authBroker } } } }),
  dispatch: () => {},
  subscribe: () => {},
});
describe('VerifyIdmeButton', () => {
  it('should render the ID.me component (identity-verification) and pass queryParams including oauth=true', () => {
    const store = sharedStore();
    const queryParams = { operation: 'idme_verification', oauth: true }; // Include oauth=true
    const { container } = render(
      <Provider store={store}>
        <VerifyIdmeButton queryParams={queryParams} />
      </Provider>,
    );
    const button = $('.idme-verify-button', container);
    fireEvent.click(button);

    expect(button).to.exist;

    expect(queryParams.oauth).to.be.true;
  });
});

describe('VerifyLogingovButton', () => {
  it('should render the Login.gov component (identity-verification) and pass queryParams including oauth=true', () => {
    const store = sharedStore();
    const queryParams = { operation: 'logingov_verification', oauth: true }; // Include oauth=true
    const { container } = render(
      <Provider store={store}>
        <VerifyLogingovButton queryParams={queryParams} />
      </Provider>,
    );
    const button = $('.logingov-verify-button', container);
    fireEvent.click(button);

    expect(button).to.exist;

    expect(queryParams.oauth).to.be.true;
  });
});

describe('VerifyButton', () => {
  const store = sharedStore();

  [logingov, idme].forEach(({ policy }) => {
    it(`should render correctly for ${policy} and include oauth=true in queryParams`, () => {
      const queryParams = { operation: `${policy}_verification`, oauth: true }; // Include oauth=true
      const { container } = render(
        <Provider store={store}>
          <VerifyButton csp={policy} key={policy} queryParams={queryParams} />
        </Provider>,
      );
      const button = $(`.${policy}-verify-buttons`, container);

      expect(button).to.exist;
      expect(queryParams.oauth).to.be.true;
    });

    it(`should call the 'verifyHandler' for ${policy} with queryParams including oauth=true`, () => {
      const queryParams = { operation: `${policy}_verification`, oauth: true }; // Include oauth=true
      const verifyHandlerSpy = sinon.spy(verifyHandler);
      const { container } = render(
        <Provider store={store}>
          <VerifyButton
            csp={policy}
            onClick={verifyHandlerSpy}
            queryParams={queryParams}
          />
        </Provider>,
      );

      const button = $(`.${policy}-verify-buttons`, container);
      fireEvent.click(button);

      expect(verifyHandlerSpy.called).to.be.true;
      expect(
        verifyHandlerSpy.calledWith({
          policy,
          queryParams: { ...queryParams, oauth: true }, // Verify oauth=true
        }),
      ).to.be.true;

      verifyHandlerSpy.reset();
    });
  });
});

describe('verifyHandler', () => {
  let sandbox;

  beforeEach(() => {
    // Create a sandbox for each test
    sandbox = sinon.createSandbox();

    // Use the sandbox to spy on methods
    sandbox.spy(OAuthUtils, 'updateStateAndVerifier');
    sandbox.spy(AuthUtils, 'verify');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call verify with queryParams including oauth=true and call updateStateAndVerifier', () => {
    const queryParams = { operation: 'test_operation', oauth: true };
    const policy = 'logingov';

    verifyHandler({ policy, queryParams });

    const verifySpy = AuthUtils.verify;
    expect(verifySpy.calledOnce).to.be.true;
    expect(verifySpy.firstCall.args[0]).to.deep.include({
      policy,
      queryParams: { ...queryParams, oauth: true },
    });

    const updateStateSpy = OAuthUtils.updateStateAndVerifier;
    expect(updateStateSpy.calledOnce).to.be.true;
    expect(updateStateSpy.calledWith(policy)).to.be.true;
  });
});
