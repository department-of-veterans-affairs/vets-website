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
import { Paths } from '../util/constants';

const AuthorizedRoutes = () => {
  return (
    <div className="vads-u-flex--fill" data-testid="secure-messaing">
      <ScrollToTop />
      <Switch>
        <Route exact path="/" key="App">
          <LandingPageAuth />
        </Route>
        <Route exact path={Paths.FOLDERS} key="Folders">
          <Folders />
        </Route>
        <Route exact path={Paths.COMPOSE} key="Compose">
          <Compose />
        </Route>
        <Route exact path={`${Paths.MESSAGE}:messageId/`} key="MessageDetails">
          <MessageDetails />
        </Route>
        <Route
          exact
          path={`${Paths.MESSAGE_THREAD}:threadId/`}
          key="ThreadDetails"
        >
          <ThreadDetails />
        </Route>
        <Route exact path={`${Paths.REPLY}:replyId/`} key="MessageReply">
          <MessageReply />
        </Route>
        <Route exact path={Paths.SEARCH_RESULTS} key="SearchResults">
          <SearchResults />
        </Route>
        <Route path={`${Paths.DRAFT}:draftId/`} key="Compose">
          <Compose />
        </Route>
        <Route path={`${Paths.SENT}:messageId/`} key="MessageDetails">
          <MessageDetails />
        </Route>
        <Route path={`${Paths.DELETED}:messageId/`} key="MessageDetails">
          <MessageDetails />
        </Route>
        <Route
          path={[
            Paths.INBOX,
            Paths.SENT,
            Paths.DELETED,
            Paths.DRAFTS,
            `${Paths.FOLDERS}:folderId/`,
          ]}
          key="FolderListView"
        >
          <FolderThreadListView />
        </Route>
      </Switch>
    </div>
  );
};

export default AuthorizedRoutes;
