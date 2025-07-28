import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { MhvPageNotFoundContent } from 'platform/mhv/components/MhvPageNotFound';
import pilotManifest from '../pilot/manifest.json';
import ScrollToTop from '../components/shared/ScrollToTop';
import Compose from './Compose';
import Folders from './Folders';
import FolderThreadListView from './FolderThreadListView';
import ThreadDetails from './ThreadDetails';
import MessageReply from './MessageReply';
import SearchResults from './SearchResults';
import * as Constants from '../util/constants';
import manifest from '../manifest.json';
import SmBreadcrumbs from '../components/shared/SmBreadcrumbs';
import EditContactList from './EditContactList';
import InterstitialPage from './InterstitialPage';
import SelectHealthCareSystem from './SelectHealthCareSystem';
import { isPilotState } from '../selectors';

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

const AuthorizedRoutes = () => {
  const location = useLocation();
  const isPilot = useSelector(isPilotState);

  const cernerPilotSmFeatureFlag = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot],
  );

  if (location.pathname === `/`) {
    const basePath = `${
      cernerPilotSmFeatureFlag && isPilot
        ? pilotManifest.rootUrl
        : manifest.rootUrl
    }${Paths.INBOX}`;
    window.location.replace(basePath);
    return <></>;
  }

  return (
    <div
      className="vads-l-col--12
      medium-screen:vads-l-col--9"
      data-testid="secure-messaging"
    >
      <ScrollToTop />
      <Routes>
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

        {isPilot && (
          <AppRoute
            exact
            path={`${Paths.COMPOSE}${Paths.START_MESSAGE}`}
            key="Compose"
          >
            <Compose skipInterstitial />
          </AppRoute>
        )}
        {isPilot && (
          <AppRoute
            exact
            path={`${Paths.COMPOSE}${Paths.SELECT_HEALTH_CARE_SYSTEM}`}
            key="SelectHealthCareSystem"
          >
            <SelectHealthCareSystem />
          </AppRoute>
        )}
        {isPilot && (
          <AppRoute exact path={Paths.COMPOSE} key="InterstitialPage">
            <InterstitialPage />
          </AppRoute>
        )}
        {!isPilot && (
          <AppRoute exact path={Paths.COMPOSE} key="Compose">
            <Compose />
          </AppRoute>
        )}
        <Route>
          <MhvPageNotFoundContent />
        </Route>
      </Routes>
    </div>
  );
};

export default AuthorizedRoutes;
