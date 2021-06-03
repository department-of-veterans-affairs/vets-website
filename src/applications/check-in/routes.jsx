import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './containers/App.jsx';

import LandingPage from './pages/LandingPage';
// import ConfirmationPage from './pages/ConfirmationPage';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route
        path="/"
        component={props => (
          <App>
            <LandingPage {...props} />
          </App>
        )}
      />
      {/* <Route path="/something" exact component={ConfirmationPage} /> */}
    </Switch>
  );
};
export default createRoutesWithStore;
