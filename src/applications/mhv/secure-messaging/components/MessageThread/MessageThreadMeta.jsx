import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const MessageThreadMeta = props => {
  const { message, isRead, expanded, hasAttachments } = props;

  const expandButton = () => {
    return (
      <div className="vads-u-flex--auto">
        <div className="vads-u-font-weight--bold" role="button">
          {expanded ? (
            <>
              <span>close</span>
              <i
                className="fas fa-angle-up vads-u-margin--0p5"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              <span>expand</span>
              <i
                className="fas fa-angle-down vads-u-margin--0p5"
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="message-thread-meta vads-u-padding-bottom--1">
      <div className="vads-u-display--flex">
        <p
          className="vads-u-flex--1 vads-u-padding-right--2"
          data-testid="from"
          style={{ fontWeight: !isRead ? 'bold' : '' }}
        >
          <strong>From: </strong>
          {message.senderName}
          {/* TODO no triage group name in response */}
          {props.expanded && message.triageGroupName
            ? ` (${message.triageGroupName})`
            : ''}
        </p>
        {expandButton()}
      </div>

      {props.expanded && (
        <>
          <p data-testid="to">
            <strong>To: </strong>
            {message.recipientName}
          </p>
          <p data-testid="message-id">
            <strong>Message ID: </strong>
            {message.messageId}
          </p>
        </>
      )}
      <p className="message-date" data-testid="message-date">
        {hasAttachments && (
          <i
            className="fas fa-paperclip vads-u-padding-right--0p5"
            label="paperclip"
            aria-label="Has attachment"
            role="img"
            data-testid="message-attachment-img"
          />
        )}
        {dateFormat(message.sentDate, 'MMMM D, YYYY [at] h:mm a z')}
      </p>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  expanded: PropTypes.bool,
  hasAttachments: PropTypes.bool,
  isRead: PropTypes.bool,
  message: PropTypes.object,
};

export default MessageThreadMeta;
