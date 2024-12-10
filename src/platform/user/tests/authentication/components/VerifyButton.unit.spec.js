import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import * as OAuthUtils from 'platform/utilities/oauth/utilities';
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
  it('should render the updated ID.me component (identity-verification)', () => {
    const store = sharedStore();
    const { container } = render(
      <Provider store={store}>
        <VerifyIdmeButton />
      </Provider>,
    );
    const button = $('.idme-verify-button', container);
    fireEvent.click(button);
    expect(button).to.exist;
  });
});

describe('VerifyLogingovButton', () => {
  it('should render the updated Login.gov component (identity-verification)', () => {
    const store = sharedStore();
    const { container } = render(
      <Provider store={store}>
        <VerifyLogingovButton />
      </Provider>,
    );
    const button = $('.logingov-verify-button', container);
    fireEvent.click(button);
    expect(button).to.exist;
  });
});

describe('VerifyButton', () => {
  const store = sharedStore();

  [logingov, idme].forEach(({ policy }) => {
    it(`should render correctly for ${policy}`, () => {
      const { container } = render(
        <Provider store={store}>
          <VerifyButton csp={policy} key={policy} />
        </Provider>,
      );
      expect($(`.${policy}-verify-buttons`, container)).to.exist;
    });

    it(`should call the 'verifyHandler' ${policy} function on click`, () => {
      const verifyHandlerSpy = sinon.spy(verifyHandler);
      const { container } = render(
        <Provider store={store}>
          <VerifyButton csp={policy} onClick={verifyHandlerSpy} />
        </Provider>,
      );

      const button = $(`.${policy}-verify-buttons`, container);
      fireEvent.click(button);
      expect(verifyHandlerSpy.called).to.be.true;
      verifyHandlerSpy.reset();
    });

    it('should include `queryParams` if required', () => {
      const verifyHandlerSpy = sinon.spy(verifyHandler);
      const { container } = render(
        <Provider store={store}>
          <VerifyButton
            csp={policy}
            onClick={verifyHandlerSpy}
            queryParams={{ operation: 'interstitial_signup' }}
          />
        </Provider>,
      );

      const button = $(`.${policy}-verify-buttons`, container);
      fireEvent.click(button);
      expect(verifyHandlerSpy.called).to.be.true;
      expect(
        verifyHandlerSpy.calledWith({
          policy,
          useOAuth: false,
          queryParams: { operation: 'interstitial_signup' },
        }),
      ).to.be.true;

      verifyHandlerSpy.reset();
    });
  });
});

describe('verifyHandler', () => {
  const mockOAuthUpdateStateAndVerifier = sinon.spy(
    OAuthUtils,
    'updateStateAndVerifier',
  );

  beforeEach(() => {
    mockOAuthUpdateStateAndVerifier.reset();
    localStorage.clear();
  });

  it('should not call updateStateAndVerifier if useOAuth is false', () => {
    verifyHandler({ useOAuth: false, policy: 'logingov' });
    expect(mockOAuthUpdateStateAndVerifier.called).to.be.false;
  });

  it('should call updateStateAndVerifier if useOAuth is present', () => {
    verifyHandler({ useOAuth: true, policy: 'logingov' });
    expect(mockOAuthUpdateStateAndVerifier.called).to.be.true;
    expect(mockOAuthUpdateStateAndVerifier.calledWith('logingov')).to.be.true;
  });
});
