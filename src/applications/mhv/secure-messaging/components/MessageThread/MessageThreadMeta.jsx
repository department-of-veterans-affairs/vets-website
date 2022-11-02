import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const MessageThreadMeta = props => {
  const { message, isRead } = props;
  return (
    <div className="message-thread-meta vads-u-padding-bottom--1">
      <p data-testid="from" style={{ fontWeight: !isRead ? 'bold' : '' }}>
        <strong>From: </strong>
        {message.senderName}
        {/* TODO no triage group name in response */}
        {props.expanded && message.triageGroupName
          ? ` (${message.triageGroupName})`
          : ''}
      </p>
      {props.expanded && (
        <>
          <p>
            <strong>To: </strong>
            {message.recipientName}
          </p>
          <p>
            <strong>Message ID: </strong>
            {message.messageId}
          </p>
        </>
      )}
      <p className="message-date">
        {message.attachment === true && (
          <i
            className="fas fa-paperclip vads-u-padding-right--0p5"
            label="paperclip"
            aria-label="Has attachment"
            role="img"
          />
        )}
        {dateFormat(message.sentDate, 'MMM d, YYYY [at] h:mm a z')}
      </p>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  expanded: PropTypes.bool,
  isRead: PropTypes.bool,
  message: PropTypes.object,
};

export default MessageThreadMeta;
