import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import environments from 'site/constants/environments';
import { SERVICE_PROVIDERS, GA } from 'platform/user/authentication/constants';
import sinon from 'sinon';
import { removeLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import { mockCrypto } from 'platform/utilities/oauth/mockCrypto';
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

const csps = Object.values(SERVICE_PROVIDERS).filter(
  provider => provider.policy === 'idme' || provider.policy === 'logingov',
);

const setup = ({ path, mockGA = mockGADefaultArgs }) => {
  const startingLocation = path ? new URL(`${base}${path}`) : originalLocation;
  if (Window.prototype.href) {
    global.window.location.href = startingLocation;
  } else {
    global.window.location = startingLocation;
  }
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
      const { container } = render(<MockAuthButton />);
      const button = container.querySelector('.mauth-button');
      if (
        [environments.LOCALHOST, environments.VAGOVDEV].includes(
          currentEnvironment,
        )
      ) {
        const correctLink =
          '/v0/sign_in/authorize?type=logingov&client_id=vamock';
        setup({});
        if (button) {
          fireEvent.click(button);
          await waitFor(() => {
            const location =
              global.window.location.href || global.window.location;
            expect(location).to.include(correctLink);
          });
        }
        setup({});
      } else {
        expect(button).to.be.null;
      }
    });
  });

  csps.forEach(csp => {
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
    expect(container.querySelector('va-button')).to.exist;
  });

  it('does not, cannot show up on staging or production stacks', () => {
    [environments.VAGOVPROD, environments.VAGOVSTAGING].forEach(
      currentEnvironment => {
        __BUILDTYPE__ = currentEnvironment;
        const { container } = render(<MockAuthButton />);
        expect(container.querySelector('.mauth-button', container)).to.not
          .exist;
        const { container2 } = render(<MockAuth />);
        expect(container.querySelector('.mauth-button', container2)).to.not
          .exist;
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
    const button = container.querySelector('va-button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(select.getAttribute('error')).to.not.equal('');
    });
  });
});
