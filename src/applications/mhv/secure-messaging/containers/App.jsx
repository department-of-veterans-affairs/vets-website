import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import {
  logOut,
  updateLoggedInStatus,
} from '@department-of-veterans-affairs/platform-user/authentication/actions';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import AuthorizedRoutes from './AuthorizedRoutes';
import LandingPageUnauth from './LandingPageUnauth';
import MessageFAQs from './MessageFAQs';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';
import ScrollToTop from '../components/shared/ScrollToTop';

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state?.user.login.currentlyLoggedIn);
  const mhvSecureMessagingToVaGovRelease = useSelector(state => {
    return state.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingToVaGovRelease
    ];
  });

  const handleClick = () => {
    if (isLoggedIn) {
      dispatch(logOut());
    } else dispatch(updateLoggedInStatus(!isLoggedIn));
  };
  return (
    <div className="vads-l-grid-container" data-testid="feature-flag-undefined">
      {/* if the feature flag is undefined, show the loading indicator */}
      {mhvSecureMessagingToVaGovRelease === undefined && (
        <va-loading-indicator
          message="Loading your secure messages..."
          setFocus
          data-testid="loading-indicator"
        />
      )}
      {mhvSecureMessagingToVaGovRelease && (
        <div data-testid="feature-flag-true">
          <div className="vads-l-row breadcrumbs">
            <SmBreadcrumbs />
          </div>
          <div className="secure-messaging-container vads-u-display--flex">
            <div className="vads-u-flex--auto">
              <Navigation />
            </div>

            <div className="vads-u-flex--fill">
              {/* toggle log in and out state without using va.gov sign in, to show the toggle button, comment out the visibility:hidden style */}
              <button
                style={{
                  visibility: 'hidden',
                  'z-index': '2',
                  width: '100px',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                }}
                type="button"
                onClick={handleClick}
              >
                {isLoggedIn ? <>log out</> : <>log in</>}
              </button>
              <ScrollToTop />
              <Switch>
                <Route path="/faq" key="MessageFAQ">
                  <MessageFAQs isLoggedIn={isLoggedIn} />
                </Route>
                {isLoggedIn ? (
                  <AuthorizedRoutes isLoggedIn={isLoggedIn} />
                ) : (
                  <LandingPageUnauth />
                )}
              </Switch>
            </div>
          </div>
        </div>
      )}
      {mhvSecureMessagingToVaGovRelease === false && (
        <div data-testid="feature-flag-false">
          <h1>Secure Messaging</h1>
          <p className="va-introtext vads-u-margin-top--1">Coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default App;
