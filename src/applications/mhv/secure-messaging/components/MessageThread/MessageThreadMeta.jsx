import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const MessageThreadMeta = props => {
  const { message, fromMe } = props;
  const {
    recipientName,
    senderName,
    triageGroupName,
    // messageId, // confirming with UCD if messageId is still needed
    sentDate,
  } = message;

  return (
    <div className="message-thread-meta">
      <div>
        <p className="vads-u-font-weight--bold" data-testid="message-date">
          <span data-dd-privacy="mask">
            {dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}
          </span>
        </p>
        <p className="vads-u-padding-right--2" data-testid="from">
          <strong>From: </strong>
          <span data-dd-privacy="mask">
            {`${senderName} ${!fromMe ? `(${triageGroupName})` : ''}`}
          </span>
        </p>
        <p className="vads-u-padding-right--2" data-testid="to">
          <strong>To: </strong>
          <span data-dd-privacy="mask">{recipientName}</span>
        </p>
        <p data-testid="message-id">
          <strong>Message ID: </strong>
          <span data-dd-privacy="mask">{message.messageId}</span>
        </p>
      </div>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  fromMe: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
};

export default MessageThreadMeta;
