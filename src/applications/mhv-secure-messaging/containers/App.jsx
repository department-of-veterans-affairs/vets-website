import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
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
import { initializeBrowserLogging } from 'platform/monitoring/Datadog';
import MhvServiceRequiredGuard from 'platform/mhv/components/MhvServiceRequiredGuard';
import AuthorizedRoutes from './AuthorizedRoutes';
import ScrollToTop from '../components/shared/ScrollToTop';
import { downtimeNotificationParams } from '../util/constants';
import featureToggles from '../hooks/useFeatureToggles';
import useTrackPreviousUrl from '../hooks/use-previous-url';
import FetchRecipients from '../components/FetchRecipients';
import LaunchMessagingAal from '../components/util/LaunchMessagingAal';

const App = () => {
  useTrackPreviousUrl();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { featureTogglesLoading, isDowntimeBypassEnabled, mhvMockSessionFlag } =
    featureToggles();

  useEffect(() => {
    if (mhvMockSessionFlag) localStorage.setItem('hasSession', true);
  }, [mhvMockSessionFlag]);

  const scheduledDownTimeIsReady = useSelector(
    state => state.scheduledDowntime?.isReady,
  );

  const scheduledDowntimes = useSelector(
    state => state.scheduledDowntime?.serviceMap || [],
  );

  const mhvSMDown = useMemo(() => {
    if (Object.keys(scheduledDowntimes).length > 0) {
      return (
        scheduledDowntimes &&
        ((scheduledDowntimes[externalServices.mhvSm] &&
          scheduledDowntimes[externalServices.mhvSm].status) ||
          (scheduledDowntimes[externalServices.mhvPlatform] &&
            scheduledDowntimes[externalServices.mhvPlatform].status))
      );
    }
    return 'downtime status: ok';
  }, [scheduledDowntimes]);

  useEffect(() => {
    if (!scheduledDownTimeIsReady) {
      dispatch(getScheduledDowntime());
    }
  }, [dispatch, scheduledDownTimeIsReady]);

  const datadogRumConfig = {
    applicationId: '02c72297-5059-4ed8-8472-874276f4a9b2',
    clientToken: 'pub1325dfe255119729611410e2f47f4f99',
    site: 'ddog-gov.com',
    service: 'va.gov-mhv-secure-messaging',
    // controls the percentage of overall sessions being tracked
    sessionSampleRate: environment.isStaging() ? 100 : 50,
    // is applied after the overall sample rate, and controls the percentage of sessions tracked as Browser RUM & Session Replay
    sessionReplaySampleRate: environment.isStaging() ? 100 : 50,
    trackInteractions: true,
    trackFrustrations: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  };

  useDatadogRum(datadogRumConfig);

  // Initialize Datadog Logs for dataDogLogger
  useEffect(() => {
    initializeBrowserLogging({
      clientToken: 'pub1325dfe255119729611410e2f47f4f99',
      site: 'ddog-gov.com',
      service: 'va.gov-mhv-secure-messaging',
      forwardErrorsToLogs: true,
      forwardConsoleLogs: ['error'],
      sessionSampleRate: 100,
    });
  }, []);

  useEffect(() => {
    setDatadogRumUser({ id: user?.profile?.accountUuid });
  }, [user]);

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
              <Switch>
                <AuthorizedRoutes />
              </Switch>
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

export default App;
