import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import MessageActionButtons from './MessageActionButtons';
import AttachmentsList from './AttachmentsList';
import PrintMessageThread from './PrintMessageThread';
import { Categories } from '../util/constants';
import { dateFormat } from '../util/helpers';
import MessageThreadBody from './MessageThread/MessageThreadBody';

const MessageDetailBlock = props => {
  const {
    threadId,
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
  const cannotReplyDate = addDays(new Date(sentReplyDate), 45);
  const [printThread, setPrintThread] = useState('dont-print-thread');
  const [hideReplyButton, setReplyButton] = useState(false);

  const handleReplyButton = useCallback(
    () => {
      history.push(`/reply/${messageId}`);
    },
    [history, messageId],
  );

  useEffect(
    () => {
      if (new Date() > cannotReplyDate) {
        setReplyButton(true);
      }
    },
    [cannotReplyDate, hideReplyButton, sentReplyDate, sentDate],
  );

  const handlePrintThreadStyleClass = option => {
    if (option === 'print thread') {
      setPrintThread('print-thread');
    }
    if (option !== 'print thread') {
      setPrintThread('dont-print-thread');
    }
  };

  const categoryLabel = Categories[category];

  return (
    <section className="message-detail-block">
      <header className="message-detail-header">
        <h2
          className="vads-u-margin-bottom--2"
          aria-label={`Message subject. ${categoryLabel}: ${subject}`}
        >
          {categoryLabel}: {subject}
        </h2>
      </header>
      <MessageActionButtons
        id={messageId}
        threadId={threadId}
        handlePrintThreadStyleClass={handlePrintThreadStyleClass}
        onReply={handleReplyButton}
        hideReplyButton={hideReplyButton}
      />
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
          <MessageThreadBody expanded text={body} />
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
