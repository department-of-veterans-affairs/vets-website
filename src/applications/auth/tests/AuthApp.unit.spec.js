import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import sinon from 'sinon';

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
        <AuthApp location={{ query: { code: '001' } }} />
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

  // it('should fire validateSession if `hasSession` is true', () => {
  //   const { wrapper, instance } = generateAuthApp({
  //     hasSession: true,
  //     query: { auth: 'not-fail' },
  //   });
  //   const spy = sinon.spy(instance, 'validateSession');
  //   instance.componentDidMount();
  //   expect(spy.called).to.be.true;
  //   wrapper.unmount();
  // });

  // it('should fire validateSession if `hasError` is false', () => {
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { auth: 'not-fail' },
  //   });
  //   const spy = sinon.spy(instance, 'validateSession');
  //   instance.componentDidMount();
  //   expect(spy.called).to.be.true;
  //   wrapper.unmount();
  // });

  // it('should not fire validateSession if `hasError` is true or `hasSession` is false', () => {
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { auth: 'fail', hasSession: false },
  //   });
  //   const spy = sinon.spy(instance, 'validateSession');
  //   instance.componentDidMount();

  //   expect(spy.called).to.be.false;
  //   wrapper.unmount();
  // });

  // it('should fire handleAuthForceNeeded', () => {
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { auth: 'force-needed' },
  //     hasSession: true,
  //   });
  //   const spy = sinon.spy(instance, 'handleAuthForceNeeded');
  //   instance.componentDidMount();

  //   expect(spy.called).to.be.true;
  //   wrapper.unmount();
  // });

  // it('should fire handleAuthSuccess', () => {
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme' },
  //     hasSession: true,
  //   });
  //   const spy = sinon.spy(instance, 'handleAuthSuccess');
  //   instance.handleAuthSuccess();

  //   expect(spy.called).to.be.true;
  //   wrapper.unmount();
  // });

  // it('should fire handleAuthError', () => {
  //   const error = {
  //     error: {
  //       message: 'Can not auth',
  //     },
  //   };
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme', code: '101' },
  //     hasSession: true,
  //   });
  //   const spy = sinon.spy(instance, 'handleAuthError');
  //   instance.handleAuthError(error);

  //   expect(spy.called).to.be.true;
  //   expect(wrapper.state()).to.include({
  //     errorCode: '101',
  //     hasError: true,
  //     loginType: 'idme',
  //   });
  //   wrapper.unmount();
  // });

  // it('should fire handleTokenRequest', async () => {
  //   const code = '9f9f13';
  //   const state = 'state_success';
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { auth: 'success', state, code },
  //     hasSession: true,
  //     oAuthOpts: { codeVerifier: 'cv_success', state },
  //   });

  //   const spy = sinon.spy(instance, 'handleTokenRequest');
  //   await instance.handleTokenRequest({ code, state });

  //   expect(spy.called).to.be.true;
  //   wrapper.unmount();
  // });
  // it('should fire generateOAuthError when state mismatch', async () => {
  //   const code = '9f9f13';
  //   const state = 'mismatch';
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { auth: 'success', code, state },
  //     hasSession: true,
  //     oAuthOpts: { codeVerifier: 'cv_success', state: 'other_state' },
  //   });

  //   const spy = sinon.spy(instance, 'generateOAuthError');
  //   await instance.handleTokenRequest({ code });

  //   expect(spy.called).to.be.true;
  //   expect(wrapper.state()).to.include({
  //     errorCode: '202',
  //     auth: 'fail',
  //     hasError: true,
  //   });
  //   wrapper.unmount();
  // });

  // it('should fire redirect & send user to non-homepage route', () => {
  //   global.window = { location: { replace: sinon.spy() } };
  //   const returnUrl = 'http://localhost/education/eligibility';
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme' },
  //     hasSession: true,
  //     returnUrl,
  //   });
  //   const redirectSpy = sinon.spy(instance, 'redirect');
  //   const checkReturnUrlSpy = sinon.spy(instance, 'checkReturnUrl');
  //   instance.redirect();
  //   instance.checkReturnUrl(returnUrl);

  //   expect(redirectSpy.called).to.be.true;
  //   expect(checkReturnUrlSpy.calledWith(returnUrl)).to.be.true;
  //   expect(global.window.location.replace.calledWith(returnUrl));
  //   global.window = oldWindow;
  //   wrapper.unmount();
  // });

  // it('should fire redirect & send user to /my-va/ route', () => {
  //   global.window = { location: { replace: sinon.spy() } };
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme' },
  //     hasSession: true,
  //     returnUrl: 'http://localhost/',
  //   });
  //   const spy = sinon.spy(instance, 'redirect');
  //   instance.redirect();

  //   expect(spy.called).to.be.true;
  //   expect(
  //     global.window.location.replace.calledWith('http://localhost/my-va/'),
  //   );
  //   global.window = oldWindow;
  //   wrapper.unmount();
  // });

  // it('should fire the redirect for eauth', () => {
  //   global.window = { location: { replace: sinon.spy() } };
  //   const returnUrl =
  //     'https://pint.eauth.va.gov/MAP/users/v2/landing?application=vaoccmobile&redirect_uri=%2Fmyvaimages-beta%2F';
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme' },
  //     hasSession: true,
  //     returnUrl,
  //   });
  //   const checkReturnUrlSpy = sinon.spy(instance, 'checkReturnUrl');
  //   instance.checkReturnUrl(returnUrl);

  //   expect(checkReturnUrlSpy.called).to.be.true;
  //   expect(checkReturnUrlSpy.calledWith(true));
  //   global.window = oldWindow;
  //   wrapper.unmount();
  // });

  // it('should call `validateSession` if user has a session', () => {
  //   global.window = { location: { replace: sinon.spy() } };
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme' },
  //     hasSession: true,
  //   });

  //   sinon.stub(instance, 'hasSession').returns(true);

  //   const validateSessionStub = sinon.stub(instance, 'validateSession');
  //   wrapper.setState({ hasError: false });
  //   instance.componentDidMount();

  //   expect(validateSessionStub.calledOnce).to.be.true;

  //   validateSessionStub.restore();
  //   global.window = oldWindow;
  //   wrapper.unmount();
  // });

  // it('should call send a non-verified Cerner user to `/verify`', () => {
  //   global.window = { location: { replace: sinon.spy() } };
  //   const returnUrl = `https://staging-patientportal.myhealth.va.gov`;
  //   const { wrapper, instance } = generateAuthApp({
  //     query: { type: 'idme' },
  //     hasSession: true,
  //     returnUrl,
  //   });

  //   const cernerSpy = sinon.spy(instance, 'redirect');
  //   instance.redirect();

  //   expect(cernerSpy.called).to.be.true;
  //   expect(global.window.location.replace.calledWith('/verify')).to.be.false;
  //   global.window = oldWindow;
  //   wrapper.unmount();
  // });
});
