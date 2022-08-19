import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import InboxPage from './containers/InboxPage';

const routes = (
  <Switch>
    <Route exact path="/" key="/intro">
      <App />
    </Route>
    <Route exact path="/letters" key="/preview">
      <InboxPage />
    </Route>
    ,
  </Switch>
);

export default routes;
