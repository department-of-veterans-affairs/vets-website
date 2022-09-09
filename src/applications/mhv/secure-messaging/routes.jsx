import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Compose from './containers/Compose';
import MessageDetails from './containers/MessageDetails';
import MessageReply from './containers/MessageReply';
import SearchMessages from './containers/SearchMessages';

const routes = (
  <Switch>
    <Route exact path="/" key="App">
      <App />
    </Route>
    <Route exact path="/compose" key="Compose">
      <Compose />
    </Route>
    <Route path="/message/:messageId" key="MessageDetails">
      <MessageDetails />
    </Route>
    <Route exact path="/reply" key="MessageReply">
      <MessageReply />
    </Route>
    <Route exact path="/search" key="SearchMessages">
      <SearchMessages />
    </Route>
    <Route path="/draft/:draftId" key="Compose">
      <Compose />
    </Route>
    <Route path="/sent/:messageId" key="MessageDetails">
      <MessageDetails />
    </Route>
    <Route path="/trash/:messageId" key="MessageDetails">
      <MessageDetails />
    </Route>
  </Switch>
);

export default routes;
