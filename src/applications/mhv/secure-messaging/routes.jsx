import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Breadcrumbs from './components/shared/Breadcrumbs';
import Navigation from './components/Navigation';
import Compose from './containers/Compose';
import MessageDetails from './containers/MessageDetails';
import MessageReply from './containers/MessageReply';
import SearchMessages from './containers/SearchMessages';

const routes = (
  <div className="vads-l-grid-container">
    <div className="vads-l-row">
      <Breadcrumbs />
    </div>
    <div className="secure-messaging-container">
      <Navigation />
      <div>
        <Switch>
          <Route exact path="/" key="App">
            <App />
          </Route>
          <Route exact path="/compose" key="Compose">
            <Compose />
          </Route>
          <Route exact path="/message/:messageId" key="MessageDetails">
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
      </div>
    </div>
  </div>
);

export default routes;
