import { expect } from 'chai';
import React from 'react';
import { waitFor } from '@testing-library/dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { addDays, subDays, format } from 'date-fns';
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import reducer from '../../reducers';
import App from '../../containers/App';

describe('Medications <App>', () => {
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
  const initialStateFeatureFlag = (loading = true, flag = true) => {
    return {
      initialState: {
        featureToggles: {
          loading,
          // eslint-disable-next-line camelcase
          mhv_medications_to_va_gov_release: flag,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            verified: true,
            services: [backendServices.RX],
          },
        },
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime([]),
          dismissedDowntimeWarnings: [],
        },
      },
      path: `/`,
      reducers: reducer,
    };
  };

  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('feature flags are still loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(),
    );
    expect(screenFeatureToggle.getByTestId('rx-feature-flag-loading-indicator'))
      .to.exist;
    expect(screenFeatureToggle.queryByText('unit test paragraph')).to.be.null;
  });

  it('feature flag set to false', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(false, false),
    );
    expect(screenFeatureToggle.queryByText('unit test paragraph')).to.be.null;
  });

  it('feature flag set to true', async () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(false, true),
    );
    await waitFor(() => {
      expect(screenFeatureToggle.getByText('unit test paragraph')).to.exist;
    });
  });

  it('renders the global downtime notification', async () => {
    const screen = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_medications_to_va_gov_release: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              verified: true,
              services: [backendServices.RX],
            },
          },
          scheduledDowntime: {
            globalDowntime: true,
            isReady: true,
            isPending: false,
            serviceMap: downtime([]),
            dismissedDowntimeWarnings: [],
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('This tool is down for maintenance', {
          selector: 'h3',
          exact: true,
        }),
      );
    });
    expect(
      screen.getByText('We’re making some updates to this tool', {
        exact: false,
      }),
    );
  });

  it('renders the downtime notification', async () => {
    const screen = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_medications_to_va_gov_release: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              verified: true,
              services: [backendServices.RX],
            },
          },
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_meds']),
            dismissedDowntimeWarnings: [],
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
    });
    expect(
      screen.getByText('We’re working on Medications right now', {
        exact: false,
      }),
    );
  });

  it('renders the downtime notification for multiple configured services', async () => {
    const screen = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_medications_to_va_gov_release: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              verified: true,
              services: [backendServices.RX],
            },
          },
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_meds', 'mhv_platform']),
            dismissedDowntimeWarnings: [],
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        }),
      );
    });
    expect(
      screen.getByText('We’re working on Medications right now', {
        exact: false,
      }),
    );
  });

  it('renders the downtime notification for mixed services', async () => {
    const screen = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_medications_to_va_gov_release: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              verified: true,
              services: [backendServices.RX],
            },
          },
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_mr', 'mhv_meds']),
            dismissedDowntimeWarnings: [],
          },
        },
      },
    );
    await waitFor(() => {
      expect(
        screen.getByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: false,
        }),
      );
    });
    expect(
      screen.getByText('We’re working on Medications right now', {
        exact: false,
      }),
    );
  });

  it('does NOT render the downtime notification', () => {
    const screen = renderWithStoreAndRouter(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_medications_to_va_gov_release: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              verified: true,
              services: [backendServices.RX],
            },
          },
          scheduledDowntime: {
            globalDowntime: null,
            isReady: true,
            isPending: false,
            serviceMap: downtime(['mhv_sm']),
            dismissedDowntimeWarnings: [],
          },
        },
      },
    );
    const downtimeComponent = screen.queryByText(
      'This tool is down for maintenance',
      {
        selector: 'h3',
        exact: true,
      },
    );
    expect(downtimeComponent).to.be.null;
  });
});
