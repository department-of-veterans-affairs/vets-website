import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import {
  logOut,
  updateLoggedInStatus,
} from '@department-of-veterans-affairs/platform-user/authentication/actions';
import AuthorizedRoutes from './AuthorizedRoutes';
import LandingPageUnauth from './LandingPageUnauth';
import MessageFAQs from './MessageFAQs';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state?.user.login.currentlyLoggedIn);

  const handleClick = () => {
    if (isLoggedIn) {
      dispatch(logOut());
    } else dispatch(updateLoggedInStatus(!isLoggedIn));
  };

  return (
    <div className="vads-l-grid-container">
      <div className="vads-l-row breadcrumbs">
        <SmBreadcrumbs />
      </div>
      <div className="secure-messaging-container vads-u-display--flex">
        <div className="vads-u-flex--auto">
          <Navigation />
        </div>

        <div className="vads-u-flex--fill">
          {/* toggle log in and out state without using va.gov sign in, to show the toggle button, comment out ht evisibility:hidden style */}
          <button
            style={{
              // visibility: 'hidden',
              'z-index': '2',
              position: 'absolute',
              top: '0',
              left: '0',
            }}
            type="button"
            onClick={handleClick}
          >
            {isLoggedIn ? <>log out</> : <>log in</>}
          </button>
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
  );
};

export default App;
