import React from 'react';
import PropTypes from 'prop-types';

const AttachmentsList = props => {
  const { attachments, editingEnabled } = props;

  return (
    <div>
      {' '}
      <ul className="attachments-list">
        {!!attachments.length &&
          attachments.map(attachment => (
            <li key={attachment.id}>
              <i className="fas fa-paperclip" />
              <div>
                {attachment.name} ({attachment.attachmentSize} KB)
                {editingEnabled && (
                  <button
                    type="button"
                    className="link-button remove-attachment-button"
                  >
                    <i className="fas fa-times" />
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

AttachmentsList.propTypes = {
  attachments: PropTypes.array,
  editingEnabled: PropTypes.bool,
};

export default AttachmentsList;
