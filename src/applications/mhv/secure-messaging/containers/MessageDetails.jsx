import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui/index';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessage, retrieveMessageThread } from '../actions/messages';
import MessageDetailBlock from '../components/MessageDetailBlock';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import AlertBox from '../components/shared/AlertBox';
import { closeAlert } from '../actions/alerts';
import * as Constants from '../util/constants';

const MessageDetail = () => {
  const { messageId, threadId } = useParams();
  const dispatch = useDispatch();
  const alert = useSelector(state => state.sm.alerts.alert);
  const message = useSelector(state => state.sm.messageDetails.message);
  const messageHistory = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const isTrash = window.location.pathname.includes('/trash');
  const isSent = window.location.pathname.includes('/sent');
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const location = useLocation();
  const history = useHistory();
  const [cannotReplyAlert, setcannotReplyAlert] = useState(true);
  const header = useRef();

  useEffect(
    () => {
      if (activeFolder?.folderId === Constants.DefaultFolders.DRAFTS.id) {
        history.push(`/draft/${messageId}`);
      }

      if (messageId) {
        dispatch(closeAlert()); // to clear out any past alerts before landing this page
        dispatch(retrieveMessage(messageId));
      }

      if (threadId) {
        dispatch(closeAlert());
        dispatch(retrieveMessageThread(threadId));
      }
    },
    [dispatch, location, messageId, activeFolder, history, threadId],
  );

  useEffect(
    () => {
      if (alert?.header !== null) {
        setcannotReplyAlert(cannotReplyAlert);
      }
    },
    [cannotReplyAlert, alert?.header],
  );

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

  useEffect(
    () => {
      focusElement(header.current);
    },
    [header],
  );

  let pageTitle;

  if (isSent) {
    pageTitle = 'Sent messages';
  } else if (isTrash) {
    pageTitle = 'Trash';
  } else {
    pageTitle = 'Message';
  }

  return (
    <div className="vads-l-grid-container message-detail-container">
      {/* Only display this type of alert when it contains a header */}
      {cannotReplyAlert ? <AlertBox /> : <AlertBackgroundBox closeable />}
      {pageTitle === 'Message' ? null : (
        <h1 className="vads-u-margin-top--2" ref={header}>
          {pageTitle}
        </h1>
      )}

      {message === undefined && (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      )}

      {message === null ||
        (message === false && (
          <va-alert status="error" visible class="vads-u-margin-y--9">
            <h2 slot="headline">
              We’re sorry. Something went wrong on our end
            </h2>
            <p>
              You can’t view your secure message because something went wrong on
              our end. Please check back soon.
            </p>
          </va-alert>
        ))}

      {message &&
        (messageId || threadId) && (
          <>
            {/* <NavigationLinks messageId={messageId} /> */}
            <MessageDetailBlock message={message} />
            <MessageThread
              messageHistory={messageHistory}
              threadId={threadId}
            />
          </>
        )}
    </div>
  );
};

export default MessageDetail;
