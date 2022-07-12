import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableAppV5';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpersV5';
import formConfig from './config/form';

const routeObjects = createRoutesWithSaveInProgress(formConfig);

const route = (
  <RoutedSavableApp formConfig={formConfig} currentLocation={window.location}>
    <Switch>
      <Route exact path="/">
        <Redirect to="/introduction" />
      </Route>
      {routeObjects}
    </Switch>
  </RoutedSavableApp>
);

export default route;
