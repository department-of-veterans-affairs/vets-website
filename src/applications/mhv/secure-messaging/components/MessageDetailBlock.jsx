import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useDispatch } from 'react-redux';
import MessageActionButtons from './MessageActionButtons';
import ReplyButton from './ReplyButton';
import AttachmentsList from './AttachmentsList';
import { Categories, Paths } from '../util/constants';
import { dateFormat } from '../util/helpers';
import MessageThreadBody from './MessageThread/MessageThreadBody';
import { closeAlert } from '../actions/alerts';

const MessageDetailBlock = props => {
  const { message, cannotReply } = props;
  const {
    threadId,
    messageId,
    category,
    subject,
    body,
    sentDate,
    senderName,
    recipientName,
    triageGroupName,
    attachments,
  } = message;

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const sentReplyDate = format(new Date(sentDate), 'MM-dd-yyyy');
  const cannotReplyDate = addDays(new Date(sentReplyDate), 45);
  const [hideReplyButton, setReplyButton] = useState(false);
  const fromMe = recipientName === triageGroupName;

  const handleReplyButton = useCallback(
    () => {
      history.push(`${Paths.REPLY}${messageId}/`);
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

  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
  );

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
    },
    [message],
  );

  const categoryLabel = Categories[category];

  return (
    <section className="message-detail-block">
      <header className="message-detail-header">
        <h1
          className="vads-u-margin-bottom--2"
          aria-label={`Message subject. ${categoryLabel}: ${subject}`}
        >
          {categoryLabel}: {subject}
        </h1>
      </header>
      <MessageActionButtons id={messageId} threadId={threadId} />
      <main
        className="message-detail-content"
        aria-label="Most recent message in this conversation"
      >
        <section
          className="message-metadata"
          data-testid="message-metadata"
          aria-label="message details."
        >
          <p>
            <strong>From: </strong>
            {`${senderName} ${!fromMe ? `(${triageGroupName})` : ''}`}
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
      </main>
      <ReplyButton
        key="replyButton"
        visible={!cannotReply}
        onReply={handleReplyButton}
      />
    </section>
  );
};
MessageDetailBlock.propTypes = {
  cannotReply: PropTypes.bool,
  message: PropTypes.object,
  onReply: PropTypes.func,
};

export default MessageDetailBlock;
