import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const MessageThreadMeta = props => {
  return (
    <div className="message-thread-meta vads-u-padding-bottom--1">
      <p
        style={{
          fontWeight: !props.message.attributes.read_receipt ? 'bold' : '',
        }}
      >
        <strong>From: </strong>
        {props.message.attributes.sender_name}
        {props.expanded && props.message.attributes.triageGroupName
          ? ` (${props.message.attributes.triageGroupName})`
          : ''}
      </p>
      {props.expanded && (
        <>
          <p>
            <strong>To: </strong>
            {props.message.attributes.recipient_name}
          </p>
          <p>
            <strong>Message ID: </strong>
            {props.message.attributes.message_id}
          </p>
        </>
      )}
      <p className="message-date">
        {props.message.attributes.attachment === true && (
          <i
            className="fas fa-paperclip vads-u-padding-right--0p5"
            aria-hidden
          />
        )}
        {moment(props.message.attributes.sent_date).format(
          'MMM d, YYYY [at] h:mm a z',
        )}
      </p>
    </div>
  );
};

MessageThreadMeta.propTypes = {
  expanded: PropTypes.bool,
  message: PropTypes.object,
};

export default MessageThreadMeta;
