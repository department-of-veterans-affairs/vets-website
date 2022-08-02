import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App.jsx';
import MessageReply from './containers/MessageReply.jsx';

const routes = (
  <Switch>
    <Route path="/" component={App} />
    <Route path="/compose/" component={App} />
    <Route path="/reply/" component={MessageReply} />
  </Switch>
);

export default routes;
