import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
// import ConfirmationPage from './pages/ConfirmationPage';

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path="/:token" component={props => <LandingPage {...props} />} />
    </Switch>
  );
};
export default createRoutesWithStore;
