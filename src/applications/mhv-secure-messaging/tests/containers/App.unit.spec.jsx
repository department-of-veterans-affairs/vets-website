import React from 'react';
import { expect } from 'chai';
import { renderWithDataRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { pageNotFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { addDays, subDays, format } from 'date-fns';
import { waitFor } from '@testing-library/dom';
import App from '../../containers/App';
import * as SmApi from '../../api/SmApi';
import * as navigationUtils from '../../util/navigation';
import reducer from '../../reducers';

const setup = (state = {}, path = '/', ui = <App />) => {
  const routes = [
    {
      path: '*',
      element: ui,
    },
  ];
  return renderWithDataRouter(routes, {
    initialState: state,
    reducers: reducer,
    initialEntry: path,
  });
};

describe('App', () => {
  let sandbox;
  let mockNavigate;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockNavigate = sandbox.stub();
    // Mock our custom navigation hook
    sandbox.stub(navigationUtils, 'useAppNavigate').returns(mockNavigate);

    // Mock window.location.replace
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        replace: sandbox.stub(),
        pathname: '/',
      },
      writable: true,
    });
  });

  afterEach(() => {
    // global.window.location = oldLocation;
    sandbox.restore();
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
    setup(
      {
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
      '/',
    );
    waitFor(() => expect(window.location.replace.called).to.be.true);
  });

  it('feature flags are still loading', () => {
    const screen = setup(
      {
        featureToggles: {
          loading: true,
        },
        ...initialState,
      },
      '/',
    );
    expect(screen.getByTestId('feature-flag-loading-indicator'));
  });

  it.skip('renders the global downtime notification', () => {
    const screen = setup(
      {
        scheduledDowntime: {
          globalDowntime: true,
          isReady: true,
          isPending: false,
          serviceMap: downtime([]),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      '/',
    );
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
    const screen = setup(
      {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_sm']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      '/',
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
      screen.getByText(
        'We’re working on this messaging tool right now. The maintenance will last 48 hours.',
        {
          exact: false,
        },
      ),
    );
  });

  it('renders the downtime notification for multiple configured services', async () => {
    const screen = setup(
      {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_sm', 'mhv_platform']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      '/',
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
      screen.getByText(
        'We’re working on this messaging tool right now. The maintenance will last 48 hours.',
        {
          exact: false,
        },
      ),
    );
  });

  it('renders the downtime notification for mixed services', async () => {
    const screen = setup(
      {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_sm', 'mhv_meds']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      '/',
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
      screen.getByText(
        'We’re working on this messaging tool right now. The maintenance will last 48 hours.',
        {
          exact: false,
        },
      ),
    );
  });

  it('does NOT render the downtime notification', () => {
    const screen = setup(
      {
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap: downtime(['mhv_mr']),
          dismissedDowntimeWarnings: [],
        },
        ...initialState,
      },
      '/',
    );
    const downtimeComponent = screen.queryByText(
      'Maintenance on My HealtheVet',
      {
        selector: 'h2',
        exact: true,
      },
    );
    expect(downtimeComponent).to.be.null;
  });

  it('does NOT render the downtime notification WHEN downtime bypass is enabled', () => {
    const customState = {
      ...initialState,
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: downtime(['mhv_sm']),
        dismissedDowntimeWarnings: [],
      },
      featureToggles: {},
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification
    ] = true;
    const screen = setup({
      initialState: customState,
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
    setup(customState, '/');
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('redirects user to /my-health/secure-messages/inbox', async () => {
    const customState = { ...initialState, featureToggles: [] };

    setup(customState, '/');

    await waitFor(() => {
      sinon.assert.calledWith(
        mockNavigate,
        '/my-health/secure-messages/inbox/',
        { replace: true },
      );
    });
  });

  it('redirects user with pilot environment access to /my-health/secure-messages-pilot/inbox', async () => {
    const customState = {
      ...initialState,
      featureToggles: [],
      sm: {
        ...initialState.sm,
        app: { isPilot: true },
      },
    };

    customState.featureToggles[`${'mhv_secure_messaging_cerner_pilot'}`] = true;

    const { queryByText } = setup(customState, '/', <App isPilot />);

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    await waitFor(() => {
      sinon.assert.calledWith(
        mockNavigate,
        '/my-health/secure-messages-pilot/inbox/',
        { replace: true },
      );
    });
  });

  it('should NOT redirect to the SM info page if the user is whitelisted or the feature flag is enabled', () => {
    const customState = { ...initialState, featureToggles: [] };
    customState.featureToggles[`${'mhv_secure_messaging_cerner_pilot'}`] = true;
    const { queryByText } = setup(customState, '/inbox', <App isPilot />);

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    expect(window.location.replace.calledOnce).to.be.false;
  });

  it('should redirect to the SM info page if the user is not whitelisted or the feature flag is disabled', () => {
    const customState = { ...initialState, featureToggles: [] };
    customState.featureToggles[
      `${'mhv_secure_messaging_cerner_pilot'}`
    ] = false;
    const { queryByText } = setup(customState, '/', <App isPilot />);

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    expect(mockNavigate.called).to.be.true;
  });

  it('displays Page Not Found component if bad url', async () => {
    const screen = setup(initialState, '/sdfsdf');
    await waitFor(() => {
      expect(screen.getByTestId('mhv-page-not-found')).to.exist;
      expect(
        screen.getByText(pageNotFoundHeading, {
          selector: 'h1',
          exact: true,
        }),
      ).to.exist;
    });
  });

  it('renders LaunchMessagingAal component', async () => {
    const stubUseFeatureToggles = value => {
      const useFeatureToggles = require('../../hooks/useFeatureToggles');
      return sinon.stub(useFeatureToggles, 'default').returns(value);
    };

    const submitStub = sinon.stub(SmApi, 'submitLaunchMessagingAal');
    submitStub.resolves();
    const useFeatureTogglesStub = stubUseFeatureToggles({ isAalEnabled: true });
    setup(initialState);
    await waitFor(() => {
      expect(submitStub.calledOnce).to.be.true;
    });
    submitStub.restore();
    if (useFeatureTogglesStub && useFeatureTogglesStub.restore) {
      useFeatureTogglesStub.restore();
    }
  });
});
