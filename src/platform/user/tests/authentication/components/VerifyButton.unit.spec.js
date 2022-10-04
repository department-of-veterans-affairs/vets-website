import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';

import * as OAuthUtils from 'platform/utilities/oauth/utilities';
import * as AuthUtils from 'platform/user/authentication/utilities';
import {
  VerifyButton,
  verifyHandler,
} from 'platform/user/authentication/components/VerifyButton.jsx';

const { logingov, idme } = SERVICE_PROVIDERS;

describe('Verify Button', () => {
  [logingov, idme].forEach(csp => {
    const { label, policy, className } = csp;

    it(`should render correctly for ${policy}`, () => {
      const screen = render(<VerifyButton {...csp} key={policy} />);

      const verifyButton = screen.getByRole('button', {
        name: `Verify with ${label}`,
      });
      expect(verifyButton).to.have.class(`${className}`);
      expect(screen.queryByRole('button')).to.have.attr(
        'aria-label',
        `Verify with ${label}`,
      );
    });

    it(`should call the 'verifyHandler' ${label} function on click`, () => {
      const verifyHandlerSpy = sinon.spy(verifyHandler);
      const wrapper = render(
        <VerifyButton {...csp} onClick={verifyHandlerSpy} />,
      );

      fireEvent.click(
        wrapper.getByRole('button', { name: `Verify with ${label}` }),
      );
      expect(verifyHandlerSpy.called).to.be.true;
      verifyHandlerSpy.reset();
      wrapper.unmount();
    });
  });
});

describe('verifyHandler', () => {
  const mockOAuthUpdateStateAndVerifier = sinon.spy(
    OAuthUtils,
    'updateStateAndVerifier',
  );
  const mockAuthVerify = sinon.stub(AuthUtils, 'verify');
  const verifyHandlerSpy = sinon.spy(verifyHandler);

  beforeEach(() => {
    mockOAuthUpdateStateAndVerifier.reset();
    mockAuthVerify.reset();
    verifyHandlerSpy.reset();
    localStorage.clear();
  });

  it('should not call updateStateAndVerifier if useOAuth is false', () => {
    verifyHandlerSpy({ useOAuth: false, policy: 'logingov' });
    expect(verifyHandlerSpy.called).to.be.true;
    expect(mockOAuthUpdateStateAndVerifier.called).to.be.false;
  });

  it('should call updateStateAndVerifier if useOAuth is present', () => {
    verifyHandlerSpy({ useOAuth: true, policy: 'logingov' });
    expect(verifyHandlerSpy.called).to.be.true;
    expect(mockOAuthUpdateStateAndVerifier.called).to.be.true;
    expect(mockOAuthUpdateStateAndVerifier.calledWith('logingov')).to.be.true;
  });

  it('should call verify when verifyHandler is called', () => {
    verifyHandlerSpy({
      policy: 'logingov',
      useOAuth: true,
    });

    expect(verifyHandlerSpy.called).to.be.true;
    expect(mockAuthVerify.called).to.be.true;
    expect(
      mockAuthVerify.calledWith({
        policy: 'logingov',
        useOAuth: true,
        acr: defaultWebOAuthOptions.acrVerify.logingov,
      }),
    ).to.be.true;
  });
});
