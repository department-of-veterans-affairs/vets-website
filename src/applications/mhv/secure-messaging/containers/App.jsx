import React from 'react';
import { useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import AuthorizedRoutes from './AuthorizedRoutes';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';
import ScrollToTop from '../components/shared/ScrollToTop';

import { useDatadogRum } from '../hooks/useDatadogRum';

const App = () => {
  const user = useSelector(selectUser);
  const userServices = user.profile.services;
  const mhvSecureMessagingToVaGovRelease = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingToVaGovRelease],
  );

  useDatadogRum();

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.MESSAGING]}
    >
      {/* if the user is logged in and does not have access to secure messaging, redirect to the SM info page */}
      {user.login.currentlyLoggedIn &&
        !environment.isLocalhost() &&
        !userServices.includes(backendServices.MESSAGING) &&
        window.location.replace('/health-care/secure-messaging')}

      <div className="vads-l-grid-container">
        {/* if the feature flag is undefined, show the loading indicator */}
        {mhvSecureMessagingToVaGovRelease === undefined && (
          <va-loading-indicator
            message="Loading your secure messages..."
            setFocus
            data-testid="feature-flag-loading-indicator"
          />
        )}

        {mhvSecureMessagingToVaGovRelease && (
          <>
            <SmBreadcrumbs />

            <div className="secure-messaging-container vads-u-display--flex">
              <Navigation />
              <ScrollToTop />
              <Switch>
                <AuthorizedRoutes />
              </Switch>
            </div>
          </>
        )}

        {/* if the user is not whitelisted or feature flag is disabled, redirect to the SM info page */}
        {mhvSecureMessagingToVaGovRelease === false &&
          window.location.replace('/health-care/secure-messaging')}
      </div>
      <div className="vads-u-padding-right--1">
        <va-back-to-top aria-label="Back to top" />
      </div>
    </RequiredLoginView>
  );
};

export default App;
