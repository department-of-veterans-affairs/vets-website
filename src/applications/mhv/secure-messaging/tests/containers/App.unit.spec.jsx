import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import App from '../../containers/App';
import reducer from '../../reducers';

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
  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.MESSAGING],
      },
    },
    sm: {
      breadcrumbs: {
        list: [],
      },
    },
  };
  const noDowntime = {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
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
        user: {
          login: {
            currentlyLoggedIn: false,
          },
        },
      },
      path: `/`,
      reducers: reducer,
    });

    expect(window.location.replace.calledOnce).to.be.true;
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

  it('feature flag set to false', () => {
    const customState = { ...initialState, featureToggles: [] };
    customState.featureToggles[
      `${'mhv_secure_messaging_to_va_gov_release'}`
    ] = false;

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      path: `/`,
      reducers: reducer,
    });
    expect(
      screen.queryByText(
        'Communicate privately and securely with your VA health care team online.',
      ),
    ).to.be.null;
    expect(screen.queryByText('Messages', { selector: 'h1', exact: true })).to
      .be.null;
    expect(window.location.replace.calledOnce).to.be.true;
  });

  it('feature flag set to true', () => {
    const customState = {
      featureToggles: [],
      ...initialState,
      ...noDowntime,
    };
    customState.featureToggles[
      `${'mhv_secure_messaging_to_va_gov_release'}`
    ] = true;
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });
    expect(screen.getByText('Messages', { selector: 'h1', exact: true }));
    expect(
      screen.getByText(
        'Communicate privately and securely with your VA health care team online.',
      ),
    );
  });

  it('renders the global downtime notification', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: true,
        },
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

  it('renders the downtime notification', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: true,
        },
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

  it('renders the downtime notification for multiple configured services', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: true,
        },
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

  it('renders the downtime notification for mixed services', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: true,
        },
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

  it('does NOT render the downtime notification', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_secure_messaging_to_va_gov_release: true,
        },
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
      'This tool is down for maintenance',
      {
        selector: 'h3',
        exact: true,
      },
    );
    expect(downtimeComponent).to.be.null;
  });
  it('redirects Basic users to /health-care/secure-messaging', async () => {
    const customState = {
      featureToggles: [],
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
    customState.featureToggles[
      `${'mhv_secure_messaging_to_va_gov_release'}`
    ] = true;
    renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });
    expect(window.location.replace.called).to.be.true;
  });
});
