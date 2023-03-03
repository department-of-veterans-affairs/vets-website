import React from 'react';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import environments from 'site/constants/environments';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import sinon from 'sinon';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import LoginButton from 'platform/user/authentication/components/LoginButton';
import MockAuth from '../../containers/MockAuth';
import MockAuthButton from '../../components/MockAuthButton';

const csps = Object.values(SERVICE_PROVIDERS);

describe('MockAuthButton', () => {
  const env = process.env.BUILDTYPE;
  const oldWindow = global.window;
  beforeEach(() => {
    process.env.BUILDTYPE = env;
    global.window = oldWindow;
  });
  afterEach(() => {
    process.env.BUILDTYPE = env;
    global.window = oldWindow;
  });

  Object.values(environments).forEach(currentEnvironment => {
    it('should take you to the right link when clicked', () => {
      process.env.BUILDTYPE = currentEnvironment;
      const { container } = render(<MockAuthButton />);
      const correctLink = `${
        ENVIRONMENT_CONFIGURATIONS[process.env.BUILDTYPE].API_URL
      }/v0/sign_in/authorize?client_id=vamock`;
      const mockLocation = { replace: sinon.spy() };
      Object.defineProperty(global.window, 'location', {
        value: mockLocation,
        writable: true,
      });
      fireEvent.click($('.mauth-button', container));
      expect(mockLocation.replace.calledOnce).to.be.true;
      expect(mockLocation.replace.calledWith(sinon.match(correctLink))).to.be
        .true;
    });
  });

  csps.forEach(csp => {
    it(`should be a different color than any other csp button`, () => {
      const { container } = render(
        <>
          <MockAuthButton />
          <LoginButton csp={csp.policy} />
        </>,
      );
      const mockAuthButton = $('.mauth-button', container);
      const loginButton = $(`[data-csp="${csp.policy}"]`, container);
      expect(mockAuthButton).to.not.have.style(
        'background-color',
        loginButton.style.backgroundColor,
      );
    });
  });

  it('should be rendered on the mocked auth page', () => {
    const { container } = render(<MockAuth />);
    expect($('.mauth-button', container)).to.exist;
  });
});
