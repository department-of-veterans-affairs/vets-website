import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  focusElement,
  waitForRenderThenFocus,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import { updatePageTitle } from '@department-of-veterans-affairs/mhv/exports';
import {
  DefaultFolders as Folders,
  Alerts,
  Paths,
  threadSortingOptions,
  THREADS_PER_PAGE_DEFAULT,
} from '../util/constants';
import useInterval from '../hooks/use-interval';
import FolderHeader from '../components/MessageList/FolderHeader';
import { retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import ThreadsList from '../components/ThreadList/ThreadsList';
import Footer from '../components/Footer';
import { getListOfThreads, setThreadSortOrder } from '../actions/threads';
import SearchResults from './SearchResults';
import { clearSearchResults } from '../actions/search';
import {
  convertPathNameToTitleCase,
  scrollTo,
  getPageTitle,
} from '../util/helpers';

const FolderThreadListView = () => {
  const dispatch = useDispatch();
  const error = null;
  const threadsPerPage = THREADS_PER_PAGE_DEFAULT;
  const { threadList, isLoading, refetchRequired } = useSelector(
    state => state.sm.threads,
  );
  const threadSort = useSelector(state => state.sm.threads.threadSort);
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const folder = useSelector(state => state.sm.folders?.folder);
  const folderId = folder?.folderId;
  const {
    searchFolder,
    searchResults,
    awaitingResults,
    keyword,
    query,
  } = useSelector(state => state.sm.search);

  const location = useLocation();
  const params = useParams();

  const { noAssociations, allTriageGroupsBlocked } = useSelector(
    state => state.sm.recipients,
  );

  const displayingNumberOfThreadsSelector =
    "[data-testid='displaying-number-of-threads']";

  // Calculate folder ID based on current route
  const currentFolderId = useMemo(
    () => {
      if (params?.folderId) {
        return params.folderId;
      }

      const normalizedPath = location.pathname.endsWith('/')
        ? location.pathname
        : `${location.pathname}/`;
      const pathToFolderMap = {
        [Paths.INBOX]: Folders.INBOX.id,
        [Paths.SENT]: Folders.SENT.id,
        [Paths.DRAFTS]: Folders.DRAFTS.id,
        [Paths.DELETED]: Folders.DELETED.id,
      };

      return pathToFolderMap[normalizedPath];
    },
    [location.pathname, params?.folderId],
  );

  const retrieveListOfThreads = useCallback(
    ({
      sortFolderId = threadSort.folderId,
      perPage = threadsPerPage,
      page = threadSort.page,
      value = threadSort.value,
      update = false,
    }) => {
      dispatch(
        setThreadSortOrder({
          value,
          folderId: sortFolderId,
          page,
        }),
      );
      dispatch(getListOfThreads(sortFolderId, perPage, page, value, update));
    },
    [
      dispatch,
      threadSort.folderId,
      threadSort.page,
      threadSort.value,
      threadsPerPage,
    ],
  );

  const handleSortCallback = useCallback(
    sortOrderValue => {
      retrieveListOfThreads({
        sortFolderId: folderId,
        value: sortOrderValue,
        page: 1,
      });
      waitForRenderThenFocus(displayingNumberOfThreadsSelector, document, 500);
    },
    [folderId, retrieveListOfThreads],
  );

  const handlePagination = useCallback(
    page => {
      scrollTo(document.querySelector('h1'));
      retrieveListOfThreads({
        sortFolderId: threadSort.folderId,
        value: threadSort.value,
        page,
      });
      waitForRenderThenFocus(displayingNumberOfThreadsSelector, document, 500);
    },
    [retrieveListOfThreads, threadSort.folderId, threadSort.value],
  );

  useEffect(
    () => {
      dispatch(retrieveFolder(currentFolderId));

      return () => {
        // clear out alerts if user navigates away from this component
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [dispatch, currentFolderId, location.pathname],
  );

  // Effect to refetch threads when refetchRequired is true
  // Includes location.pathname to ensure refetch happens when navigating back to this view
  // Note: Use != null check for folderId because Inbox folder ID is 0 (falsy)
  useEffect(
    () => {
      if (
        refetchRequired &&
        threadSort.folderId != null &&
        threadSort.value &&
        threadSort.page
      )
        retrieveListOfThreads({
          sortFolderId: threadSort.folderId,
          perPage: threadsPerPage,
          page: threadSort.page,
          value: threadSort.value,
        });
    },
    [
      location.pathname,
      refetchRequired,
      retrieveListOfThreads,
      threadSort.folderId,
      threadSort.page,
      threadSort.value,
      threadsPerPage,
    ],
  );

  // Effect to retrieve threads when folder changes
  useEffect(
    () => {
      if (folderId != null && folderId !== threadSort.folderId) {
        let sortOption = threadSortingOptions.SENT_DATE_DESCENDING.value;
        if (folderId === Folders.DRAFTS.id) {
          sortOption = threadSortingOptions.DRAFT_DATE_DESCENDING.value;
        }
        retrieveListOfThreads({
          sortFolderId: folderId,
          value: sortOption,
          page: 1,
        });
      }
    },
    [folderId, threadSort.folderId, retrieveListOfThreads],
  );

  // Effect to update page title when folder name changes
  useEffect(
    () => {
      if (folder?.name === convertPathNameToTitleCase(location.pathname)) {
        const pageTitleTag = getPageTitle({
          folderName: folder.name,
        });
        updatePageTitle(pageTitleTag);
      }
    },
    [folder?.name, location?.pathname],
  );

  // Effect to clear search results when folder changes
  useEffect(
    () => {
      if (folderId !== searchFolder?.folderId) {
        dispatch(clearSearchResults());
      }
    },
    [folderId, searchFolder?.folderId, dispatch],
  );

  useEffect(
    () => {
      // Always focus on H1 per MHV accessibility decision records.
      // Alert content is announced via role="status" without stealing focus.
      if (folder !== undefined) {
        focusElement(document.querySelector('h1'));
      }
    },
    [alertList, folder],
  );

  useInterval(() => {
    if (folderId !== null) {
      retrieveListOfThreads({
        sortFolderId: threadSort.folderId,
        perPage: threadsPerPage,
        page: threadSort.page,
        value: threadSort.value,
        update: true,
      });
    }
  }, 60000); // 1 minute

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

      if (threadList?.length === 0 && threadSort?.page === 1) {
        return (
          <>
            {!noAssociations &&
              !allTriageGroupsBlocked && (
                <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
                  Showing 0 of 0 conversations
                </div>
              )}

            <div className="vads-u-margin-y--3">
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
      allTriageGroupsBlocked,
      awaitingResults,
      folder,
      handlePagination,
      handleSortCallback,
      isLoading,
      noAssociations,
      searchResults,
      threadList,
      threadSort.page,
      threadSort.value,
      threadsPerPage,
    ],
  );

  return (
    <div className="vads-u-padding--0">
      <div className="main-content vads-u-display--flex vads-u-flex-direction--column">
        {folder === null ? (
          /* Error state: show alert at top since there's no H1/content */
          <AlertBackgroundBox closeable />
        ) : (
          folderId === undefined && <LoadingIndicator />
        )}
        {folderId !== undefined && (
          <>
            <FolderHeader
              alertSlot={<AlertBackgroundBox closeable />}
              folder={folder}
              threadCount={threadList?.length}
              searchProps={{ searchResults, awaitingResults, keyword, query }}
            />

            {content}
            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default FolderThreadListView;
