import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { retrieveMessageThread } from '../actions/messages';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import ReplyForm from '../components/ComposeForm/ReplyForm';
import MessageThread from '../components/MessageThread/MessageThread';
import InterstitialPage from './InterstitialPage';

const MessageReply = () => {
  const dispatch = useDispatch();
  const { replyId } = useParams();
  const { drafts, error, messages } = useSelector(
    state => state.sm.threadDetails,
  );
  const replyMessage = messages?.length && messages[0];
  const [acknowledged, setAcknowledged] = useState(false);
  const recipients = useSelector(state => state.sm.recipients);
  const [isEditing, setIsEditing] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(
    () => {
      if (isSending === true) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    },
    [isSending],
  );

  useEffect(
    () => {
      dispatch(retrieveMessageThread(replyId));
    },
    [replyId, dispatch],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [acknowledged, replyMessage],
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

    return (
      <ReplyForm
        drafts={drafts || []}
        replyMessage={replyMessage}
        recipients={recipients}
        messages={messages}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setIsSending={setIsSending}
      />
    );
  };

  const thread = () => {
    return (
      <>
        <MessageThread messageHistory={messages} />
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
          <va-loading-indicator
            message="Sending message..."
            data-testid="sending-indicator"
            style={{ display: isSending ? 'block' : 'none' }}
          />
          <div
            className="vads-l-grid-container compose-container"
            style={{ display: isSending && 'none' }}
          >
            <AlertBackgroundBox closeable />
            {content()}
            {messages?.length && thread()}
          </div>
        </>
      )}
    </>
  );
};

export default MessageReply;
