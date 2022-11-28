import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { retrieveMessage, retrieveMessageHistory } from '../actions/messages';
import BeforeMessageAddlInfo from '../components/BeforeMessageAddlInfo';
import EmergencyNote from '../components/EmergencyNote';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';

const MessageReply = () => {
  const dispatch = useDispatch();
  const { replyId } = useParams();
  const { error } = useSelector(state => state.sm.draftDetails);
  const location = useLocation();
  const isDraftPage = location.pathname.includes('/draft');
  const replyMessage = useSelector(state => state.sm.messageDetails.message);
  const messageHistory = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );

  useEffect(
    () => {
      dispatch(retrieveMessage(replyId, false));
      dispatch(retrieveMessageHistory(replyId));
    },
    [isDraftPage, replyId, dispatch],
  );

  let pageTitle;

  if (isDraftPage) {
    pageTitle = 'Edit draft';
  } else {
    pageTitle = 'Compose a reply';
  }

  const content = () => {
    if (replyMessage === null) {
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
    return <ReplyForm draft={null} replyMessage={replyMessage} />;
  };

  const thread = () => {
    if (messageHistory?.length > 0) {
      return (
        <MessageThread messageHistory={[replyMessage, ...messageHistory]} />
      );
    }
    return <MessageThread messageHistory={[replyMessage]} />;
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

      {replyMessage && thread()}
    </div>
  );
};

export default MessageReply;
