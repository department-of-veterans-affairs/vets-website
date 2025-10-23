import { expect } from 'chai';
import React from 'react';
import { waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { addDays, subDays, format } from 'date-fns';
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import * as mhvExports from '~/platform/mhv/hooks/useDatadogRum';
import reducer from '../../reducers';
import App from '../../containers/App';

let sandbox;

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
  const initialStateFeatureFlag = (loading = true) => {
    return {
      initialState: {
        featureToggles: {
          loading,
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
      reducers: reducer,
    };
  };

  beforeEach(() => {
    mockFetch();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    resetFetch();
    sandbox.restore();
  });

  it('feature flags are still loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(),
    );
    expect(screenFeatureToggle.getByTestId('rx-feature-flag-loading-indicator'))
      .to.exist;
    expect(screenFeatureToggle.queryByText('unit test paragraph')).to.be.null;
  });

  it('feature flag set to true', async () => {
    const screenFeatureToggle = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      initialStateFeatureFlag(false),
    );
    await waitFor(() => {
      expect(screenFeatureToggle.getByText('unit test paragraph')).to.exist;
    });
  });

  it('renders the global downtime notification', async () => {
    const screen = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
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
            serviceMap: downtime(['global']),
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
    const screen = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
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
      screen.getByText('We’re working on this medications tool right now', {
        exact: false,
      }),
    );
  });

  it('bypasses downtime notification when bypassDowntime flag is true', async () => {
    const screen = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
            // eslint-disable-next-line camelcase
            mhv_bypass_downtime_notification: true,
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
    const downtimeComponent = await waitFor(() => {
      return screen.queryByText('Maintenance on My HealtheVet', {
        selector: 'h2',
        exact: true,
      });
    });
    expect(downtimeComponent).to.be.null;
  });

  it('renders the downtime notification for multiple configured services', async () => {
    const screen = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
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
      screen.getByText('We’re working on this medications tool right now', {
        exact: false,
      }),
    );
  });

  it('renders the downtime notification for mixed services', async () => {
    const screen = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
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
      screen.getByText('We’re working on this medications tool right now', {
        exact: false,
      }),
    );
  });

  it('does NOT render the downtime notification', () => {
    const screen = renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
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

  it('should call setDatadogRumUser with the correct user ID', async () => {
    const testAccountUuid = '12345678-1234-1234-1234-123456789012';
    const setDatadogRumUserStub = sandbox.stub(mhvExports, 'setDatadogRumUser');

    renderWithStoreAndRouterV6(
      <App>
        <p data-testid="app-unit-test-p">unit test paragraph</p>
      </App>,
      {
        initialState: {
          featureToggles: {
            loading: false,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              verified: true,
              services: [backendServices.RX],
              accountUuid: testAccountUuid,
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
      },
    );

    await waitFor(() => {
      expect(setDatadogRumUserStub.calledOnce).to.be.true;
      expect(setDatadogRumUserStub.firstCall.args[0]).to.deep.equal({
        id: testAccountUuid,
      });
    });
  });
});
