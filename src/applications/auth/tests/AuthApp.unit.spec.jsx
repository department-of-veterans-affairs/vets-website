import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import {
  createGetHandler,
  createPutHandler,
  createPostHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import { server } from 'platform/testing/unit/mocha-setup';
import { handleTokenRequest, emailNeedsConfirmation } from '../helpers';

import AuthApp from '../containers/AuthApp';

describe('AuthApp', () => {
  // Global server is managed by mocha-setup.js (listen/close)
  const mockStore = {
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({}),
  };

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should display an error page', () => {
    const tree = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { code: '001', auth: 'fail' } }} />
      </Provider>,
    );

    expect(tree.queryByText(/Code: 001/i)).to.not.be.null;
  });

  it('should display loading indicator after call to v0/user', async () => {
    sessionStorage.setItem('authReturnUrl', 'http://localhost:3001/my-va');
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'logingov' },
                },
              },
            },
          },
          { status: 200 },
        );
      }),
    );

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { auth: 'success', type: 'logingov' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;
  });

  it('should throw an error after a failed call to v0/user', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            errors: [{ code: '001' }],
          },
          { status: 400 },
        );
      }),
    );

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { auth: 'success', type: 'logingov' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;
  });

  it('should display loading indicator after call to token request', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'logingov' },
                },
              },
            },
          },
          { status: 200 },
        );
      }),
      createGetHandler('https://dev-api.va.gov/v0/sign_in/token', () => {
        return new Response(null, { status: 200 });
      }),
    );
    const state = 'some-random-state';
    localStorage.setItem('state', state);

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp
          location={{
            query: {
              auth: 'success',
              type: 'logingov',
              state,
            },
          }}
        />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;
  });

  it('should call force-needed', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse({ errors: [{ code: '001' }] }, { status: 200 });
      }),
    );

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp
          location={{ query: { auth: 'force-needed', type: 'logingov' } }}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(queryByTestId('loading')).to.not.be.null;
    });
  });

  it('should call skipToRedirect when no error and return URL is external', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse({ errors: [{ code: '001' }] }, { status: 400 });
      }),
    );
    sessionStorage.setItem(
      'authReturnUrl',
      'https://int.eauth.va.gov/ebenefits',
    );

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp
          location={{
            query: {
              auth: 'success',
              type: 'logingov',
            },
          }}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(queryByTestId('loading')).to.not.be.null;
    });
  });

  it('should call the handleTokenRequest', async () => {
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'logingov' },
                },
              },
            },
          },
          { status: 200 },
        );
      }),
    );
    localStorage.setItem('state', 'yes');

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp
          location={{
            query: {
              auth: 'success',
              type: 'logingov',
              state: 'yes',
              code: 'd9alse',
            },
          }}
        />
      </Provider>,
    );
    await waitFor(() => {
      expect(queryByTestId('loading')).to.not.be.null;
    });
  });

  context('TOU provisioning', () => {
    const mvhReturnUrl = 'https://staging-patientportal.myhealth.va.gov';

    it('should call when user is redirecting to My VA Health', () => {
      sessionStorage.setItem('authReturnUrl', mvhReturnUrl);
      server.use(
        createGetHandler('https://dev-api.va.gov/v0/user', () => {
          return jsonResponse(
            {
              data: {
                attributes: {
                  profile: {
                    signIn: { serviceName: 'idme', ssoe: true },
                  },
                },
              },
            },
            { status: 200 },
          );
        }),
        createPutHandler(
          'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
          () => {
            return jsonResponse({ provisioned: true }, { status: 200 });
          },
        ),
      );

      const { queryByTestId } = render(
        <Provider store={mockStore}>
          <AuthApp location={{ query: { auth: 'success', type: 'idme' } }} />
        </Provider>,
      );

      expect(queryByTestId('loading')).to.not.be.null;
    });

    [
      'Agreement not accepted',
      'Account not Provisioned',
      'Unknown error',
    ].forEach(error => {
      it(`should respond to TOU update_provisioning with ${error}`, () => {
        sessionStorage.setItem('authReturnUrl', mvhReturnUrl);
        server.use(
          createGetHandler('https://dev-api.va.gov/v0/user', () => {
            return jsonResponse(
              {
                data: {
                  attributes: {
                    profile: {
                      signIn: { serviceName: 'idme', ssoe: true },
                    },
                  },
                },
              },
              { status: 200 },
            );
          }),
          createPutHandler(
            'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
            () => {
              return jsonResponse({ error }, { status: 400 });
            },
          ),
        );

        const { queryByTestId } = render(
          <Provider store={mockStore}>
            <AuthApp location={{ query: { auth: 'success', type: 'idme' } }} />
          </Provider>,
        );

        expect(queryByTestId('loading')).to.not.be.null;
      });
    });

    it('should return to error page if user is not provisioned', () => {
      sessionStorage.setItem('authReturnUrl', mvhReturnUrl);
      server.use(
        createGetHandler('https://dev-api.va.gov/v0/user', () => {
          return jsonResponse(
            {
              data: {
                attributes: {
                  profile: {
                    signIn: { serviceName: 'idme', ssoe: true },
                  },
                },
              },
            },
            { status: 200 },
          );
        }),
        createPutHandler(
          'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
          () => {
            return jsonResponse({ provisioned: false }, { status: 200 });
          },
        ),
      );

      const { queryByTestId } = render(
        <Provider store={mockStore}>
          <AuthApp location={{ query: { auth: 'success', type: 'idme' } }} />
        </Provider>,
      );

      expect(queryByTestId('loading')).to.not.be.null;
      sessionStorage.clear();
    });
  });

  it('should redirect to /sign-in-confirm-contact-email interstitial page', async () => {
    const originalLocation = window.location;
    if (!Location.prototype.replace) {
      window.location = { replace: sinon.spy() };
    } else {
      window.location.replace = sinon.spy();
    }

    const store = {
      dispatch: sinon.spy(),
      subscribe: sinon.spy(),
      getState: () => ({
        featureToggles: {
          confirmContactEmailInterstitialEnabled: true,
        },
      }),
    };
    sessionStorage.setItem('authReturnUrl', 'https://dev.va.gov/my-va');
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'idme', ssoe: true },
                  verified: true,
                },
                vaProfile: {
                  vaPatient: true,
                  facilities: [
                    {
                      facilityId: 'facility',
                      isCerner: true,
                    },
                  ],
                },
                vet360ContactInformation: {
                  email: {
                    confirmationDate: '2018-04-21T20:09:50Z',
                  },
                },
              },
            },
          },
          { status: 200 },
        );
      }),
    );

    render(
      <Provider store={store}>
        <AuthApp location={{ query: { auth: 'success', type: 'idme' } }} />
      </Provider>,
    );
    await waitFor(() => expect(window.location.replace.calledOnce).to.be.true);
    expect(window.location.replace.calledWith('/sign-in-confirm-contact-email'))
      .to.be.true;
    window.location = originalLocation;
    sessionStorage.clear();
  });

  it('should redirect to /sign-in-health-portal interstitial page', async () => {
    const originalLocation = window.location;
    if (!Location.prototype.replace) {
      window.location = { replace: sinon.spy() };
    } else {
      window.location.replace = sinon.spy();
    }

    const store = {
      dispatch: sinon.spy(),
      subscribe: sinon.spy(),
      getState: () => ({
        featureToggles: {
          portalNoticeInterstitialEnabled: true,
        },
      }),
    };
    sessionStorage.setItem(
      'authReturnUrl',
      'https://staging-patientportal.myhealth.va.gov',
    );
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'idme', ssoe: true },
                  verified: true,
                },
                vaProfile: {
                  vaPatient: true,
                  facilities: [
                    {
                      facilityId: '757',
                      isCerner: true,
                    },
                  ],
                },
              },
            },
          },
          { status: 200 },
        );
      }),
      createPutHandler(
        'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
        () => {
          return jsonResponse({
            provisioned: true,
          });
        },
      ),
    );

    render(
      <Provider store={store}>
        <AuthApp location={{ query: { auth: 'success', type: 'idme' } }} />
      </Provider>,
    );
    await waitFor(() => expect(window.location.replace.calledOnce).to.be.true);
    expect(window.location.replace.calledWith('/sign-in-health-portal')).to.be
      .true;
    window.location = originalLocation;
    sessionStorage.clear();
  });

  it('should redirect to /my-health', async () => {
    const originalLocation = window.location;
    if (!Location.prototype.replace) {
      window.location = { replace: sinon.spy() };
    } else {
      window.location.replace = sinon.spy();
    }

    const store = {
      dispatch: sinon.spy(),
      subscribe: sinon.spy(),
      getState: () => ({
        featureToggles: {
          portalNoticeInterstitialEnabled: true,
        },
      }),
    };
    sessionStorage.setItem(
      'authReturnUrl',
      'https://staging-patientportal.myhealth.va.gov',
    );
    server.use(
      createGetHandler('https://dev-api.va.gov/v0/user', () => {
        return jsonResponse(
          {
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'idme', ssoe: true },
                  verified: true,
                },
                vaProfile: {
                  vaPatient: true,
                  facilities: [
                    {
                      facilityId: '100',
                      isCerner: true,
                    },
                  ],
                },
              },
            },
          },
          { status: 200 },
        );
      }),
      createPutHandler(
        'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
        () => {
          return jsonResponse({
            provisioned: true,
          });
        },
      ),
    );

    render(
      <Provider store={store}>
        <AuthApp location={{ query: { auth: 'success', type: 'idme' } }} />
      </Provider>,
    );
    await waitFor(() => expect(window.location.replace.calledOnce).to.be.true);
    expect(window.location.replace.calledWith('/my-health')).to.be.true;
    window.location = originalLocation;
    sessionStorage.clear();
  });
});

