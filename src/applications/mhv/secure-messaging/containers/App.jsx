import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import useInterval from '../hooks/use-interval';
import AuthorizedRoutes from './AuthorizedRoutes';
import LandingPageUnauth from './LandingPageUnauth';
import MessageFAQs from './MessageFAQs';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import Navigation from '../components/Navigation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    useSelector(state => state?.user.login.currentlyLoggedIn),
  );
  useInterval(() => {
    setIsLoggedIn(!isLoggedIn);
  }, 9000);

  const handleClick = () => {
    setIsLoggedIn(!isLoggedIn);
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
          <button type="button" onClick={handleClick}>
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
