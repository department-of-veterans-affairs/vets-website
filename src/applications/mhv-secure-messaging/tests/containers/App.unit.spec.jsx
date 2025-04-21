import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { pageNotFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import { waitFor } from '@testing-library/dom';
import App from '../../containers/App';
import reducer from '../../reducers';
import pilotRoutes from '../../pilot/routes';
import { PageTitles } from '../../util/constants';

describe('App', () => {
  let oldLocation;

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  const noDowntime = {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };

  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.MESSAGING],
        verified: true,
      },
    },
    sm: {
      breadcrumbs: {
        list: [],
      },
    },
  };
  const downtime = maintenanceWindows => {
    return createServiceMap(
      maintenanceWindows.map(maintenanceWindow => {
        return {
          attributes: {
            externalService: maintenanceWindow,
            status: 'down',
            startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
            endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          },
        };
      }),
    );
  };

  it('user is not logged in', () => {
    // expected behavior is be redirected to the home page with next in the url
    renderWithStoreAndRouter(<App />, {
      initialState: {
        ...initialState,
        user: {
          profile: {
            loading: false,
          },
          login: {
            currentlyLoggedIn: false,
          },
        },
      },
      path: `/`,
      reducers: reducer,
    });
    waitFor(() => expect(window.location.replace.called).to.be.true);
  });

  it('feature flags are still loading', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          loading: true,
        },
        ...initialState,
      },
      path: `/`,
      reducers: reducer,
    });
    expect(screen.getByTestId('feature-flag-loading-indicator'));
  });

  it.skip('renders the global downtime notification', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: true,
          isReady: true,
          isPending: false,
          serviceMap: downtime([]),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      reducers: reducer,
      path: `/`,
    });
    expect(
      screen.getByText('This tool is down for maintenance', {
        selector: 'h3',
        exact: true,
      }),
    );
    expect(
      screen.getByText('We’re making some updates to this tool', {
        exact: false,
      }),
    );
  });

  it('renders the downtime notification', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_sm']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      reducers: reducer,
      path: `/`,
    });
    await waitFor(() => {
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
    });
    expect(
      screen.getByText(
        'We’re working on this messaging tool right now. The maintenance will last 48 hours.',
        {
          exact: false,
        },
      ),
    );
  });

  it('renders the downtime notification for multiple configured services', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_sm', 'mhv_platform']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      reducers: reducer,
      path: `/`,
    });
    await waitFor(() => {
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
    });
    expect(
      screen.getByText(
        'We’re working on this messaging tool right now. The maintenance will last 48 hours.',
        {
          exact: false,
        },
      ),
    );
  });

  it('renders the downtime notification for mixed services', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_sm', 'mhv_meds']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      reducers: reducer,
      path: `/`,
    });
    await waitFor(() => {
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
    });
    expect(
      screen.getByText(
        'We’re working on this messaging tool right now. The maintenance will last 48 hours.',
        {
          exact: false,
        },
      ),
    );
  });

  it('does NOT render the downtime notification', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_mr']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      reducers: reducer,
      path: `/`,
    });
    const downtimeComponent = screen.queryByText(
      'Maintenance on My HealtheVet',
      {
        selector: 'h2',
        exact: true,
      },
    );
    expect(downtimeComponent).to.be.null;
  });
  it('redirects Basic users to /health-care/secure-messaging', async () => {
    const customState = {
      featureToggles: {},
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          services: [],
        },
      },
      ...noDowntime,
    };
    renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('redirects user to /my-health/secure-messages/inbox if feature flag is enabled', async () => {
    const customState = { ...initialState, featureToggles: [] };
    customState.featureToggles[
      `${'mhv_secure_messaging_remove_landing_page'}`
    ] = true;

    await renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
    expect(window.location.replace.args[0][0]).to.equal(
      '/my-health/secure-messages/inbox/',
    );
  });

  it('redirects user with pilot environment access to /my-health/secure-messages-pilot/inbox if feature flags are enabled', async () => {
    const customState = {
      ...initialState,
      featureToggles: [],
      sm: {
        ...initialState.sm,
        app: { isPilot: true },
      },
    };

    global.window.location = {
      replace: sinon.spy(),
      pathname: '/secure-messaging-pilot/',
    };

    customState.featureToggles[`${'mhv_secure_messaging_cerner_pilot'}`] = true;
    customState.featureToggles[
      `${'mhv_secure_messaging_remove_landing_page'}`
    ] = true;

    const { queryByText } = renderWithStoreAndRouter(<App isPilot />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    await waitFor(() => {
      expect(window.location.replace.args[0][0]).to.equal(
        '/my-health/secure-messages-pilot/inbox/',
      );
    });
  });

  it('should NOT redirect user to /my-health/secure-messages/inbox if feature flag is disabled', async () => {
    const customState = { ...initialState, featureToggles: [] };
    global.window.location = {
      replace: sinon.spy(),
      pathname: '/secure-messages/',
      href: 'https://www.va.gov/my-health/secure-messages/inbox',
    };

    customState.featureToggles[
      `${'mhv_secure_messaging_remove_landing_page'}`
    ] = false;

    const { getByText } = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });
    await waitFor(() => {
      expect(getByText('Messages', { selector: 'h1', exact: true })).to.exist;
    });

    expect(window.location.replace.called).to.be.false;
    expect(window.location.pathname).to.equal('/secure-messages/');
    expect(global.document.title).to.equal(
      `${PageTitles.DEFAULT_PAGE_TITLE_TAG}`,
    );
  });

  it('should NOT redirect user to /my-health/secure-messages-pilot/inbox if feature flag is disabled', async () => {
    const customState = { ...initialState, featureToggles: [] };

    global.window.location = {
      replace: sinon.spy(),
      pathname: '/secure-messages-pilot/',
      href: 'https://www.va.gov/my-health/secure-messages-pilot/inbox',
    };

    customState.featureToggles[`${'mhv_secure_messaging_cerner_pilot'}`] = true;
    customState.featureToggles[
      `${'mhv_secure_messaging_remove_landing_page'}`
    ] = false;

    const { getByText } = renderWithStoreAndRouter(pilotRoutes, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    await waitFor(() => {
      expect(getByText('Messages', { selector: 'h1', exact: true })).to.exist;
    });

    expect(window.location.replace.called).to.be.false;
    expect(window.location.pathname).to.equal('/secure-messages-pilot/');
    expect(global.document.title).to.equal(
      `${PageTitles.DEFAULT_PAGE_TITLE_TAG}`,
    );
  });

  it('should NOT redirect to the SM info page if the user is whitelisted or the feature flag is enabled', () => {
    const customState = { ...initialState, featureToggles: [] };
    customState.featureToggles[`${'mhv_secure_messaging_cerner_pilot'}`] = true;
    const { queryByText } = renderWithStoreAndRouter(pilotRoutes, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    expect(window.location.replace.calledOnce).to.be.false;
  });

  it('should redirect to the SM info page if the user is not whitelisted or the feature flag is disabled', () => {
    const customState = { ...initialState, featureToggles: [] };
    customState.featureToggles[
      `${'mhv_secure_messaging_cerner_pilot'}`
    ] = false;
    const { queryByText } = renderWithStoreAndRouter(pilotRoutes, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    expect(window.location.replace.called).to.be.true;
  });

  it('displays Page Not Found component if bad url', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState,
      reducers: reducer,
      path: `/sdfsdf`,
    });
    await waitFor(() => {
      expect(
        screen.getByText(pageNotFoundHeading, {
          selector: 'h1',
          exact: true,
        }),
      ).to.exist;
    });
  });
});
