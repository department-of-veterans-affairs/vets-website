import React from 'react';
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
} from 'react-router-dom-v5-compat';
import { expect } from 'chai';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';

// import { routes } from '../../router';
import { Avs } from '../../containers/Avs.tsx';
import ErrorBoundary from '../../components/ErrorBoundary.tsx';

import mockAvs from '../fixtures/9A7AF40B2BC2471EA116891839113252.json';
import avsLoader from '../../loaders/avsLoader.ts';

const id = '9A7AF40B2BC2471EA116891839113252';

// Temporarily tested with cypress.
// These tests can be re-instated once the node upgrade is complete.
describe.skip('Avs container', () => {
  let oldLocation;
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    oldLocation = global.window.location;
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

  const props = { id };

  it('user is not logged in', async () => {
    // expected behavior is be redirected to the home page with next in the url
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

    expect(window.location.replace.called).to.be.true;
    expect(window.location.replace.firstCall.args[0]).to.eq('/');
  });

  it('feature flags are still loading', () => {
    // Temporarily tested with cypress.
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
    const screen = renderInReduxProvider(<RouterProvider router={router} />, {
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
    });
    expect(screen.getByTestId('avs-loading-indicator'));
  });

  it('feature flag set to false', () => {
    renderInReduxProvider(
      <MemoryRouter initialEntries={[`/${id}`]}>
        <Route path="/:id">
          <Avs {...props} />
        </Route>
      </MemoryRouter>,
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
    // Temporarily tested with cypress.
    mockApiRequest({}, false);
    const router = createMemoryRouter(
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
    const screen = renderInReduxProvider(<RouterProvider router={router} />, {
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
    });
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your after-visit summary right now'),
      );
    });
  });

  it('Happy path', async () => {
    // Temporarily tested with cypress.
    mockApiRequest({}, false);
    const router = createMemoryRouter(
      [
        {
          path: '/:id',
          element: <Avs {...props} />,
          // loader: () => Promise.resolve(mockAvs),
        },
      ],
      { initialEntries: ['/9A7AF40B2BC2471EA116891839113252'] },
    );
    const screen = renderInReduxProvider(<RouterProvider router={router} />, {
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
    });
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your after-visit summary right now'),
      );
    });
  });
});
