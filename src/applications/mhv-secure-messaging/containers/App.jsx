import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Routes } from 'react-router-dom-v5-compat';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import {
  DowntimeNotification,
  externalServices,
  externalServiceStatus,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import {
  renderMHVDowntime,
  useDatadogRum,
  setDatadogRumUser,
  MhvSecondaryNav,
} from '@department-of-veterans-affairs/mhv/exports';
import { getScheduledDowntime } from 'platform/monitoring/DowntimeNotification/actions';
import MhvServiceRequiredGuard from 'platform/mhv/components/MhvServiceRequiredGuard';
import AuthorizedRoutes from './AuthorizedRoutes';
import ScrollToTop from '../components/shared/ScrollToTop';
import manifest from '../manifest.json';
import { Actions } from '../util/actionTypes';
import { downtimeNotificationParams, Paths } from '../util/constants';
import featureToggles from '../hooks/useFeatureToggles';
import useTrackPreviousUrl from '../hooks/use-previous-url';
import FetchRecipients from '../components/FetchRecipients';
import LaunchMessagingAal from '../components/util/LaunchMessagingAal';

const App = ({ isPilot }) => {
  useTrackPreviousUrl();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const {
    featureTogglesLoading,
    isDowntimeBypassEnabled,
    cernerPilotSmFeatureFlag,
    mhvMockSessionFlag,
  } = featureToggles();

  useEffect(
    () => {
      if (mhvMockSessionFlag) localStorage.setItem('hasSession', true);
    },
    [mhvMockSessionFlag],
  );

  const scheduledDownTimeIsReady = useSelector(
    state => state.scheduledDowntime?.isReady,
  );

  const scheduledDowntimes = useSelector(
    state => state.scheduledDowntime?.serviceMap || [],
  );

  const mhvSMDown = useMemo(
    () => {
      if (scheduledDowntimes.size > 0) {
        return (
          scheduledDowntimes?.get(externalServices.mhvSm)?.status ||
          scheduledDowntimes?.get(externalServices.mhvPlatform)?.status
        );
      }
      return 'downtime status: ok';
    },
    [scheduledDowntimes],
  );

  useEffect(
    () => {
      if (!scheduledDownTimeIsReady) {
        dispatch(getScheduledDowntime());
      }
    },
    [dispatch, scheduledDownTimeIsReady],
  );

  useEffect(
    () => {
      if (isPilot) {
        dispatch({ type: Actions.App.IS_PILOT });
      }
    },
    [isPilot, dispatch],
  );

  const datadogRumConfig = {
    applicationId: '02c72297-5059-4ed8-8472-874276f4a9b2',
    clientToken: 'pub1325dfe255119729611410e2f47f4f99',
    site: 'ddog-gov.com',
    service: 'va.gov-mhv-secure-messaging',
    sessionSampleRate: 50, // controls the percentage of overall sessions being tracked
    sessionReplaySampleRate: 50, // is applied after the overall sample rate, and controls the percentage of sessions tracked as Browser RUM & Session Replay
    trackInteractions: true,
    trackFrustrations: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  };

  useDatadogRum(datadogRumConfig);
  useEffect(
    () => {
      setDatadogRumUser({ id: user?.profile?.accountUuid });
    },
    [user],
  );

  if (featureTogglesLoading) {
    return (
      <>
        <MhvSecondaryNav />
        <div className="vads-l-grid-container">
          <va-loading-indicator
            message="Loading your secure messages..."
            setFocus
            data-testid="feature-flag-loading-indicator"
          />
        </div>
      </>
    );
  }

  // Feature flag maintains whitelist for cerner integration pilot environment.
  // If the user lands on /my-health/secure-messages-pilot and is not whitelisted,
  // redirect to the SM main experience landing page
  if (isPilot && !cernerPilotSmFeatureFlag) {
    const url = `${manifest.rootUrl}${Paths.INBOX}`;
    window.location.replace(url);
    return <></>;
  }

  return (
    // SM Patient API has its own check for facilities that a user is connected to.
    // It will not start a session if a user has no associated facilities.
    <RequiredLoginView user={user}>
      <MhvServiceRequiredGuard
        user={user}
        serviceRequired={[backendServices.MESSAGING]}
      >
        <LaunchMessagingAal />
        <FetchRecipients />
        <MhvSecondaryNav />
        <div className="vads-l-grid-container">
          {mhvSMDown === externalServiceStatus.down &&
          !isDowntimeBypassEnabled ? (
            <>
              <h1>Messages</h1>
              <DowntimeNotification
                appTitle={downtimeNotificationParams.appTitle}
                dependencies={[
                  externalServices.mhvPlatform,
                  externalServices.mhvSm,
                ]}
                render={renderMHVDowntime}
              />
            </>
          ) : (
            <div
              className="secure-messaging-container
          vads-u-display--flex
          vads-u-flex-direction--column
          medium-screen:vads-u-flex-direction--row"
            >
              <ScrollToTop />
              <Routes>
                <AuthorizedRoutes />
              </Routes>
            </div>
          )}

          <div className="bottom-container">
            <va-back-to-top />
          </div>
        </div>
      </MhvServiceRequiredGuard>
    </RequiredLoginView>
  );
};

App.propTypes = {
  isPilot: PropTypes.bool,
};

export default App;
