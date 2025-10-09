import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import * as mhvExports from '~/platform/mhv/hooks/useDatadogRum';
import App from '../../containers/App';
import LandingPage from '../../containers/LandingPage';
import reducer from '../../reducers';
import ResizeObserver from '../fixtures/mocks/ResizeObserver';

global.ResizeObserver = ResizeObserver;
let sandbox;

// Skipped until Node 22.
// `global.window.location.replace = sinon.spy();` fails on Node 14
describe.skip('App', () => {
  let oldLocation;

  beforeEach(() => {
    mockFetch();
    oldLocation = global.window.location;
    global.window.location.replace = sinon.spy();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    resetFetch();
    global.window.location = oldLocation;
    sandbox.restore();
  });

  const testAccountUuid = '12345678-1234-1234-1234-123456789012';
  const initialState = {
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.MEDICAL_RECORDS],
        verified: true,
        mhvAccountState: 'MULTIPLE',
        accountUuid: testAccountUuid,
      },
    },
    mr: {
      breadcrumbs: {
        crumbsList: [
          {
            href: '/',
            label: 'VA.gov home',
          },
          {
            href: '/my-health',
            label: 'My HealtheVet',
          },
          {
            href: '/',
            label: 'Medical records',
            isRouterLink: true,
          },
        ],
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
            featureToggles: { loading: true },
          },
          path: `/`,
          reducers: reducer,
        },
      );
      expect(screen.getByTestId('mr-feature-flag-loading-indicator'));
    });

    it('feature flags are done loading', async () => {
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
      await waitFor(() => {
        expect(
          screen.getAllByText('Medical records', {
            selector: 'h1',
            exact: true,
          }),
        );
      });
      expect(
        screen.getAllByText(
          'Review, print, and download your VA medical records.',
          {
            selector: 'p',
            exact: false,
          },
        ),
      );
      expect(screen.getByRole('navigation', { name: 'My HealtheVet' }));
    });
  });

  describe('Downtime notification logic', () => {
    it('renders the global downtime notification', async () => {
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
      await waitFor(() => {
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
    });

    it('renders the downtime notification', async () => {
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
      await waitFor(() => {
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
    });

    it('renders the downtime notification for multiple services', async () => {
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
      await waitFor(() => {
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

    it('bypasses downtime notification when bypassDowntime flag is true', async () => {
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
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_bypass_downtime_notification: true,
          },
        },
        reducers: reducer,
        path: `/`,
      });
      const downtimeComponent = await waitFor(() => {
        return screen.queryByText('Maintenance on My HealtheVet', {
          selector: 'h2',
          exact: true,
        });
      });
      expect(downtimeComponent).to.be.null;
    });

    it('bypasses the global downtime notification when bypassDowntime flag is true', async () => {
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
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_bypass_downtime_notification: true,
          },
        },
        reducers: reducer,
        path: `/`,
      });
      const [maintenanceText, updatesText] = await waitFor(() => {
        return [
          screen.queryByText('This tool is down for maintenance', {
            selector: 'h3',
            exact: true,
          }),
          screen.queryByText('We’re making some updates to this tool', {
            exact: false,
          }),
        ];
      });
      expect(maintenanceText).to.be.null;
      expect(updatesText).to.be.null;
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
    waitFor(() => {
      expect(screen.getByTestId('breadcrumbs')).to.exist;
    });
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
    expect(screen.queryByTestId('breadcrumbs')).to.not.exist;
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
            ...noDowntime,
          },
          reducers: reducer,
          path: `/`,
        },
      );
      expect(screen.queryByTestId('mhv-mr-navigation'));
    });
  });

  describe('Redirection of disallowed users', async () => {
    it('redirects unauthenticated users to /health-care/get-medical-records', async () => {
      const customState = {
        ...initialState,
        user: {
          ...initialState.user,
          login: { currentlyLoggedIn: false },
        },
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
      await waitFor(() => {
        expect(window.location.replace.called).to.be.true;
      });
    });

    it('does not redirect authenticated Premium users', async () => {
      renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
        path: `/`,
      });
      await waitFor(() => {
        expect(window.location.replace.called).to.be.false;
      });
    });
  });

  it('should call setDatadogRumUser with the correct user ID', async () => {
    const setDatadogRumUserStub = sandbox.stub(mhvExports, 'setDatadogRumUser');

    renderWithStoreAndRouter(
      <App>
        <div>Test content</div>
      </App>,
      {
        initialState,
        reducers: reducer,
        path: `/`,
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
