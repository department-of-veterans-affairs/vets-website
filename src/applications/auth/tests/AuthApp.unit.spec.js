import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
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
    getState: () => {},
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

    expect(queryByTestId('loading')).to.not.be.null;
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

    expect(queryByTestId('loading')).to.not.be.null;
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

    expect(queryByTestId('loading')).to.not.be.null;
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
