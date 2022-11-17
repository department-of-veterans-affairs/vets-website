import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { retrieveMessage, retrieveMessageHistory } from '../actions/messages';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import EmergencyNote from '../components/EmergencyNote';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import { DefaultFolders } from '../util/constants';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';

const MessageReply = () => {
  const dispatch = useDispatch();
  const { replyId } = useParams();
  const activeFolder = useSelector(state => state.sm.folders.folder);
  const location = useLocation();
  const history = useHistory();
  const isDraftPage = location.pathname.includes('/draft');
  const { replyMessage, error } = useSelector(
    state => state.sm.messageDetails.message,
  );
  const messageHistory = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );

  useEffect(
    () => {
      // to prevent users from accessing draft edit view if directly hitting url path with messageId
      // in case that message no longer is a draft
      if (isDraftPage && activeFolder?.folderId !== DefaultFolders.DRAFTS.id) {
        history.push('/drafts');
      }
      dispatch(retrieveMessage(replyId, false));
      dispatch(retrieveMessageHistory(replyId));
      /* if (isDraftPage && draftId) {
        dispatch(retrieveMessage(draftId, true));
      } */
    },
    [isDraftPage, replyId, activeFolder, dispatch, history],
  );

  let pageTitle;

  if (isDraftPage) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Compose a reply';
  }

  const content = () => {
    if (!replyMessage) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (error) {
      return (
        <va-alert status="error" visible class="vads-u-margin-y--9">
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure message because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }
    return <ReplyForm replyMessage={replyMessage} />;
  };

  return (
    <div className="vads-l-grid-container compose-container">
      <AlertBackgroundBox closeable />
      <h1 className="page-title">{pageTitle}</h1>
      <EmergencyNote />
      <div>
        <BeforeMessageAddlInfo />
      </div>

      {content()}

      {messageHistory?.length > 0 && (
        <MessageThread messageHistory={[replyMessage, ...messageHistory]} />
      )}
    </div>
  );
};

export default MessageReply;
