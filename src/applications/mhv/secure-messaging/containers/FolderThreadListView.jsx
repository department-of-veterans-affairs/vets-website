import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  focusElement,
  waitForRenderThenFocus,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  DefaultFolders as Folders,
  Alerts,
  Paths,
  threadSortingOptions,
  PageTitles,
} from '../util/constants';
import useInterval from '../hooks/use-interval';
import FolderHeader from '../components/MessageList/FolderHeader';
import { clearFolder, retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import ThreadsList from '../components/ThreadList/ThreadsList';
import {
  getListOfThreads,
  setThreadPage,
  setThreadSortOrder,
} from '../actions/threads';
import SearchResults from './SearchResults';
import { clearSearchResults } from '../actions/search';
import { convertPathNameToTitleCase, updatePageTitle } from '../util/helpers';

const FolderThreadListView = props => {
  const { testing } = props;
  const dispatch = useDispatch();
  const error = null;
  const threadsPerPage = 10;
  const { threadList, threadSort, isLoading } = useSelector(
    state => state.sm.threads,
  );
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const folder = useSelector(state => state.sm.folders?.folder);
  const {
    searchFolder,
    searchResults,
    awaitingResults,
    keyword,
    query,
  } = useSelector(state => state.sm.search);

  const location = useLocation();
  const params = useParams();

  const mhvSecureMessagingBlockedTriageGroup1p0 = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingBlockedTriageGroup1p0
      ],
  );

  const { allTriageGroupsBlocked } = useSelector(state => state.sm.recipients);

  const displayingNumberOfThreadsSelector =
    "[data-testid='displaying-number-of-threads']";

  const handleSortCallback = sortOrderValue => {
    dispatch(setThreadSortOrder(sortOrderValue, folder.folderId, 1));
    waitForRenderThenFocus(displayingNumberOfThreadsSelector, document, 500);
  };

  const handlePagination = page => {
    dispatch(setThreadPage(page));
    waitForRenderThenFocus(displayingNumberOfThreadsSelector, document, 500);
  };

  useEffect(
    () => {
      // clear out folder reducer to prevent from previous folder data flashing
      // when navigating between folders
      if (!testing) dispatch(clearFolder());

      let id = null;
      if (params?.folderId) {
        id = params.folderId;
      } else {
        switch (location.pathname) {
          case Paths.INBOX:
            id = Folders.INBOX.id;
            break;
          case Paths.SENT:
            id = Folders.SENT.id;
            break;
          case Paths.DRAFTS:
            id = Folders.DRAFTS.id;
            break;
          case Paths.DELETED:
            id = Folders.DELETED.id;
            break;
          default:
            break;
        }
      }
      dispatch(retrieveFolder(id));

      return () => {
        // clear out alerts if user navigates away from this component
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [dispatch, location.pathname, params.folderId],
  );

  useEffect(
    () => {
      if (folder?.folderId !== (null || undefined)) {
        if (folder.name === convertPathNameToTitleCase(location.pathname)) {
          updatePageTitle(`${folder.name} ${PageTitles.PAGE_TITLE_TAG}`);
        }
        if (folder.folderId !== threadSort?.folderId) {
          dispatch(
            setThreadSortOrder(
              threadSortingOptions.SENT_DATE_DESCENDING.value,
              folder.folderId,
              1,
            ),
          );
          // updates page title
        } else {
          dispatch(
            setThreadSortOrder(
              threadSort.value,
              folder.folderId,
              threadSort.page,
            ),
          );
        }

        if (folder.folderId !== searchFolder?.folderId) {
          dispatch(clearSearchResults());
        }
      }
    },
    [folder?.folderId, dispatch],
  );

  useEffect(
    () => {
      if (
        folder?.folderId !== (null || undefined) &&
        threadSort.value !== null
      ) {
        dispatch(
          getListOfThreads(
            folder.folderId,
            threadsPerPage,
            threadSort.page,
            threadSort.value,
          ),
        );
      }
    },
    [dispatch, threadSort.value, threadSort.folderId, threadSort.page],
  );

  useEffect(
    () => {
      const alertVisible = alertList[alertList?.length - 1];
      const alertSelector =
        folder !== undefined && !alertVisible?.isActive
          ? 'h1'
          : alertVisible?.isActive && 'va-alert';
      focusElement(document.querySelector(alertSelector));
    },
    [alertList, folder],
  );

  useInterval(() => {
    if (folder?.folderId !== null) {
      dispatch(
        getListOfThreads(
          folder?.folderId,
          threadsPerPage,
          threadSort.page,
          threadSort.value,
          true,
        ),
      );
    }
  }, 60000);

  const LoadingIndicator = () => {
    return (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  const content = useMemo(
    () => {
      if (isLoading || awaitingResults) {
        return <LoadingIndicator />;
      }

      if (threadList?.length === 0) {
        return (
          <>
            {mhvSecureMessagingBlockedTriageGroup1p0 ? (
              !allTriageGroupsBlocked && (
                <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
                  Showing 0 of 0 conversations
                </div>
              )
            ) : (
              <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
                Showing 0 of 0 conversations
              </div>
            )}
            <div className="vads-u-margin-top--3">
              <va-alert
                background-only="true"
                status="info"
                className="vads-u-margin-bottom--1 va-alert"
                data-testid="alert-no-messages"
              >
                <p className="vads-u-margin-y--0">
                  {Alerts.Message.NO_MESSAGES}
                </p>
              </va-alert>
            </div>
          </>
        );
      }

      if (error) {
        return (
          <va-alert status="error" visible>
            <h2 slot="headline">
              We’re sorry. Something went wrong on our end
            </h2>
            <p>
              You can’t view your secure messages because something went wrong
              on our end. Please check back soon.
            </p>
          </va-alert>
        );
      }

      if (searchResults !== undefined) {
        return <SearchResults />;
      }

      if (threadList?.length > 0) {
        return (
          <>
            <ThreadsList
              threadList={threadList}
              folder={folder}
              pageNum={threadSort.page}
              paginationCallback={handlePagination}
              threadsPerPage={threadsPerPage}
              sortOrder={threadSort.value}
              sortCallback={handleSortCallback}
            />
          </>
        );
      }
      return null;
    },
    [
      awaitingResults,
      folder,
      handlePagination,
      handleSortCallback,
      isLoading,
      searchResults,
      threadList,
      threadSort.page,
      threadSort.value,
    ],
  );

  return (
    <div className="vads-u-padding--0">
      <div className="main-content vads-u-display--flex vads-u-flex-direction--column">
        <AlertBackgroundBox closeable />
        {folder === null ? (
          <></>
        ) : (
          folder?.folderId === undefined && <LoadingIndicator />
        )}
        {folder?.folderId !== undefined && (
          <>
            <FolderHeader
              folder={folder}
              threadCount={threadList?.length}
              searchProps={{ searchResults, awaitingResults, keyword, query }}
            />

            {content}
          </>
        )}
      </div>
    </div>
  );
};

FolderThreadListView.propTypes = {
  testing: PropTypes.any,
};

export default FolderThreadListView;
