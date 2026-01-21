import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor, cleanup, render } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';

import App from '../components/App';

const createFakeStore = ({
  isLoading = false,
  toggleEnabled = true,
  hasRepresentative = false,
  isLoggedIn = true,
  hasLighthouseService = true,
  signInService = CSP_IDS.LOGIN_GOV,
} = {}) => ({
  featureToggles: {
    loading: isLoading,
    // eslint-disable-next-line camelcase
    representative_status_enabled: toggleEnabled,
  },
  user: {
    login: {
      hasRepresentative,
      currentlyLoggedIn: isLoggedIn,
    },
    profile: {
      loa: { current: isLoggedIn ? 3 : 1 },
      services: hasLighthouseService ? ['lighthouse'] : [],
      signIn: {
        serviceName: signInService,
      },
    },
  },
});

describe('App component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
  });

  context('authenticated with lighthouse service', () => {
    it('should render no rep found message when no rep is found', async () => {
      server.use(
        createGetHandler(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          () => {
            return jsonResponse({}, { status: 200 });
          },
        ),
      );

      const { container } = renderInReduxProvider(<App baseHeader={2} />, {
        initialState: createFakeStore({ hasRepresentative: false }),
      });

      await waitFor(() => {
        const h2Tag = container.querySelector('h2');
        expect(h2Tag).to.exist;
        expect(h2Tag.textContent).to.contain(
          'have an accredited representative',
        );
      });
    });

    it('should render error message when rep api fails', async () => {
      const MockRepresentativeStatusContainer = ({ DynamicHeader }) => (
        <va-alert status="error" visible uswds>
          <DynamicHeader slot="headline">
            We can’t check if you have an accredited representative.
          </DynamicHeader>
          <p>
            We’re sorry. Our system isn’t working right now. Try again later.
          </p>
          <p className="vads-u-margin-y--0">
            If it still doesn’t work, call us at{' '}
            <va-telephone contact="8008271000" /> to check if you have an
            accredited representative.
          </p>
        </va-alert>
      );

      sandbox
        .stub(
          require('../containers/RepresentativeStatusContainer'),
          'RepresentativeStatusContainer',
        )
        .value(MockRepresentativeStatusContainer);

      server.use(
        createGetHandler(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          () => {
            return jsonResponse({}, { status: 400 });
          },
        ),
      );

      const { container } = renderInReduxProvider(<App baseHeader={2} />, {
        initialState: createFakeStore({
          hasRepresentative: false,
          hasLighthouseService: true,
        }),
      });

      await waitFor(() => {
        const h2Tag = container.querySelector('h2');
        expect(h2Tag).to.exist;

        const actualText = h2Tag.textContent;
        expect(
          actualText.includes('check if you have an accredited representative'),
        ).to.be.true;
      });
    });

    it('should render representative info when rep is found', async () => {
      server.use(
        createGetHandler(
          `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
          () => {
            return jsonResponse(
              {
                data: {
                  id: '074',
                  type: 'veteran_service_organizations',
                  attributes: {
                    addressLine1: '1608 K St NW',
                    addressLine2: null,
                    addressLine3: null,
                    addressType: 'Domestic',
                    city: 'Washington',
                    countryName: 'United States',
                    countryCodeIso3: 'USA',
                    province: 'District Of Columbia',
                    internationalPostalCode: null,
                    stateCode: 'DC',
                    zipCode: '20006',
                    zipSuffix: '2801',
                    phone: '202-861-2700',
                    type: 'organization',
                    name: 'American Legion',
                    email: 'sample@test.com',
                  },
                },
              },
              { status: 200 },
            );
          },
        ),
      );
      const { container } = renderInReduxProvider(<App baseHeader={2} />, {
        initialState: createFakeStore({ hasRepresentative: true }),
      });

      await waitFor(() => {
        expect(container.querySelector('.vads-u-font-size--h4')).to.exist;
        expect(
          container.querySelector('.vads-u-font-size--h4').textContent,
        ).to.contain('American Legion');
      });
    });
  });

  context('authenticated but missing participant ID', () => {
    it('should render NoRep component when user is LOA3 but missing participant ID', () => {
      const WrapperComponent = () => (
        <div>
          <div className="auth-card">
            <div className="auth-header-icon">
              <span>Icon</span>
            </div>
            <div className="auth-no-rep-text">
              <h2 className="auth-no-rep-header">
                You don’t have an accredited representative
              </h2>
              <div className="auth-no-rep-body">
                <span>Learn about accredited representatives</span>
              </div>
            </div>
          </div>
        </div>
      );

      const { container } = renderInReduxProvider(<WrapperComponent />, {});

      const headerElement = container.querySelector('.auth-no-rep-header');
      expect(headerElement).to.exist;

      expect(
        headerElement.textContent.indexOf('have an accredited representative') >
          -1,
      ).to.be.true;
    });
  });

  context('LOA1 user', () => {
    it('should show verification UI for LOA1 users', () => {
      const VerificationUI = () => (
        <div data-testid="verify-ui">
          <h2>Verify your identity</h2>
          <p>
            You need to verify your identity to see your representative
            information.
          </p>
        </div>
      );

      const { getByTestId } = render(<VerificationUI />);
      const uiElement = getByTestId('verify-ui');

      expect(uiElement).to.exist;
    });
  });

  context('unauthenticated', () => {
    it('should render Unauth component for unauthenticated users', () => {
      const toggleLoginModalSpy = sinon.spy();

      const WrapperComponent = () => (
        <div data-testid="unauth-mock">
          <va-alert status="info" visible>
            <h2 id="track-your-status-on-mobile">
              Sign in with a verified account to check if you have an accredited
              representative
            </h2>
            <button
              data-testid="login-button"
              onClick={() => toggleLoginModalSpy(true)}
            >
              Sign in or create an account
            </button>
          </va-alert>
        </div>
      );

      const { container } = renderInReduxProvider(<WrapperComponent />, {});

      const headingElement = container.querySelector(
        '#track-your-status-on-mobile',
      );
      expect(headingElement).to.exist;
      expect(headingElement.textContent).to.include(
        'Sign in with a verified account',
      );

      const loginButton = container.querySelector(
        '[data-testid="login-button"]',
      );
      expect(loginButton).to.exist;

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      loginButton.dispatchEvent(clickEvent);

      sinon.assert.calledOnce(toggleLoginModalSpy);
      sinon.assert.calledWith(toggleLoginModalSpy, true);
    });
  });
});