describe('handleTokenRequest', () => {
  // Global server is managed by mocha-setup.js (listen/close)

  afterEach(() => {
    localStorage.clear();
  });

  it('should call generateOAuthError when no `state` localStorage', async () => {
    const handleTokenSpy = sinon.spy();
    await handleTokenRequest({
      code: 'hello',
      state: 'hhh',
      generateOAuthError: handleTokenSpy,
    });
    expect(handleTokenSpy.called).to.be.true;
  });

  it('should call generateOAuthError when `state` mismatch in localStorage', async () => {
    const handleTokenSpy = sinon.spy();
    localStorage.setItem('state', 'hhh');
    localStorage.setItem('code_verifier', 'anything');

    await handleTokenRequest({
      code: 'hello',
      state: 'hhh333',
      generateOAuthError: handleTokenSpy,
      csp: 'logingov',
    });
    expect(handleTokenSpy.called).to.be.true;
  });

  it('should NOT call generateOAuthError when `requestToken` succeeds', async () => {
    server.use(
      createPostHandler('https://dev-api.va.gov/v0/sign_in/token?*', () => {
        return jsonResponse({ status: 'ok' }, { status: 200 });
      }),
    );
    const handleTokenSpy = sinon.spy();
    localStorage.setItem('state', 'hhh');
    localStorage.setItem('code_verifier', 'anything');

    await handleTokenRequest({
      code: 'hello',
      state: 'hhh',
      generateOAuthError: handleTokenSpy,
      csp: 'logingov',
    });
    expect(handleTokenSpy.called).to.be.false;
  });

  it('should NOT call generateOAuthError when `requestToken` fails', async () => {
    server.use(
      createPostHandler('https://dev-api.va.gov/v0/sign_in/token?*', () => {
        return jsonResponse({ errors: [{ code: '100' }] }, { status: 401 });
      }),
    );
    const handleTokenSpy = sinon.spy();
    localStorage.setItem('state', 'hhh');
    localStorage.setItem('code_verifier', 'anything');

    await handleTokenRequest({
      code: 'hello',
      state: 'hhh',
      generateOAuthError: handleTokenSpy,
      csp: 'logingov',
    });
    expect(handleTokenSpy.called).to.be.true;
  });
});

describe('emailNeedsConfirmation', () => {
  it('should return false when conditions are met', () => {
    expect(
      emailNeedsConfirmation({
        isEmailInterstitialEnabled: false,
        userAttributes: {
          profile: { verified: true },
          vaProfile: { vaPatient: true },
        },
      }),
    ).to.be.false;
    expect(
      emailNeedsConfirmation({
        isEmailInterstitialEnabled: true,
        userAttributes: { profile: {} },
      }),
    ).to.be.false;
    expect(
      emailNeedsConfirmation({
        isEmailInterstitialEnabled: true,
        userAttributes: { profile: {} },
      }),
    ).to.be.false;
  });
});
