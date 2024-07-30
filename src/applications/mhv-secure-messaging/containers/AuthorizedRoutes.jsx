import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import ScrollToTop from '../components/shared/ScrollToTop';
import Compose from './Compose';
import Folders from './Folders';
import FolderThreadListView from './FolderThreadListView';
import LandingPageAuth from './LandingPageAuth';
import ThreadDetails from './ThreadDetails';
import MessageReply from './MessageReply';
import SearchResults from './SearchResults';
import { Paths } from '../util/constants';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import EditContactList from './EditContactList';

// Prepend SmBreadcrumbs to each route, except for PageNotFound
const AppRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}>
      <SmBreadcrumbs />
      {children}
    </Route>
  );
};

AppRoute.propTypes = {
  children: PropTypes.object,
};

const AuthorizedRoutes = () => {
  const contactListPage = useSelector(
    state => state.featureToggles.mhvSecureMessagingEditContactList,
  );
  return (
    <div
      className="vads-l-col--12
      medium-screen:vads-l-col--9"
      data-testid="secure-messaging"
    >
      <ScrollToTop />
      <Switch>
        <AppRoute exact path="/" key="App">
          <LandingPageAuth />
        </AppRoute>
        <AppRoute exact path={Paths.FOLDERS} key="Folders">
          <Folders />
        </AppRoute>
        <AppRoute exact path={Paths.COMPOSE} key="Compose">
          <Compose />
        </AppRoute>
        <AppRoute
          exact
          path={`${Paths.MESSAGE_THREAD}:threadId/`}
          key="ThreadDetails"
        >
          <ThreadDetails />
        </AppRoute>
        <AppRoute exact path={`${Paths.REPLY}:replyId/`} key="MessageReply">
          <MessageReply />
        </AppRoute>
        <AppRoute exact path={Paths.SEARCH_RESULTS} key="SearchResults">
          <SearchResults />
        </AppRoute>
        <AppRoute exact path={`${Paths.DRAFT}:draftId/`} key="Compose">
          <Compose />
        </AppRoute>
        <AppRoute
          exact
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
        </AppRoute>
        {contactListPage && (
          <AppRoute exact path={Paths.CONTACT_LIST} key="ContactList">
            <EditContactList />
          </AppRoute>
        )}
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </div>
  );
};

export default AuthorizedRoutes;
