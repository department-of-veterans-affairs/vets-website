import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Compose from './Compose';
import FolderListView from './FolderListView';
import Folders from './Folders';
import LandingPageAuth from './LandingPageAuth';
import MessageDetails from './MessageDetails';
import MessageReply from './MessageReply';
import SearchMessages from './SearchMessages';
import SearchResults from './SearchResults';

const AuthorizedRoutes = () => {
  return (
    <div className="vads-u-flex--fill">
      <Switch>
        <Route exact path="/" key="App">
          <LandingPageAuth />
        </Route>
        <Route exact path="/folders" key="Folders">
          <Folders />
        </Route>
        <Route exact path="/compose" key="Compose">
          <Compose />
        </Route>
        <Route exact path="/message/:messageId" key="MessageDetails">
          <MessageDetails />
        </Route>
        <Route exact path="/reply/:replyId" key="MessageReply">
          <MessageReply />
        </Route>
        <Route exact path="/search" key="SearchMessages">
          <SearchMessages />
        </Route>
        <Route exact path="/search/advanced" key="AdvancedSearch">
          <SearchMessages />
        </Route>
        <Route exact path="/search/results" key="SearchResults">
          <SearchResults />
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
        <Route
          path={['/sent', '/trash', '/drafts', '/folder/:folderId']}
          key="FolderListView"
        >
          <FolderListView />
        </Route>
      </Switch>
    </div>
  );
};

export default AuthorizedRoutes;
