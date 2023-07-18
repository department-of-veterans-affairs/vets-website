import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { useDispatch } from 'react-redux';
import MessageActionButtons from './MessageActionButtons';
import AttachmentsList from './AttachmentsList';
import { Categories, Paths, PageTitles } from '../util/constants';
import { dateFormat, updatePageTitle } from '../util/helpers';
import MessageThreadBody from './MessageThread/MessageThreadBody';
import { closeAlert } from '../actions/alerts';
import CannotReplyAlert from './shared/CannotReplyAlert';

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

  const categoryLabel = Categories[category];

  useEffect(
    () => {
      focusElement(document.querySelector('h1'));
      updatePageTitle(
        `${categoryLabel}: ${subject} ${PageTitles.PAGE_TITLE_TAG}`,
      );
    },
    [categoryLabel, message, subject],
  );

  return (
    <div className="message-detail-block">
      <header className="message-detail-header">
        <h1
          className="vads-u-margin-bottom--2"
          aria-label={`Message subject. ${categoryLabel}: ${subject}`}
          data-dd-privacy="mask"
        >
          {categoryLabel}: {subject}
        </h1>
        <CannotReplyAlert visible={cannotReply} />
      </header>
      <MessageActionButtons
        id={messageId}
        threadId={threadId}
        onReply={handleReplyButton}
        hideReplyButton={cannotReply}
      />
      <section
        className="message-detail-content"
        aria-label="Most recent message in this conversation"
      >
        <h2 className="sr-only">Most recent message in this conversation.</h2>
        <div
          className="message-metadata"
          data-testid="message-metadata"
          data-dd-privacy="mask"
        >
          <h3 className="sr-only">Message details.</h3>
          <p>
            <strong>From: </strong>
            <span data-dd-privacy="mask">
              {`${senderName} ${!fromMe ? `(${triageGroupName})` : ''}`}
            </span>
          </p>
          <p>
            <strong>To: </strong>
            <span data-dd-privacy="mask">{recipientName}</span>
          </p>
          <p>
            <strong>Date: </strong>
            <span data-dd-privacy="mask">{dateFormat(sentDate)}</span>
          </p>
          <p>
            <strong>Message ID: </strong>
            <span data-dd-privacy="mask">{messageId}</span>
          </p>
        </div>

        <div className="message-body" data-dd-privacy="mask">
          <h3 className="sr-only">Message body.</h3>
          <MessageThreadBody expanded text={body} />
        </div>

        {!!attachments &&
          attachments.length > 0 && (
            <>
              <h3 className="sr-only">Message attachments.</h3>
              <AttachmentsList attachments={attachments} />
            </>
          )}
      </section>
    </div>
  );
};
MessageDetailBlock.propTypes = {
  cannotReply: PropTypes.bool,
  message: PropTypes.object,
};

export default MessageDetailBlock;
