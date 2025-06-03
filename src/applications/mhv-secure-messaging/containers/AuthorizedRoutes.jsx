import React from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
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
import SelectHealthCareSystem from './SelectHealthCareSystem';

const { Paths } = Constants;

// Component to wrap children with breadcrumbs
const BreadcrumbsWrapper = ({ children }) => (
  <>
    <SmBreadcrumbs />
    {children}
  </>
);

BreadcrumbsWrapper.propTypes = {
  children: PropTypes.node,
};

const AuthorizedRoutes = () => {
  const location = useLocation();
  const isPilot = useSelector(state => state.sm.app.isPilot);

  if (location.pathname === `/`) {
    // Use just the inbox path to avoid doubling the rootUrl
    return <Navigate to={Paths.INBOX} replace />;
  }

  return (
    <div
      className="vads-l-col--12
      medium-screen:vads-l-col--9"
      data-testid="secure-messaging"
    >
      {' '}
      <ScrollToTop />
      <Routes>
        <Route
          path={Paths.FOLDERS}
          element={
            <BreadcrumbsWrapper>
              <Folders />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={Paths.INBOX}
          element={
            <BreadcrumbsWrapper>
              <FolderThreadListView />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={Paths.SENT}
          element={
            <BreadcrumbsWrapper>
              <FolderThreadListView />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={Paths.DELETED}
          element={
            <BreadcrumbsWrapper>
              <FolderThreadListView />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={Paths.DRAFTS}
          element={
            <BreadcrumbsWrapper>
              <FolderThreadListView />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={`${Paths.FOLDERS}:folderId/`}
          element={
            <BreadcrumbsWrapper>
              <FolderThreadListView />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={`${Paths.MESSAGE_THREAD}:threadId/`}
          element={
            <BreadcrumbsWrapper>
              <ThreadDetails />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={`${Paths.REPLY}:replyId/`}
          element={
            <BreadcrumbsWrapper>
              <MessageReply />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={Paths.SEARCH_RESULTS}
          element={
            <BreadcrumbsWrapper>
              <SearchResults />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={`${Paths.DRAFT}:draftId/`}
          element={
            <BreadcrumbsWrapper>
              <Compose />
            </BreadcrumbsWrapper>
          }
        />
        <Route
          path={Paths.CONTACT_LIST}
          element={
            <BreadcrumbsWrapper>
              <EditContactList />
            </BreadcrumbsWrapper>
          }
        />

        {isPilot && (
          <Route
            path={`${Paths.COMPOSE}${Paths.START_MESSAGE}`}
            element={
              <BreadcrumbsWrapper>
                <Compose skipInterstitial />
              </BreadcrumbsWrapper>
            }
          />
        )}
        {isPilot && (
          <Route
            path={`${Paths.COMPOSE}${Paths.SELECT_HEALTH_CARE_SYSTEM}`}
            element={
              <BreadcrumbsWrapper>
                <SelectHealthCareSystem />
              </BreadcrumbsWrapper>
            }
          />
        )}
        {isPilot && (
          <Route
            path={Paths.COMPOSE}
            element={
              <BreadcrumbsWrapper>
                <InterstitialPage />
              </BreadcrumbsWrapper>
            }
          />
        )}
        {!isPilot && (
          <Route
            path={Paths.COMPOSE}
            element={
              <BreadcrumbsWrapper>
                <Compose />
              </BreadcrumbsWrapper>
            }
          />
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default AuthorizedRoutes;
