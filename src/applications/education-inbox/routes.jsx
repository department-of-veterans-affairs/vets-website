import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import InboxPage from './containers/InboxPage';

// const routes =

const routes = (
  <Switch>
    <Route path="/" component={App} />,
    <Route exact path="/preview" component={InboxPage} key="/intro" />,
  </Switch>
);

export default routes;
