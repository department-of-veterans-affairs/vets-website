import React from 'react';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import 'whatwg-fetch';
import { createMemoryRouter, RouterProvider } from 'react-router-dom-v5-compat';
import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { render, waitFor } from '@testing-library/react';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';

import { routes } from '../../router';
import { Avs } from '../../containers/Avs';
import ErrorBoundary from '../../components/ErrorBoundary';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';
import avsLoader from '../../loaders/avsLoader';

const id = '9A7AF40B2BC2471EA116891839113252';
const avsPath = `/my-health/medical-records/summaries-and-notes/visit-summary/${id}`;

describe('Avs container', () => {
  let oldLocation;
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      pathname: '/',
      href: {
        value: 'foo',
      },
      origin: 'http://localhost',
      replace: sandbox.stub().callsFake(path => {
        window.location.pathname += path;
        window.location.search = path.slice(path.indexOf('?'));
      }),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
    sandbox.restore();
  });
  const initialState = {
    featureToggles: {
      // eslint-disable-next-line camelcase
      avs_enabled: false,
      loading: false,
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
    },
  };

  const commonReducer = {};
  const reducers = {};

  const testStore = createStore(
    combineReducers({ ...commonReducer, ...reducers }),
    initialState,
    applyMiddleware(thunk),
  );

  const props = { id };

  it('user is not logged in', async () => {
    // expected behavior is be redirected to the home page with next in the url

    /*
    const wrapper = ({ children }) => (
      <Provider store={testStore}>{children}</Provider>
    );

    render(<Avs {...props} />, { wrapper });
    */

    // window.history.pushState({}, 'Avs', '/foo/123');

    const router = createMemoryRouter(
      [
        {
          path: '/:id',
          element: <Avs {...props} />,
          loader: avsLoader,
        },
      ],
      { initialEntries: ['/123'] },
    );

    renderInReduxProvider(<RouterProvider router={router} />, {
      initialState,
    });

    /*
    render(
      <RouterProvider router={router}>
        <Provider store={testStore}>
          <Routes>
            <Route
              path="/my-health/medical-records/summaries-and-notes/visit-summary/:id"
              element={<Avs {...props} />}
            />
          </Routes>
        </Provider>
        ,
      </RouterProvider>,
    );
    */

    expect(window.location.replace.called).to.be.true;
    expect(window.location.replace.firstCall.args[0]).to.eq('/');
  });

  it('feature flags are still loading', () => {
    const screen = renderInReduxProvider(
      <reactRouter.BrowserRouter initialEntries={[`/${id}`]}>
        <reactRouter.Routes>
          <reactRouter.Route path="/:id" element={<Avs {...props} />} />
        </reactRouter.Routes>
      </reactRouter.BrowserRouter>,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            loading: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
          },
        },
      },
    );
    expect(screen.getByTestId('avs-loading-indicator'));
  });

  it('feature flag set to false', () => {
    renderInReduxProvider(
      <reactRouter.MemoryRouter initialEntries={[`/${id}`]}>
        <reactRouter.Route path="/:id">
          <Avs {...props} />
        </reactRouter.Route>
      </reactRouter.MemoryRouter>,
      {
        initialState,
      },
    );
    expect(window.location.replace.called).to.be.true;
    expect(window.location.replace.firstCall.args[0]).to.eq('/');
  });

  it('feature flag set to true', async () => {
    mockApiRequest(mockAvs);
    const screen = renderInReduxProvider(
      <MemoryRouter initialEntries={[`/${id}`]}>
        <Route path="/:id">
          <Avs {...props} />
        </Route>
      </MemoryRouter>,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            // eslint-disable-next-line camelcase
            avs_enabled: true,
            loading: false,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              services: [backendServices.USER_PROFILE],
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(screen.getByText('After-visit summary'));
    });
  });

  it('User is redirected when visiting base path', async () => {
    renderInReduxProvider(
      <MemoryRouter initialEntries={['/']}>
        <Route path="/">
          <Avs {...props} />
        </Route>
      </MemoryRouter>,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            // eslint-disable-next-line camelcase
            avs_enabled: true,
            loading: false,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              services: [backendServices.USER_PROFILE],
            },
          },
        },
      },
    );

    expect(window.location.replace.called).to.be.true;
    expect(window.location.replace.firstCall.args[0]).to.eq(
      '/my-health/medical-records/summaries-and-notes/',
    );
  });

  it('API request fails', async () => {
    mockApiRequest({}, false);
    const router = reactRouter.createMemoryRouter(
      [
        {
          path: '/:id',
          element: (
            <ErrorBoundary>
              <Avs {...props} />
            </ErrorBoundary>
          ),
          // loader: loader cannot be used until node has been upgraded above v14.
        },
      ],
      { initialEntries: ['/9A7AF40B2BC2471EA116891839113252'] },
    );
    const screen = renderInReduxProvider(
      <reactRouter.RouterProvider router={router} />,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            // eslint-disable-next-line camelcase
            avs_enabled: true,
            loading: false,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              services: [backendServices.USER_PROFILE],
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your after-visit summary right now'),
      );
    });
  });

  it.only('Happy path', async () => {
    mockApiRequest({}, false);
    const router = reactRouter.createMemoryRouter(
      [
        {
          path: '/:id',
          element: <Avs {...props} />,
          // loader: () => Promise.resolve(mockAvs),
        },
      ],
      { initialEntries: ['/9A7AF40B2BC2471EA116891839113252'] },
    );
    const screen = renderInReduxProvider(
      <reactRouter.RouterProvider router={router} />,
      {
        initialState: {
          ...initialState,
          featureToggles: {
            // eslint-disable-next-line camelcase
            avs_enabled: true,
            loading: false,
          },
          avs: mockAvs,
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              services: [backendServices.USER_PROFILE],
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your after-visit summary right now'),
      );
    });
  });
});
