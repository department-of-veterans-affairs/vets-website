import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './form/form';
import App from './App';

const routeObjects = createRoutesWithSaveInProgress(formConfig);

const route = (
  <Switch>
    <Route exact path="/">
      <App>
        <Redirect to="/introduction" />
      </App>
    </Route>
    {routeObjects}
  </Switch>
);

export default route;
