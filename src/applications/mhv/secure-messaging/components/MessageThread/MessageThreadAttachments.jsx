import React from 'react';
import PropTypes from 'prop-types';
import AttachmentsList from '../AttachmentsList';

const MessageThreadAttachments = props => {
  return (
    props.expanded &&
    !!props.attachments && (
      <div className="message-thread-attachments">
        <div
          className="message-body-attachments-label vads-u-font-weight--bold"
          data-testid="message-body-attachments-label"
        >
          Attachments
        </div>
        <AttachmentsList attachments={props.attachments} />
      </div>
    )
  );
};

MessageThreadAttachments.propTypes = {
  attachments: PropTypes.array,
  expanded: PropTypes.bool,
};

export default MessageThreadAttachments;
