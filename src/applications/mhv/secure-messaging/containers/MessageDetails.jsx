import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import NavigationLinks from '../components/NavigationLinks';
import MessageThread from '../components/MessageThread/MessageThread';
import { retrieveMessage } from '../actions/messages';
import MessageDetailBlock from '../components/MessageDetailBlock';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { closeAlert } from '../actions/alerts';
import * as Constants from '../util/constants';

const MessageDetail = () => {
  const { messageId } = useParams();
  const dispatch = useDispatch();
  const message = useSelector(state => state.sm.messageDetails.message);
  const messageHistory = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const isTrash = window.location.pathname.includes('/trash');
  const isSent = window.location.pathname.includes('/sent');
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const location = useLocation();
  const history = useHistory();

  useEffect(
    () => {
      if (activeFolder?.folderId === Constants.DefaultFolders.DRAFTS.id) {
        history.push(`/draft/${messageId}`);
      }

      if (messageId) {
        dispatch(closeAlert()); // to clear out any past alerts before landing this page
        dispatch(retrieveMessage(messageId));
      }
    },
    [dispatch, location, messageId, activeFolder, history],
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
    <div className="vads-l-grid-container vads-u-margin-top--2 message-detail-container">
      <AlertBackgroundBox closeable />
      <h1 className="vads-u-margin-top--2">{pageTitle}</h1>

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
        messageId && (
          <>
            <NavigationLinks messageId={messageId} />
            <MessageDetailBlock message={message} />
            <MessageThread messageHistory={messageHistory} />
          </>
        )}
    </div>
  );
};

export default MessageDetail;
