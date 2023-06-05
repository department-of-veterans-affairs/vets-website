import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ScrollToTop from '../components/shared/ScrollToTop';
import Compose from './Compose';
import Folders from './Folders';
import FolderThreadListView from './FolderThreadListView';
import LandingPageAuth from './LandingPageAuth';
import MessageDetails from './MessageDetails';
import ThreadDetails from './ThreadDetails';
import MessageReply from './MessageReply';
import SearchResults from './SearchResults';

const AuthorizedRoutes = () => {
  return (
    <div className="vads-u-flex--fill" data-testid="secure-messaing">
      <ScrollToTop />
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
        <Route exact path="/thread/:threadId" key="ThreadDetails">
          <ThreadDetails />
        </Route>
        <Route exact path="/reply/:replyId" key="MessageReply">
          <MessageReply />
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
          path={['/inbox', '/sent', '/trash', '/drafts', '/folder/:folderId']}
          key="FolderListView"
        >
          <FolderThreadListView />
        </Route>
      </Switch>
    </div>
  );
};

export default AuthorizedRoutes;
