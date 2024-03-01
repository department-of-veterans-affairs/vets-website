import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  DowntimeNotification,
  externalServices,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { useDatadogRum } from '@department-of-veterans-affairs/mhv/exports';
import AuthorizedRoutes from './AuthorizedRoutes';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';
import ScrollToTop from '../components/shared/ScrollToTop';
import { getAllTriageTeamRecipients } from '../actions/recipients';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userServices = user.profile.services; // mhv_messaging_policy.rb defines if messaging service is avaialble when a user is in Premium status upon structuring user services from the user profile in services.rb
  const { featureTogglesLoading, appEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        appEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvSecureMessagingToVaGovRelease
          ],
      };
    },
    state => state.featureToggles,
  );

  useEffect(
    () => {
      if (user.login.currentlyLoggedIn) {
        dispatch(getAllTriageTeamRecipients());
      }
    },
    [user.login.currentlyLoggedIn, dispatch],
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

  if (featureTogglesLoading) {
    return (
      <div className="vads-l-grid-container">
        <va-loading-indicator
          message="Loading your secure messages..."
          setFocus
          data-testid="feature-flag-loading-indicator"
        />
      </div>
    );
  }

  /* if the user is not whitelisted or feature flag is disabled, redirect to the SM info page */
  if (!appEnabled) {
    window.location.replace('/health-care/secure-messaging');
    return <></>;
  }
  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.MESSAGING]}
    >
      {user.login.currentlyLoggedIn &&
      !userServices.includes(backendServices.MESSAGING) ? (
        window.location.replace('/health-care/secure-messaging')
      ) : (
        <div className="vads-l-grid-container">
          <SmBreadcrumbs />
          <div
            className="secure-messaging-container
          vads-u-display--flex
          vads-u-flex-direction--column
          medium-screen:vads-u-flex-direction--row"
          >
            <DowntimeNotification
              appTitle="Secure Messaging"
              dependencies={[
                externalServices.mhvPlatform,
                externalServices.mhvSm,
              ]}
            >
              <Navigation />
              <ScrollToTop />
              <Switch>
                <AuthorizedRoutes />
              </Switch>
            </DowntimeNotification>
          </div>
          <div className="bottom-container">
            <va-back-to-top />
          </div>
        </div>
      )}
    </RequiredLoginView>
  );
};

export default App;
