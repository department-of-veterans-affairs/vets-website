import React from 'react';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import environments from 'site/constants/environments';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
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
      const button = $('.mauth-button', container);
      if (
        currentEnvironment === environments.LOCALHOST ||
        currentEnvironment === environments.VAGOVDEV
      ) {
        const correctLink = `${
          ENVIRONMENT_CONFIGURATIONS[process.env.BUILDTYPE].API_URL
        }/v0/sign_in/authorize?client_id=vamock`;
        fireEvent.click(button);
        expect(window.location).to.equal(correctLink);
      } else {
        expect(button).to.not.exist;
      }
    });
  });

  csps.forEach(csp => {
    it(`should be a different color than any other csp button`, () => {
      process.env.BUILDTYPE = environments.LOCALHOST;
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
    process.env.BUILDTYPE = environments.LOCALHOST;
    const { container } = render(<MockAuth />);
    expect($('.mauth-button', container)).to.exist;
  });

  it('does not, cannot show up on staging or production stacks', () => {
    [environments.VAGOVPROD, environments.VAGOVSTAGING].forEach(
      currentEnvironment => {
        process.env.BUILDTYPE = currentEnvironment;
        const { container } = render(<MockAuthButton />);
        expect($('.mauth-button', container)).to.not.exist;
        const { container2 } = render(<MockAuth />);
        expect($('.mauth-button', container2)).to.not.exist;
      },
    );
  });
});
