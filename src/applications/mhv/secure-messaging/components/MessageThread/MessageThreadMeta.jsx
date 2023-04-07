import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const MessageThreadMeta = props => {
  const { message, from } = props;
  const {
    recipientName,
    // messageId, // confirming with UCD if messageId is still needed
    sentDate,
  } = message;

  return (
    <div className="message-thread-meta">
      <div>
        <p className="vads-u-font-weight--bold" data-testid="message-date">
          {dateFormat(sentDate, 'MMMM D, YYYY [at] h:mm a z')}
        </p>
        <p className="vads-u-padding-right--2" data-testid="from">
          <strong>From: </strong>
          {from}
        </p>
        <p className="vads-u-padding-right--2" data-testid="to">
          <strong>To: </strong>
          {recipientName}
        </p>
      </div>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  from: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
};

export default MessageThreadMeta;
