import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import sinon from 'sinon';
import { handleTokenRequest } from '../helpers';

import AuthApp from '../containers/AuthApp';

describe('AuthApp', () => {
  const server = setupServer();
  const mockStore = {
    dispatch: sinon.spy(),
    subscribe: sinon.spy(),
    getState: () => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        mhv_interstitial_enabled: false,
      },
    }),
  };

  before(() => {
    server.listen();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    server.resetHandlers();
  });

  after(() => {
    server.close();
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
      rest.get('https://dev-api.va.gov/v0/user', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'logingov' },
                },
              },
            },
          }),
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
      rest.get('https://dev-api.va.gov/v0/user', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            errors: [{ code: '001' }],
          }),
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
      rest.get('https://dev-api.va.gov/v0/user', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'logingov' },
                },
              },
            },
          }),
        );
      }),
      rest.get('https://dev-api.va.gov/v0/sign_in/token', (req, res, ctx) => {
        return res(ctx.status(200));
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
      rest.get('https://dev-api.va.gov/v0/user', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ errors: [{ code: '001' }] }));
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
      rest.get('https://dev-api.va.gov/v0/user', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ errors: [{ code: '001' }] }));
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
      rest.get('https://dev-api.va.gov/v0/user', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'logingov' },
                },
              },
            },
          }),
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
        rest.get('https://dev-api.va.gov/v0/user', (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              data: {
                attributes: {
                  profile: {
                    signIn: { serviceName: 'idme', ssoe: true },
                  },
                },
              },
            }),
          );
        }),
        rest.put(
          'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json({ provisioned: true }));
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
          rest.get('https://dev-api.va.gov/v0/user', (_, res, ctx) => {
            return res(
              ctx.status(200),
              ctx.json({
                data: {
                  attributes: {
                    profile: {
                      signIn: { serviceName: 'idme', ssoe: true },
                    },
                  },
                },
              }),
            );
          }),
          rest.put(
            'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
            (_, res, ctx) => {
              return res(ctx.status(400), ctx.json({ error }));
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
        rest.get('https://dev-api.va.gov/v0/user', (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              data: {
                attributes: {
                  profile: {
                    signIn: { serviceName: 'idme', ssoe: true },
                  },
                },
              },
            }),
          ),
        ),
        rest.put(
          'https://dev-api.va.gov/v0/terms_of_use_agreements/update_provisioning',
          (_, res, ctx) => {
            return res(ctx.status(200), ctx.json({ provisioned: false }));
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

  it('should redirect to /sign-in-changes-reminder interstitial page', () => {
    const store = {
      dispatch: sinon.spy(),
      subscribe: sinon.spy(),
      getState: () => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_interstitial_enabled: true,
        },
      }),
    };
    sessionStorage.setItem('authReturnUrl', 'https://dev.va.gov/my-va');
    server.use(
      rest.get('https://dev-api.va.gov/v0/user', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            data: {
              attributes: {
                profile: {
                  signIn: { serviceName: 'mhv', ssoe: true },
                },
              },
            },
          }),
        ),
      ),
    );

    const { queryByTestId } = render(
      <Provider store={store}>
        <AuthApp location={{ query: { auth: 'success', type: 'mhv' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;
    sessionStorage.clear();
  });
});

describe('handleTokenRequest', () => {
  const server = setupServer();

  before(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    localStorage.clear();
  });

  after(() => server.close());

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
      rest.post('https://dev-api.va.gov/v0/sign_in/token?*', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json({ status: 'ok' }));
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
});
