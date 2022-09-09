import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useHistory } from 'react-router-dom';
import MessageActionButtons from './MessageActionsButtons';
import AttachmentsList from './AttachmentsList';

const MessageDetailBlock = props => {
  const {
    attachments,
    body,
    category,
    id,
    recipientName,
    senderName,
    sentDate,
    subject,
  } = props.message;

  const history = useHistory();
  const casedCategory = capitalize(category);

  const handleReplyButton = useCallback(
    () => {
      history.push('/reply');
    },
    [history],
  );

  return (
    <section className="message-detail-block">
      <header className="vads-u-display--flex vads-u-flex-direction--row message-detail-header">
        <h2
          className="vads-u-margin-top--1 vads-u-margin-bottom--2"
          aria-label={`Message subject. ${casedCategory}: ${subject}`}
        >
          {casedCategory}: {subject}
        </h2>
        <button
          type="button"
          onClick={handleReplyButton}
          className="send-button-top medium-screen:vads-u-padding-right--2"
        >
          <i className="fas fa-reply" />
          <span className="reply-button-top-text">Reply</span>
        </button>
      </header>

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
              contacted. It may have been reassigned to efficiently address your
              original message
            </i>
          </p>
        </div>

        <MessageActionButtons id={id} />
      </main>
    </section>
  );
};

MessageDetailBlock.propTypes = {
  message: PropTypes.object,
};

export default MessageDetailBlock;
