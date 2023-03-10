import React from 'react';
import { Switch, Route } from 'react-router-dom';
import InboxPage from './containers/InboxPage';

const routes = (
  <Switch>
    <Route exact path="/" key="/preview">
      <InboxPage />
    </Route>
    ,
  </Switch>
);

export default routes;
