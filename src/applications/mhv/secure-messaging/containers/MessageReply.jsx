import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { retrieveMessageThread } from '../actions/messages';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';
import InterstitialPage from './InterstitialPage';

const MessageReply = () => {
  const dispatch = useDispatch();
  const { replyId } = useParams();
  const { error } = useSelector(state => state.sm.draftDetails);
  const replyMessage = useSelector(state => state.sm.messageDetails.message);
  const messageHistory = useSelector(
    state => state.sm.messageDetails.messageHistory,
  );
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(
    () => {
      dispatch(retrieveMessageThread(replyId));
    },
    [replyId, dispatch],
  );

  const content = () => {
    if (replyMessage === undefined) {
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
    <>
      {!acknowledged ? (
        <InterstitialPage
          acknowledge={() => {
            setAcknowledged(true);
          }}
          type="reply"
        />
      ) : (
        <>
          <div className="vads-l-grid-container compose-container">
            <AlertBackgroundBox closeable />

            {content()}
            {replyMessage && thread()}
          </div>
        </>
      )}
    </>
  );
};

export default MessageReply;
