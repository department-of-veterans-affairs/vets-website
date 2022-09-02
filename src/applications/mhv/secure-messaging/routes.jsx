import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Compose from './containers/Compose';
import MessageDetail from './containers/MessageDetails';
import MessageReply from './containers/MessageReply';
import SearchMessages from './containers/SearchMessages';

const routes = (
  <Switch>
    <Route path="/" component={App} />
    <Route path="/compose" component={Compose} />
    <Route path="/message" component={MessageDetail} />
    <Route path="/reply" component={MessageReply} />
    <Route path="/search" component={SearchMessages} />
    <Route path="/draft/:draftId" component={Compose} />
    <Route path="/sent/:messageId" component={MessageDetail} />
    <Route path="/trash/:messageId" component={MessageDetail} />
  </Switch>
);

export default routes;
