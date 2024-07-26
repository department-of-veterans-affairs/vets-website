import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import environments from 'site/constants/environments';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { SERVICE_PROVIDERS, GA } from 'platform/user/authentication/constants';
import LoginButton from 'platform/user/authentication/components/LoginButton';
import sinon from 'sinon';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
import SkinDeep from 'skin-deep';
import MockAuth from '../../containers/MockAuth';
import MockAuthButton from '../../components/MockAuthButton';

const originalLocation = global.window.location;
const originalGA = global.ga;

const base = 'https://dev.va.gov';
const mockGAClientId = '1234';

const mockGADefaultArgs = {
  mockGAActive: false,
  trackingId: GA.trackingIds[0],
  throwGAError: false,
};

const csps = Object.values(SERVICE_PROVIDERS);

const setup = ({ path, mockGA = mockGADefaultArgs }) => {
  global.window.location = path ? new URL(`${base}${path}`) : originalLocation;
  global.ga = originalGA;
  global.window.crypto = mockCrypto;
  removeLoginAttempted();

  const { mockGAActive, trackingId, throwGAError } = mockGA;
  if (mockGAActive) {
    global.ga = sinon.stub();
    global.ga.getAll = throwGAError
      ? sinon.stub().throws()
      : sinon.stub().returns([
          {
            get: key => {
              switch (key) {
                case GA.clientIdKey:
                  return mockGAClientId;
                case GA.trackingIdKey:
                  return trackingId;
                default:
                  return undefined;
              }
            },
          },
        ]);
  }
};

describe('MockAuthButton', () => {
  const oldWindow = global.window;
  const buildType = __BUILDTYPE__;
  beforeEach(() => {
    global.window = oldWindow;
    __BUILDTYPE__ = buildType;
  });
  afterEach(() => {
    global.window = oldWindow;
    __BUILDTYPE__ = buildType;
  });

  Object.values(environments).forEach(currentEnvironment => {
    it('should take you to the right link when clicked', async () => {
      __BUILDTYPE__ = currentEnvironment;
      const tree = SkinDeep.shallowRender(<MockAuthButton />);
      const button = tree.subTree('.mauth-button');
      if (
        [environments.LOCALHOST, environments.VAGOVDEV].includes(
          currentEnvironment,
        )
      ) {
        const correctLink =
          '/v0/sign_in/authorize?type=logingov&client_id=vamock';
        setup({});
        await button.props.onClick();
        expect(global.window.location).to.include(correctLink);
        setup({});
      } else {
        expect(button).to.be.false;
      }
    });
  });

  csps.forEach(csp => {
    it(`should be a different color than any other csp button`, () => {
      __BUILDTYPE__ = environments.LOCALHOST;
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

    it('should set authType when a different CSP is selected', () => {
      __BUILDTYPE__ = environments.LOCALHOST;
      const { container } = render(<MockAuthButton />);
      const select = container.querySelector('va-select');
      fireEvent(
        select,
        new CustomEvent('vaSelect', {
          detail: { value: csp },
        }),
      );
      expect(select.value).to.equal(csp);
    });
  });

  it('should be rendered on the mocked auth page', () => {
    __BUILDTYPE__ = environments.LOCALHOST;
    const { container } = render(<MockAuth />);
    expect($('.mauth-button', container)).to.exist;
  });

  it('does not, cannot show up on staging or production stacks', () => {
    [environments.VAGOVPROD, environments.VAGOVSTAGING].forEach(
      currentEnvironment => {
        __BUILDTYPE__ = currentEnvironment;
        const { container } = render(<MockAuthButton />);
        expect($('.mauth-button', container)).to.not.exist;
        const { container2 } = render(<MockAuth />);
        expect($('.mauth-button', container2)).to.not.exist;
      },
    );
  });

  it('should set mockLoginError when mockLogin throws an error', async () => {
    __BUILDTYPE__ = environments.LOCALHOST;
    const { container } = render(<MockAuthButton />);
    const select = container.querySelector('va-select');
    fireEvent(
      select,
      new CustomEvent('vaSelect', {
        detail: { value: null },
      }),
    );
    const button = container.querySelector('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(select.getAttribute('error')).to.not.equal('');
    });
  });
});
