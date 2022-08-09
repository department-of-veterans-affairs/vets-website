import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import App from './containers/App';
import Compose from './containers/Compose';
import MessageReply from './containers/MessageReply.jsx';

const routes = (
  <Switch>
    <Route path="/" component={App} />
    <Route path="/compose" component={Compose} />
    <Route path="/reply" component={MessageReply} />
    <Route path="/nav" component={Navigation} />
  </Switch>
);

export default routes;
