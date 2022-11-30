import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

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
              {editingEnabled && (
                <>
                  <i className="fas fa-paperclip" aria-hidden="true" />
                  <div className="editable-attachment">
                    <span>
                      {file.name} ({getSize(file.size || file.attachmentSize)})
                    </span>
                    <va-button
                      onClick={() => removeAttachment(file.name)}
                      secondary
                      text="Remove"
                      class="remove-attachment-button"
                    />
                  </div>
                </>
              )}
              {!editingEnabled && (
                <>
                  <i className="fas fa-paperclip" aria-hidden="true" />
                  <a
                    href={`${
                      environment.API_URL
                    }/my_health/v1/messaging/messages/${
                      file.messageId
                    }/attachments/${file.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file.name} ({getSize(file.size || file.attachmentSize)})
                  </a>
                </>
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
