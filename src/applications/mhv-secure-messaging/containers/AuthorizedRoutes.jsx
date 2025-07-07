import React, { useEffect } from 'react';
import { Route, useLocation, Routes } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { MhvPageNotFoundContent } from 'platform/mhv/components/MhvPageNotFound';
import { useAppNavigate } from '../util/navigation';
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
import RouteWithBreadcrumbs from '../components/shared/RouteWithBreadcrumbs';
import EditContactList from './EditContactList';
import InterstitialPage from './InterstitialPage';
import SelectHealthCareSystem from './SelectHealthCareSystem';

const { Paths } = Constants;

const AuthorizedRoutes = () => {
  const location = useLocation();
  const navigate = useAppNavigate();
  const isPilot = useSelector(state => state.sm.app.isPilot);

  const cernerPilotSmFeatureFlag = useSelector(
    state =>
      state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot],
  );

  useEffect(
    () => {
      if (location.pathname === `/`) {
        const basePath = `${
          cernerPilotSmFeatureFlag && isPilot
            ? pilotManifest.rootUrl
            : manifest.rootUrl
        }${Paths.INBOX}`;
        navigate(basePath, { replace: true });
      }
    },
    [location.pathname, cernerPilotSmFeatureFlag, isPilot, navigate],
  );

  return (
    <div
      className="vads-l-col--12
      medium-screen:vads-l-col--9"
      data-testid="secure-messaging"
    >
      <ScrollToTop />
      <Routes>
        <Route
          path={Paths.FOLDERS}
          element={<RouteWithBreadcrumbs component={Folders} />}
        />

        <Route
          path={Paths.INBOX}
          element={<RouteWithBreadcrumbs component={FolderThreadListView} />}
        />
        <Route
          path={Paths.SENT}
          element={<RouteWithBreadcrumbs component={FolderThreadListView} />}
        />
        <Route
          path={Paths.DELETED}
          element={<RouteWithBreadcrumbs component={FolderThreadListView} />}
        />
        <Route
          path={Paths.DRAFTS}
          element={<RouteWithBreadcrumbs component={FolderThreadListView} />}
        />
        <Route
          path={`${Paths.FOLDERS}:folderId/`}
          element={<RouteWithBreadcrumbs component={FolderThreadListView} />}
        />
        <Route
          path={`${Paths.MESSAGE_THREAD}:threadId/`}
          element={<RouteWithBreadcrumbs component={ThreadDetails} />}
        />
        <Route
          path={`${Paths.REPLY}:replyId/`}
          element={<RouteWithBreadcrumbs component={MessageReply} />}
        />
        <Route
          path={Paths.SEARCH_RESULTS}
          element={<RouteWithBreadcrumbs component={SearchResults} />}
        />
        <Route
          path={`${Paths.DRAFT}:draftId/`}
          element={<RouteWithBreadcrumbs component={Compose} />}
        />
        <Route
          path={Paths.CONTACT_LIST}
          element={<RouteWithBreadcrumbs component={EditContactList} />}
        />

        {isPilot && (
          <Route
            path={`${Paths.COMPOSE}${Paths.START_MESSAGE}`}
            element={
              <RouteWithBreadcrumbs component={Compose} skipInterstitial />
            }
          />
        )}
        {isPilot && (
          <Route
            path={`${Paths.COMPOSE}${Paths.SELECT_HEALTH_CARE_SYSTEM}`}
            element={
              <RouteWithBreadcrumbs component={SelectHealthCareSystem} />
            }
          />
        )}
        {isPilot && (
          <Route
            path={Paths.COMPOSE}
            element={<RouteWithBreadcrumbs component={InterstitialPage} />}
          />
        )}
        {!isPilot && (
          <Route
            path={Paths.COMPOSE}
            element={<RouteWithBreadcrumbs component={Compose} />}
          />
        )}
        <Route path="*" element={<MhvPageNotFoundContent />} />
      </Routes>
    </div>
  );
};

export default AuthorizedRoutes;
