import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';

import formConfig from './config/form';
import PreNeedApp from './PreNeedApp';

const routeObjects = createRoutesWithSaveInProgress(formConfig);

const route = (
  <Switch>
    <Route exact path="/">
      <PreNeedApp>
        <Redirect to="/introduction" />
      </PreNeedApp>
    </Route>
    {routeObjects}
  </Switch>
);

export default route;
