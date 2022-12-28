import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import {
  selectUser,
  isLoggedIn,
} from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import AuthorizedRoutes from './AuthorizedRoutes';
import LandingPageUnauth from './LandingPageUnauth';
import MessageFAQs from './MessageFAQs';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';

const App = () => {
  const user = useSelector(selectUser);
  const loginState = useSelector(isLoggedIn);
  const mhvSecureMessagingToVaGovRelease = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingToVaGovRelease],
  );

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.MESSAGING]}
      verify={!environment.isLocalhost()}
    >
      <div className="vads-l-grid-container">
        {/* if the feature flag is undefined, show the loading indicator */}
        {mhvSecureMessagingToVaGovRelease === undefined && (
          <va-loading-indicator
            message="Loading your secure messages..."
            setFocus
            data-testid="loading-indicator"
          />
        )}
        {mhvSecureMessagingToVaGovRelease && (
          <>
            <SmBreadcrumbs />

            <div className="secure-messaging-container vads-u-display--flex">
              <Navigation />
              <Switch>
                <Route path="/faq" key="MessageFAQ">
                  <MessageFAQs isLoggedIn={loginState} />
                </Route>
                {loginState ? (
                  <AuthorizedRoutes isLoggedIn={loginState} />
                ) : (
                  <LandingPageUnauth />
                )}
              </Switch>
            </div>
          </>
        )}
        {mhvSecureMessagingToVaGovRelease === false && (
          <>
            <h1>Secure Messaging</h1>
            <p className="va-introtext vads-u-margin-top--1">Coming soon...</p>
          </>
        )}
      </div>
    </RequiredLoginView>
  );
};

export default App;
