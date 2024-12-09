import React from 'react';
import PropTypes from 'prop-types';
import AttachmentsList from '../AttachmentsList';
import HorizontalRule from '../shared/HorizontalRule';

const MessageThreadAttachments = props => {
  return (
    !!props.attachments && (
      <div className="message-thread-attachments">
        <HorizontalRule />
        <AttachmentsList
          attachments={props.attachments}
          forPrint={props.forPrint}
          attachmentScanError={false}
        />
      </div>
    )
  );
};

MessageThreadAttachments.propTypes = {
  attachments: PropTypes.array,
  forPrint: PropTypes.bool,
};

export default MessageThreadAttachments;
