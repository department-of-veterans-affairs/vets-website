import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { retrieveMessage, retrieveMessageHistory } from '../actions/messages';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';

const MessageReply = () => {
  const dispatch = useDispatch();
  const { replyId } = useParams();
  const { error } = useSelector(state => state.sm.draftDetails);
  const location = useLocation();
  const isDraftPage = location.pathname.includes('/draft');
  const replyMessage = useSelector(state => state.sm.draftDeatils.draftMessage);
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
    return <ReplyForm draftToEdit={null} replyMessage={replyMessage} />;
  };

  const thread = () => {
    return (
      <>
        {messageHistory?.length > 0 && (
          <MessageThread messageHistory={messageHistory} />
        )}
      </>
    );
  };

  return (
    <div className="vads-l-grid-container compose-container">
      <AlertBackgroundBox closeable />

      {content()}
      {replyMessage && thread()}
    </div>
  );
};

export default MessageReply;
