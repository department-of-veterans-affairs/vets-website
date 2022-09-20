import React from 'react';
import PropTypes from 'prop-types';
import AttachmentsList from '../AttachmentsList';

const MessageThreadAttachments = props => {
  return (
    props.expanded &&
    !!props.attachments && (
      <div className="message-thread-attachments">
        <div className="message-body-attachments-label">
          <strong>Attachments</strong>
        </div>
        <AttachmentsList attachments={props.attachments} />
      </div>
    )
  );
};

MessageThreadAttachments.propTypes = {
  attachments: PropTypes.object,
  expanded: PropTypes.bool,
};

export default MessageThreadAttachments;
