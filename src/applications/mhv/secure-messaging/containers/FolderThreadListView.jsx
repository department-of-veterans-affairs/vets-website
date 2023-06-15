import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  focusElement,
  waitForRenderThenFocus,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  DefaultFolders as Folders,
  Alerts,
  Paths,
  threadSortingOptions,
} from '../util/constants';
import useInterval from '../hooks/use-interval';
import FolderHeader from '../components/MessageList/FolderHeader';
import { clearFolder, retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import ThreadsList from '../components/ThreadList/ThreadsList';
import {
  getListOfThreads,
  setThreadSortOrder,
  // resetThreadSortOrder,
} from '../actions/threads';
import ThreadListSort from '../components/ThreadList/ThreadListSort';
import SearchResults from './SearchResults';
// import { clearSearchResults } from '../actions/search';

const FolderThreadListView = props => {
  const { testing } = props;
  const dispatch = useDispatch();
  // const [folderId, setFolderId] = useState(null);
  const error = null;
  const threadsPerPage = 10;
  const { threadList, threadSort } = useSelector(state => state.sm.threads);
  const folder = useSelector(state => state.sm.folders?.folder);
  // const threads = useSelector(state => state.sm.threads?.threadList);
  const { searchResults, awaitingResults, keyword, query } = useSelector(
    state => state.sm.search,
  );
  const location = useLocation();
  const params = useParams();
  const [pageNum, setPageNum] = useState(1);
  // const { sortOrder, sortBy } = threadSort;

  const MAX_PAGE_LIST_LENGTH = 5;
  const displayingNumberOfThreadsSelector =
    "[data-testid='displaying-number-of-threads']";

  const handleSortCallback = sortOrderValue => {
    dispatch(setThreadSortOrder(sortOrderValue, folder.folderId));
    setPageNum(1);
    // dispatch(getListOfThreads(folderId, threadsPerPage, 1, sortOrderValue));
    waitForRenderThenFocus(displayingNumberOfThreadsSelector, document, 500);
  };

  const handlePagination = page => {
    setPageNum(page);
    dispatch(
      getListOfThreads(folder.folderId, threadsPerPage, page, threadSort.value),
    ).then(() => {
      focusElement(document.querySelector(displayingNumberOfThreadsSelector));
    });
  };

  useEffect(
    () => {
      // clear out folder reducer to prevent from previous folder data flashing
      // when navigating between folders
      if (!testing) dispatch(clearFolder());
      setPageNum(1);

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
          // dispatch(resetThreadSortOrder());
        }
      };
    },
    [dispatch, location.pathname, params.folderId],
  );

  // useEffect(
  //   () => {
  // code below is to be used if we decide to preserve search results when
  // navigating between messages in the same folder
  // searchFolder comes from  state.sm.search
  // if (folderId !== null && folderId !== searchFolder?.folderId) {
  //   dispatch(clearSearchResults());
  // }
  //   },
  //   [folder.folderId, dispatch],
  // );

  // useEffect(
  //   () => {
  //     if (threadSort.folderId === undefined && folder?.folderId !== undefined) {
  //       dispatch(
  //         setThreadSortOrder(
  //           threadSortingOptions.SENT_DATE_DESCENDING.value,
  //           folder.folderId,
  //         ),
  //       );
  //     }
  //   },
  //   [threadSort.folder, folder],
  // );

  useEffect(
    () => {
      if (folder?.folderId !== (null || undefined)) {
        if (folder.folderId !== threadSort?.folderId) {
          dispatch(
            setThreadSortOrder(
              threadSortingOptions.SENT_DATE_DESCENDING.value,
              folder.folderId,
            ),
          );
        } else {
          dispatch(setThreadSortOrder(threadSort.value, folder.folderId));
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
            1,
            threadSort.value,
          ),
        );
      }
    },
    [dispatch, threadSort.value, threadSort.folderId],
  );

  useEffect(
    () => {
      if (folder !== undefined) {
        focusElement(document.querySelector('h1'));
      }
    },
    [folder],
  );

  useInterval(() => {
    if (folder?.folderId !== null) {
      dispatch(
        getListOfThreads(
          folder.folderId,
          threadsPerPage,
          pageNum,
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

  const content = () => {
    if (
      (threadList === undefined && searchResults === undefined) ||
      awaitingResults
    ) {
      return <LoadingIndicator />;
    }

    if (threadList?.length === 0) {
      return (
        <>
          <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
            Displaying 0 of 0 conversations
          </div>
          <div className="vads-u-margin-top--3">
            <va-alert
              background-only="true"
              status="info"
              className="vads-u-margin-bottom--1 va-alert"
              data-testid="alert-no-messages"
            >
              <p className="vads-u-margin-y--0">{Alerts.Message.NO_MESSAGES}</p>
            </va-alert>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <va-alert status="error" visible>
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure messages because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }

    if (searchResults !== undefined) {
      return (
        <>
          <SearchResults />
        </>
      );
    }

    if (threadList.length > 0) {
      return (
        <>
          <ThreadListSort
            sortOrder={threadSort.value}
            sortCallback={handleSortCallback}
          />
          <ThreadsList
            threadList={threadList}
            folder={folder}
            pageNum={pageNum}
            threadsPerPage={threadsPerPage}
            sortOrder={threadSort.value}
          />
          {threadList?.length > 1 && (
            <VaPagination
              onPageSelect={e => handlePagination(e.detail.page)}
              page={pageNum}
              pages={Math.ceil(threadList[0]?.threadPageSize / threadsPerPage)}
              maxPageListLength={MAX_PAGE_LIST_LENGTH}
              showLastPage
            />
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="main-content">
        <AlertBackgroundBox closeable />
        {folder?.folderId === undefined && <LoadingIndicator />}
        {folder?.folderId !== undefined && (
          <>
            <FolderHeader
              folder={folder}
              searchProps={{ searchResults, awaitingResults, keyword, query }}
            />

            {content()}
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
