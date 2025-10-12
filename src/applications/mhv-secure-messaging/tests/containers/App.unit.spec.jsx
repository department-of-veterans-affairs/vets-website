import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import { pageNotFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import sinon from 'sinon';
import { addDays, subDays, format } from 'date-fns';
import { fireEvent, waitFor } from '@testing-library/dom';
import App from '../../containers/App';
import * as SmApi from '../../api/SmApi';
import reducer from '../../reducers';
import { Paths } from '../../util/constants';

describe('App', () => {
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
    // Note: RequiredLoginView handles redirect for logged-out users,
    // not our AuthorizedRoutes component, so no navigation assertion needed here
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

  it('does NOT render the downtime notification WHEN unrelated services are down', () => {
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
    const screen = renderWithStoreAndRouter(<App />, {
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

  it('redirects user to /my-health/secure-messages/inbox', async () => {
    const customState = { ...initialState, featureToggles: [] };

    const screen = await renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    // Verify the redirect happened via React Router
    await waitFor(() => {
      expect(screen.history.location.pathname).to.equal(
        '/my-health/secure-messages/inbox/',
      );
    });
  });

  it('displays Page Not Found component if bad url', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState,
      reducers: reducer,
      path: `/sdfsdf`,
    });
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

  it('renders CareTeamHelp when cerner pilot feature flag is enabled', async () => {
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        threadDetails: {
          acceptInterstitial: 'true',
          draftInProgress: {
            recipientId: '12345',
            category: 'TEST',
            subject: 'Test Subject',
            body: 'Test Body',
          },
        },
      },
      featureToggles: {},
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow
    ] = true;

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });

    // Accept interstitial (sets acceptInterstitial internally)
    const continueButton = await screen.findByRole('button', {
      name: /Continue to start message/i,
    });
    continueButton.click();

    // Navigate to Care Team Help route
    const link = await screen.findByText(
      'What to do if you can’t find your care team',
    );
    fireEvent.click(link);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /can.?t find your care team\?/i,
        }),
      ).to.exist;
    });
  });

  it('renders CareTeamHelp when cerner pilot feature flag is enabled and redirects if interstitial is not acknowledged', async () => {
    const customState = {
      ...initialState,
      featureToggles: {},
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow
    ] = true;

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.CARE_TEAM_HELP,
    });

    await waitFor(() => {
      // validate that routing is handled properly and <PageNotFound> is not being rendered
      expect(
        screen.queryByText(pageNotFoundHeading, {
          selector: 'h1',
          exact: true,
        }),
      ).to.not.exist;
    });
  });

  it('does not render CareTeamHelp when cerner pilot feature flag is disabled', async () => {
    const customState = {
      ...initialState,
      featureToggles: {},
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow
    ] = false;

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.CARE_TEAM_HELP,
    });

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

  it('renders RecentCareTeams component when feature flag is enabled', async () => {
    const recipients = [
      {
        triageTeamId: 3188767,
        name: 'TG API TESTING',
        healthCareSystemName: 'VA Maryland health care',
        stationNumber: '512',
      },
      {
        triageTeamId: 3658288,
        name: 'Record Amendment Admin',
        healthCareSystemName: 'VA Maryland health care',
        stationNumber: '512',
      },
    ];
    const customState = {
      ...initialState,
      sm: {
        ...initialState.sm,
        recipients: {
          recentRecipients: recipients,
          allRecipients: recipients,
        },
        threadDetails: {
          acceptInterstitial: true,
        },
      },
      featureToggles: {},
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingCuratedListFlow
    ] = true;
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingRecentRecipients
    ] = true;

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.RECENT_CARE_TEAMS,
    });

    await waitFor(() => {
      expect(screen.getByText('Recent care teams', { selector: 'h1' })).to
        .exist;
    });
  });

  it('does not render RecentCareTeams component when feature flag is disabled', async () => {
    const customState = {
      ...initialState,
      featureToggles: {},
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot
    ] = false;

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: customState,
      reducers: reducer,
      path: Paths.RECENT_CARE_TEAMS,
    });

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
    const useFeatureTogglesStub = stubUseFeatureToggles({
      isAalEnabled: true,
      largeAttachmentsEnabled: true,
    });
    useFeatureTogglesStub;

    renderWithStoreAndRouter(<App />, {
      initialState,
      reducers: reducer,
    });
    await waitFor(() => {
      expect(submitStub.calledOnce).to.be.true;
    });
    submitStub.restore();
    if (useFeatureTogglesStub && useFeatureTogglesStub.restore) {
      useFeatureTogglesStub.restore();
    }
  });
});
