import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import BurialsApp from './BurialsApp';

// const route = {
//   path: '/',
//   component: BurialsApp,
//   indexRoute: { onEnter: (nextState, replace) => replace('/introduction') },
//   childRoutes: createRoutesWithSaveInProgress(formConfig),
// };

const routeObjects = createRoutesWithSaveInProgress(formConfig);

const route = (
  <Switch>
    <Route exact path="/">
      <BurialsApp>
        <Redirect to="/introduction" />
      </BurialsApp>
    </Route>
    {routeObjects}
  </Switch>
);

export default route;
