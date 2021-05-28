import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './containers/App.jsx';

const landingPagePath = `/:token`;

const createRoutesWithStore = () => {
  return (
    <Switch>
      <Route path={landingPagePath} exact component={App} />
    </Switch>
  );
};
export default createRoutesWithStore;
