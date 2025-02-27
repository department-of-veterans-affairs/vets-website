import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
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
import { clearFolder, retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import ThreadsList from '../components/ThreadList/ThreadsList';
import { getListOfThreads, setThreadSortOrder } from '../actions/threads';
import SearchResults from './SearchResults';
import { clearSearchResults } from '../actions/search';
import {
  convertPathNameToTitleCase,
  scrollTo,
  getPageTitle,
} from '../util/helpers';

const FolderThreadListView = props => {
  const { testing } = props;
  const dispatch = useDispatch();
  const error = null;
  const threadsPerPage = THREADS_PER_PAGE_DEFAULT;
  const { threadList, isLoading } = useSelector(state => state.sm.threads);
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
  const removeLandingPageFF = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingRemoveLandingPage
      ],
  );

  const displayingNumberOfThreadsSelector =
    "[data-testid='displaying-number-of-threads']";

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
    [dispatch, threadSort, threadsPerPage],
  );

  const handleSortCallback = sortOrderValue => {
    retrieveListOfThreads({
      sortFolderId: folderId,
      value: sortOrderValue,
      page: 1,
    });
    waitForRenderThenFocus(displayingNumberOfThreadsSelector, document, 500);
  };

  const handlePagination = page => {
    scrollTo(document.querySelector('h1'));
    retrieveListOfThreads({
      sortFolderId: threadSort.folderId,
      value: threadSort.value,
      page,
    });
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
      if (folderId !== (null || undefined)) {
        if (folder.name === convertPathNameToTitleCase(location.pathname)) {
          const pageTitleTag = getPageTitle({
            removeLandingPageFF,
            folderName: folder.name,
          });
          updatePageTitle(pageTitleTag);
        }
        if (folderId !== threadSort?.folderId) {
          let sortOption = threadSortingOptions.SENT_DATE_DESCENDING.value;
          if (location.pathname === Paths.DRAFTS) {
            sortOption = threadSortingOptions.DRAFT_DATE_DESCENDING.value;
          }
          retrieveListOfThreads({
            sortFolderId: folderId,
            value: sortOption,
            page: 1,
          });
        }

        if (folderId !== searchFolder?.folderId) {
          dispatch(clearSearchResults());
        }
      }
    },
    [
      folderId,
      dispatch,
      retrieveListOfThreads,
      folder?.name,
      location?.pathname,
      threadSort?.folderId,
      threadSort?.value,
      threadSort?.page,
      searchFolder?.folderId,
      threadList?.length,
    ],
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
    if (folderId !== null) {
      dispatch(
        getListOfThreads(
          threadSort.folderId,
          threadsPerPage,
          threadSort.page,
          threadSort.value,
          true,
        ),
      );
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
          folderId === undefined && <LoadingIndicator />
        )}
        {folderId !== undefined && (
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
