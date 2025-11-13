import React, { useEffect } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { MhvPageNotFoundContent } from 'platform/mhv/components/MhvPageNotFound';
import ScrollToTop from '../components/shared/ScrollToTop';
import Compose from './Compose';
import Folders from './Folders';
import FolderThreadListView from './FolderThreadListView';
import ThreadDetails from './ThreadDetails';
import MessageReply from './MessageReply';
import SearchResults from './SearchResults';
import * as Constants from '../util/constants';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import EditContactList from './EditContactList';
import InterstitialPage from './InterstitialPage';
import SelectCareTeam from './SelectCareTeam';
import CareTeamHelp from './CareTeamHelp';
import { clearDraftInProgress } from '../actions/threadDetails';
import featureToggles from '../hooks/useFeatureToggles';
import RecentCareTeams from './RecentCareTeams';

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

const { Paths } = Constants;

// TODO: Curated List - update safe paths with all new urls for composing a message
const draftInProgressSafePaths = [
  `${Paths.COMPOSE}${Paths.START_MESSAGE}`,
  `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
  `${Paths.COMPOSE}${Paths.RECENT_CARE_TEAMS}`,
  new RegExp(`^${Paths.MESSAGE_THREAD}[^/]+/?$`),
  Paths.COMPOSE,
  Paths.CONTACT_LIST,
];

const AuthorizedRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { mhvSecureMessagingCuratedListFlow } = featureToggles();

  useEffect(
    () => {
      const isDraftSafe = draftInProgressSafePaths.some(
        path =>
          path instanceof RegExp
            ? path.test(location.pathname)
            : location.pathname.startsWith(path),
      );
      if (!isDraftSafe) {
        dispatch(clearDraftInProgress());
      }
    },
    [location.pathname, dispatch],
  );

  if (location.pathname === `/`) {
    return <Redirect to={Paths.INBOX} />;
  }

  return (
    <div
      className="vads-l-col--12
      medium-screen:vads-l-col--9"
      data-testid="secure-messaging"
    >
      <ScrollToTop />
      <Switch>
        <AppRoute exact path={Paths.FOLDERS} key="Folders">
          <Folders />
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
        <AppRoute exact path={Paths.CONTACT_LIST} key="EditContactList">
          <EditContactList />
        </AppRoute>

        {mhvSecureMessagingCuratedListFlow && (
          <AppRoute
            exact
            path={`${Paths.COMPOSE}${Paths.START_MESSAGE}`}
            key="Compose"
          >
            <Compose />
          </AppRoute>
        )}
        {mhvSecureMessagingCuratedListFlow && (
          <AppRoute exact path={Paths.RECENT_CARE_TEAMS} key="RecentCareTeams">
            <RecentCareTeams />
          </AppRoute>
        )}
        {mhvSecureMessagingCuratedListFlow && (
          <AppRoute
            exact
            path={`${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`}
            key="SelectCareTeam"
          >
            <SelectCareTeam />
          </AppRoute>
        )}
        {mhvSecureMessagingCuratedListFlow && (
          <AppRoute exact path={Paths.COMPOSE} key="InterstitialPage">
            <InterstitialPage />
          </AppRoute>
        )}
        {!mhvSecureMessagingCuratedListFlow && (
          <AppRoute exact path={Paths.COMPOSE} key="Compose">
            <Compose />
          </AppRoute>
        )}
        {mhvSecureMessagingCuratedListFlow && (
          <AppRoute exact path={Paths.CARE_TEAM_HELP} key="CareTeamHelp">
            <CareTeamHelp />
          </AppRoute>
        )}
        <Route>
          <MhvPageNotFoundContent />
        </Route>
      </Switch>
    </div>
  );
};

export default AuthorizedRoutes;
