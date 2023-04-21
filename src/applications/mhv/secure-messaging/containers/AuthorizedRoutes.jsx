import React from 'react';
// import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
// import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import ScrollToTop from '../components/shared/ScrollToTop';
import Compose from './Compose';
// import FolderListView from './FolderListView';
import Folders from './Folders';
import FolderThreadListView from './FolderThreadListView';
import LandingPageAuth from './LandingPageAuth';
import MessageDetails from './MessageDetails';
import ThreadDetails from './ThreadDetails';
import MessageReply from './MessageReply';
import SearchResults from './SearchResults';

const AuthorizedRoutes = () => {
  // useEffect(() => {
  //   focusElement(document.querySelector('h1'));
  // });

  return (
    <div className="secure-messaging vads-u-flex--fill">
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
          {/* <FolderListView /> */}
          <FolderThreadListView />
        </Route>
      </Switch>
    </div>
  );
};

export default AuthorizedRoutes;
