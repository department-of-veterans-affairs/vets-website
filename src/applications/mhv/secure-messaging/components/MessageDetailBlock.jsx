import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useHistory } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import MessageActionButtons from './MessageActionButtons';
import AttachmentsList from './AttachmentsList';
import PrintMessageThread from './PrintMessageThread';
import { dateFormat } from '../util/helpers';

const MessageDetailBlock = props => {
  const {
    messageId,
    category,
    subject,
    body,
    sentDate,
    senderName,
    recipientName,
    attachments,
  } = props.message;

  const history = useHistory();
  const sentReplyDate = format(new Date(sentDate), 'MM-dd-yyyy');
  const CannotReplyDate = addDays(new Date(sentReplyDate), 45);
  const casedCategory = capitalize(category);
  const [printThread, setPrintThread] = useState('dont-print-thread');
  const [hideReplyButton, setReplyButton] = useState(false);

  const handleReplyButton = useCallback(
    () => {
      history.push('/reply');
    },
    [history],
  );

  useEffect(
    () => {
      if (new Date() > CannotReplyDate) {
        setReplyButton(true);
      }
    },
    [CannotReplyDate, hideReplyButton, sentReplyDate, sentDate],
  );

  const handlePrintThreadStyleClass = option => {
    if (option === 'print thread') {
      setPrintThread('print-thread');
    }
    if (option !== 'print thread') {
      setPrintThread('dont-print-thread');
    }
  };

  return (
    <section className="message-detail-block">
      <header className="vads-u-display--flex vads-u-flex-direction--row message-detail-header">
        <h2
          className="vads-u-margin-top--1 vads-u-margin-bottom--2"
          aria-label={`Message subject. ${casedCategory}: ${subject}`}
        >
          {casedCategory}: {subject}
        </h2>
        {!hideReplyButton && (
          <button
            type="button"
            onClick={handleReplyButton}
            className="send-button-top medium-screen:vads-u-padding-right--2"
          >
            <i className="fas fa-reply" aria-hidden="true" />
            <span className="reply-button-top-text">Reply</span>
          </button>
        )}
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
            {dateFormat(sentDate)}
          </p>
          <p>
            <strong>Message ID: </strong>
            {messageId}
          </p>
        </section>

        <section className="message-body" aria-label="Message body.">
          <pre>{body}</pre>
        </section>

        {!!attachments &&
          attachments.length > 0 && (
            <>
              <div className="message-body-attachments-label">
                <strong>Attachments</strong>
              </div>
              <AttachmentsList attachments={attachments} />
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

        <MessageActionButtons
          id={messageId}
          handlePrintThreadStyleClass={handlePrintThreadStyleClass}
          onReply={handleReplyButton}
        />
      </main>
      <div className={printThread}>
        <PrintMessageThread messageId={messageId} />
      </div>
    </section>
  );
};

MessageDetailBlock.propTypes = {
  message: PropTypes.object,
};

export default MessageDetailBlock;
