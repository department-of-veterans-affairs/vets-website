import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { defaultWebOAuthOptions } from 'platform/user/authentication/config/constants';

import * as OAuthUtils from 'platform/utilities/oauth/utilities';
import * as AuthUtils from 'platform/user/authentication/utilities';
import { VerifyButton, verifyHandler } from '../../components/verifyButton';

const { logingov, idme } = SERVICE_PROVIDERS;

describe('Verify Button', () => {
  [logingov, idme].forEach(csp => {
    const { label, link, image, policy, className } = csp;

    it(`should render correctly for ${policy}`, () => {
      const screen = render(
        <VerifyButton
          key={policy}
          label={label}
          link={link}
          image={image}
          policy={policy}
          className={className}
        />,
      );

      const verifyButton = screen.getByRole('button', {
        name: `Verify with ${label}`,
      });
      expect(verifyButton).to.have.class(`${className}`);
      expect(screen.queryByRole('button')).to.have.attr(
        'aria-label',
        `Verify with ${label}`,
      );
    });

    it('should call the `verifyHandler` function on click', () => {
      const verifyHandlerSpy = sinon.spy();
      const wrapper = shallow(
        <VerifyButton
          key={policy}
          label={label}
          link={link}
          image={image}
          policy={policy}
          className={className}
          onClick={verifyHandlerSpy}
          useOAuth
        />,
      );

      wrapper.find('button').simulate('click');
      expect(verifyHandlerSpy.called).to.be.true;
      wrapper.unmount();
    });
  });
});

describe('verifyHandler', () => {
  const mockOAuthUpdateStateAndVerifier = sinon.stub(
    OAuthUtils,
    'updateStateAndVerifier',
  );
  const mockAuthVerify = sinon.stub(AuthUtils, 'verify');
  const verifyHandlerSpy = sinon.spy(verifyHandler);

  beforeEach(() => {
    mockOAuthUpdateStateAndVerifier.reset();
    mockAuthVerify.reset();
    verifyHandlerSpy.reset();
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
