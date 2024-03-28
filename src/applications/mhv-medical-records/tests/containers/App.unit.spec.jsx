import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import App from '../../containers/App';
import LandingPage from '../../containers/LandingPage';
import reducer from '../../reducers';
import ResizeObserver from '../fixtures/mocks/ResizeObserver';

global.ResizeObserver = ResizeObserver;

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

  // it('user is not logged in', () => {
  //   // expected behavior is be redirected to the home page with next in the url
  //   renderWithStoreAndRouter(<App />, {
  //     initialState: {
  //       user: {
  //         login: {
  //           currentlyLoggedIn: false,
  //         },
  //       },
  //     },
  //     path: `/`,
  //     reducers: reducer,
  //   });
  //   expect(window.location.replace.calledOnce).to.be.true;
  // });

  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.MEDICAL_RECORDS],
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_to_va_gov_release: true,
    },
    mr: {
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

  describe('App-level feature flag functionality', () => {
    it('feature flags are still loading', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            ...initialState,
            featureToggles: {
              loading: true,
              // eslint-disable-next-line camelcase
              mhv_medical_records_to_va_gov_release: undefined,
            },
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(screen.getByTestId('mr-feature-flag-loading-indicator'));
    });

    it('feature flag set to false', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            ...initialState,
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_to_va_gov_release: false,
            },
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(
        screen.queryByText('Medical records', {
          selector: 'h1',
          exact: true,
        }),
      ).to.be.null;
      expect(
        screen.queryByText(
          'Review, print, and download your VA medical records.',
        ),
      ).to.be.null;
    });

    it('feature flag set to true', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            ...initialState,
            ...noDowntime,
          },
          reducers: reducer,
          path: `/`,
        },
      );
      expect(
        screen.getAllByText('Medical records', {
          selector: 'h1',
          exact: true,
        }),
      );
      expect(
        screen.getAllByText(
          'Review, print, and download your VA medical records.',
        ),
      );
    });

    it('renders the global downtime notification', () => {
      const screen = renderWithStoreAndRouter(<App />, {
        initialState: {
          ...initialState,
          scheduledDowntime: {
            globalDowntime: true,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['global']),
            dismissedDowntimeWarnings: [],
          },
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
          ...initialState,
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_mr']),
            dismissedDowntimeWarnings: [],
          },
        },
        reducers: reducer,
        path: `/`,
      });
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
      expect(
        screen.getByText(
          'We’re working on this medical records tool right now. The maintenance will last 48 hours.',
          {
            exact: false,
          },
        ),
      );
    });

    it('renders the downtime notification for multiple services', () => {
      const screen = renderWithStoreAndRouter(<App />, {
        initialState: {
          ...initialState,
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_mr', 'mhv_platform']),
            dismissedDowntimeWarnings: [],
          },
        },
        reducers: reducer,
        path: `/`,
      });
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
      expect(
        screen.getByText(
          'We’re working on this medical records tool right now. The maintenance will last 48 hours.',
          {
            exact: false,
          },
        ),
      );
    });

    it('does NOT render the downtime notification', () => {
      const screen = renderWithStoreAndRouter(<App />, {
        initialState: {
          ...initialState,
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_meds']),
            dismissedDowntimeWarnings: [],
          },
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
  });

  it('renders breadcrumbs when downtime and at the landing page', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        ...initialState,
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_mr']),
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
      path: `/`,
    });
    expect(screen.getByTestId('no-breadcrumbs')).to.exist;
  });

  it('does not render breadcrumbs when downtime and not at the landing page', () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: {
        ...initialState,
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_mr']),
          dismissedDowntimeWarnings: [],
        },
      },
      reducers: reducer,
      path: `/vaccines`,
    });
    expect(screen.queryByTestId('no-breadcrumbs')).to.not.exist;
  });

  describe('Side Nav feature flag functionality', () => {
    it('feature flag set to false', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            ...initialState,
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_display_sidenav: false,
            },
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(screen.queryByTestId('mhv-mr-navigation')).to.be.null;
    });

    it('feature flag set to true', () => {
      const screen = renderWithStoreAndRouter(
        <App>
          <LandingPage />
        </App>,
        {
          initialState: {
            ...initialState,
            featureToggles: {
              // eslint-disable-next-line camelcase
              mhv_medical_records_display_sidenav: true,
            },
            ...noDowntime,
          },
          reducers: reducer,
          path: `/`,
        },
      );
      expect(screen.queryByTestId('mhv-mr-navigation'));
    });
  });

  describe('Service-based redirection', async () => {
    it('redirects Basic users to /health-care/get-medical-records', async () => {
      const customState = {
        ...initialState,
        user: {
          ...initialState.user,
          profile: {
            services: [],
          },
        },
      };
      renderWithStoreAndRouter(<App />, {
        initialState: customState,
        reducers: reducer,
        path: `/`,
      });
      expect(window.location.replace.called).to.be.true;
    });

    it('does not redirect Premium users', async () => {
      renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
        path: `/`,
      });
      expect(window.location.replace.called).to.be.false;
    });
  });
});
