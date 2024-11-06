import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
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
import AuthorizedRoutes from './AuthorizedRoutes';
import ScrollToTop from '../components/shared/ScrollToTop';
import { getAllTriageTeamRecipients } from '../actions/recipients';
import manifest from '../manifest.json';
import { Actions } from '../util/actionTypes';
import { downtimeNotificationParams } from '../util/constants';
import useTrackPreviousUrl from '../hooks/use-previous-url';

const App = ({ isPilot }) => {
  useTrackPreviousUrl();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userServices = user.profile.services; // mhv_messaging_policy.rb defines if messaging service is avaialble when a user is in Premium status upon structuring user services from the user profile in services.rb
  const { featureTogglesLoading } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
      };
    },
    state => state.featureToggles,
  );
  const cernerPilotSmFeatureFlag = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot],
  );

  const mhvMockSessionFlag = useSelector(
    state => state.featureToggles['mhv-mock-session'],
  );

  useEffect(
    () => {
      if (mhvMockSessionFlag) localStorage.setItem('hasSession', true);
    },
    [mhvMockSessionFlag],
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
      const fetchAllData = async () => {
        dispatch(getScheduledDowntime());

        if (user.login.currentlyLoggedIn) {
          await dispatch(getAllTriageTeamRecipients());
        }
      };
      fetchAllData();
    },
    [user.login.currentlyLoggedIn, dispatch],
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
    sessionSampleRate: 100, // controls the percentage of overall sessions being tracked
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
    window.location.replace(manifest.rootUrl);
    return <></>;
  }

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.MESSAGING]}
      verify
    >
      {user.login.currentlyLoggedIn &&
      !userServices.includes(backendServices.MESSAGING) ? (
        window.location.replace('/my-health')
      ) : (
        <>
          <MhvSecondaryNav />
          <div className="vads-l-grid-container">
            {mhvSMDown === externalServiceStatus.down ? (
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
        </>
      )}
    </RequiredLoginView>
  );
};

App.propTypes = {
  isPilot: PropTypes.bool,
};

export default App;
