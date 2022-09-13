import React from 'react';
import PropTypes from 'prop-types';

const AttachmentsList = props => {
  const { attachments, setAttachments, editingEnabled } = props;

  const getSize = num => {
    if (num > 999999) {
      return `${(num / 1000000).toFixed(1)} MB`;
    }
    return `${Math.floor(num / 1000)} KB`;
  };

  const removeAttachment = name => {
    const newAttArr = attachments.filter(item => item.name !== name);
    setAttachments(newAttArr);
  };

  return (
    <div>
      {' '}
      <ul className="attachments-list">
        {!!attachments.length &&
          attachments.map(file => (
            <li key={file.name}>
              <i className="fas fa-paperclip" aria-hidden="true" />
              {editingEnabled && (
                <div>
                  <strong>
                    {file.name} ({getSize(file.size || file.attachmentSize)})
                  </strong>
                  <button
                    type="button"
                    className="link-button remove-attachment-button"
                    onClick={() => removeAttachment(file.name)}
                  >
                    <i className="fas fa-times" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              )}
              {!editingEnabled && (
                <a href="/">
                  {file.name} ({getSize(file.size || file.attachmentSize)})
                </a>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

AttachmentsList.propTypes = {
  attachments: PropTypes.array,
  editingEnabled: PropTypes.bool,
  setAttachments: PropTypes.func,
};

export default AttachmentsList;
