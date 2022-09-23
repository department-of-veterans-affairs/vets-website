import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { getMessageThread } from '../actions';
import AttachmentsList from './AttachmentsList';

const AllMessagesInThread = props => {
  const { messageId } = props;

  const dispatch = useDispatch();
  const { messageThread } = useSelector(state => state.messageThread);
  useEffect(
    () => {
      if (messageId) {
        // dispatch(getMessage('message', id)); // 7155731 is the only message id that we have a mock api call for, all others will display an error message
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
    // if (messageThread) {
    // console.log('message Thread: ', messageThread.message);
    messageThread.message.map(m => {
      // console.log('message: ', m);

      return <>{message(m)}</>;
    });
    // }
  };
  return (
    <div>
      {messageThread
        ? messageThread.message.map(m => {
            return <>{message(m)}</>;
          })
        : null}
      lasjdflj
      {/* {message(messageObj)} */}
      {messageThread ? messageThreadList() : null}
      {/* {messageThread
        ? messageThread.message.map(message => {
            return (
              <MessageDetailBlock key={`${message.id}`} message={message} />
            );
          })
        : null} */}
    </div>
  );
};

AllMessagesInThread.propTypes = {
  messageId: PropTypes.number,
};

export default AllMessagesInThread;
