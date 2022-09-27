import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getMessageThread } from '../actions';
import AttachmentsList from './AttachmentsList';

const AllMessagesInThread = props => {
  const { messageId } = props;

  const dispatch = useDispatch();
  const { messageThread } = useSelector(state => state.messageThread);
  const messageThreadCount = useRef(0);
  useEffect(
    () => {
      if (messageId) {
        dispatch(getMessageThread(messageId));
      }
    },
    [dispatch, messageId],
  );
  const message = messageProps => {
    const {
      attachments,
      body,
      id,
      recipientName,
      senderName,
      sentDate,
    } = messageProps;

    return (
      <section className="message-detail-block">
        <main className="message-detail-content">
          <section className="message-metadata" aria-label="message details.">
            <p>
              <strong>From: </strong>
              {senderName}
            </p>
            <p>
              <strong>To: </strong>
              {recipientName}
            </p>
            <p>
              <strong>Date: </strong>
              {sentDate}
            </p>
            <p>
              <strong>Message ID: </strong>
              {id}
            </p>
          </section>

          <section className="message-body" aria-label="Message body.">
            <pre>{body}</pre>
          </section>

          {!!attachments.attachment.length && (
            <>
              <div className="message-body-attachments-label">
                <strong>Attachments</strong>
              </div>
              <AttachmentsList attachments={attachments.attachment} />
            </>
          )}

          <div className="message-detail-note vads-u-text-align--center">
            <p>
              <i>
                Note: This message may not be from the person you intially
                contacted. It may have been reassigned to efficiently address
                your original message
              </i>
            </p>
          </div>
        </main>
      </section>
    );
  };

  const messageThreadList = () => {
    return (
      <div className="message-thread-list">
        {messageThread.message.map(m => {
          messageThreadCount.current += 1;
          return <>{message(m)}</>;
        })}
      </div>
    );
  };
  return <div>{messageThread ? messageThreadList() : null}</div>;
};

AllMessagesInThread.propTypes = {
  messageId: PropTypes.number,
};

export default AllMessagesInThread;
