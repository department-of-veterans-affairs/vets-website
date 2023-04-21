import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  DefaultFolders as Folders,
  Alerts,
  threadSortingOptions,
} from '../util/constants';
import useInterval from '../hooks/use-interval';
import FolderHeader from '../components/MessageList/FolderHeader';
import { clearFolder, retrieveFolder } from '../actions/folders';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import ThreadsList from '../components/ThreadList/ThreadsList';
import { getListOfThreads, clearListOfThreads } from '../actions/threads';

const FolderThreadListView = props => {
  const { testing } = props;
  const dispatch = useDispatch();
  const [folderId, setFolderId] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const error = null;
  // Currently the pagination has a bug that doesnt return the correct amount of results per page, as a temporary solution, the threadsPerPage is set to 100 to cover most folders without needing pagination.
  const threadsPerPage = 100;
  const threads = useSelector(state => state.sm.threads?.threadList);
  const folder = useSelector(state => state.sm.folders.folder);
  const location = useLocation();
  const params = useParams();
  const [pageNum, setPageNum] = useState(1);
  const [sortOrder, setSortOrder] = useState(threadSortingOptions.DESCENDING);
  const [sortBy, setSortBy] = useState(threadSortingOptions.SORT_BY_SENT_DATE);

  const handleThreadApiCall = () => {
    dispatch(
      getListOfThreads(folderId, threadsPerPage, pageNum, sortBy, sortOrder),
      true,
    );
  };

  useEffect(
    () => {
      if (folderId !== null) {
        dispatch(retrieveFolder(folderId)).then(() => {
          dispatch(
            getListOfThreads(
              folderId,
              threadsPerPage,
              pageNum,
              sortBy,
              sortOrder,
            ),
          );
        });
      }
      // on component unmount, clear out threads reducer to prevent from
      // previous threads results flashing when navigating between messages
      return () => dispatch(clearListOfThreads());
    },
    [folderId, dispatch, pageNum],
  );

  useEffect(
    () => {
      if (threads !== undefined) {
        focusElement(document.querySelector('h1'));
      }
    },
    [threads],
  );

  useEffect(
    () => {
      // clear out folder reducer to prevent from previous folder data flashing
      // when navigating between folders
      if (!testing) dispatch(clearFolder());
      if (location.pathname.includes('/folder')) {
        setFolderId(params.folderId);
      } else {
        switch (location.pathname) {
          case '/inbox':
            setFolderId(Folders.INBOX.id);
            break;
          case '/sent':
            setFolderId(Folders.SENT.id);
            break;
          case '/drafts':
            setFolderId(Folders.DRAFTS.id);
            break;
          case '/trash':
            setFolderId(Folders.DELETED.id);
            break;
          default:
            break;
        }
      }
    },
    [dispatch, location.pathname, params.folderId],
  );

  // clear out alerts if user navigates away from this component
  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
  );

  useInterval(() => {
    if (folderId) {
      dispatch(
        getListOfThreads(folderId, threadsPerPage, pageNum, sortBy, sortOrder),
        true,
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
    if (threads === undefined) {
      return <LoadingIndicator />;
    }

    if (threads.length === 0) {
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

    if (threads.length > 0) {
      return (
        <ThreadsList
          threadList={threads}
          folder={folder}
          folderId={folderId}
          setPageNum={setPageNum}
          pageNum={pageNum}
          setSortOrder={setSortOrder}
          setSortBy={setSortBy}
          handleThreadApiCall={handleThreadApiCall}
          threadsPerPage={threadsPerPage}
        />
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
            <FolderHeader folder={folder} />
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
