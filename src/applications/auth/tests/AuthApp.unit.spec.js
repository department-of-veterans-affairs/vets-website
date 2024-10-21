import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import sinon from 'sinon';
import * as apiModule from 'platform/utilities/api';
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

  it('should not call terms of use provisioning if a user is not authenticating with ssoe', async () => {
    sessionStorage.setItem(
      'authReturnUrl',
      'https://staging-patientportal.myhealth.va.gov',
    );
    const apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    apiRequestStub.resolves({
      data: {
        attributes: {
          profile: {
            signIn: { serviceName: 'logingov', ssoe: false },
          },
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { auth: 'success', type: 'logingov' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;

    await waitFor(() => {
      expect(apiRequestStub.calledWith('/user')).to.be.true;
    });

    expect(
      apiRequestStub.calledWith('/terms_of_use_agreements/update_provisioning'),
    ).to.be.false;

    apiRequestStub.restore();
  });

  it('should not call terms of use provisioning if a user is not redirecting to MyVAHealth', async () => {
    sessionStorage.setItem(
      'authReturnUrl',
      'https://int.eauth.va.gov/ebenefits',
    );
    const apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    apiRequestStub.resolves({
      data: {
        attributes: {
          profile: {
            signIn: { serviceName: 'logingov', ssoe: true },
          },
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { auth: 'success', type: 'logingov' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;

    await waitFor(() => {
      expect(apiRequestStub.calledWith('/user')).to.be.true;
    });

    expect(
      apiRequestStub.calledWith('/terms_of_use_agreements/update_provisioning'),
    ).to.be.false;

    apiRequestStub.restore();
  });

  it('should call terms of use provisioning if a user authenticates with ssoe and is redirecting to MyVAHealth', async () => {
    sessionStorage.setItem(
      'authReturnUrl',
      'https://staging-patientportal.myhealth.va.gov',
    );
    const apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    apiRequestStub.resolves({
      data: {
        attributes: {
          profile: {
            signIn: { serviceName: 'logingov', ssoe: true },
          },
        },
      },
    });

    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { auth: 'success', type: 'logingov' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;

    await waitFor(() => {
      expect(apiRequestStub.calledWith('/user')).to.be.true;
    });

    expect(
      apiRequestStub.calledWith('/terms_of_use_agreements/update_provisioning'),
    ).to.be.true;

    apiRequestStub.restore();
  });

  it('should not display an error page if a user authenticates with ssoe and is redirecting to MyVAHealth', async () => {
    sessionStorage.setItem(
      'authReturnUrl',
      'https://staging-patientportal.myhealth.va.gov',
    );
    const apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    apiRequestStub.resolves({
      data: {
        attributes: {
          profile: {
            signIn: { serviceName: 'logingov', ssoe: true },
          },
        },
      },
    });

    const { queryByTestId, queryByText } = render(
      <Provider store={mockStore}>
        <AuthApp location={{ query: { auth: 'success', type: 'logingov' } }} />
      </Provider>,
    );

    expect(queryByTestId('loading')).to.not.be.null;

    await waitFor(() => {
      expect(apiRequestStub.calledWith('/user')).to.be.true;
      apiRequestStub.resolves({ provisioned: true });
    });

    await waitFor(() => {
      expect(
        apiRequestStub.calledWith(
          '/terms_of_use_agreements/update_provisioning',
        ),
      ).to.be.true;
    });

    expect(queryByText(/Code:/i)).to.be.null;

    apiRequestStub.restore();
  });

  describe('handleTokenRequest', () => {
    it('Should call generateOAuthError', async () => {
      const handleTokenSpy = sinon.spy();
      await handleTokenRequest({
        code: 'hello',
        state: 'hhh',
        generateOAuthError: handleTokenSpy,
      });
      expect(handleTokenSpy.called).to.be.true;
    });
    it('Should call generateOAuthError', async () => {
      const handleTokenSpy = sinon.spy();
      server.use(
        rest.post(
          'https://dev-api.va.gov/v0/sign_in/token',
          (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({ errors: 'Code is not valid' }),
            );
          },
        ),
      );
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
});
