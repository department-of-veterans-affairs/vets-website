import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const AttachmentsList = props => {
  const { attachments, setAttachments, editingEnabled } = props;

  const getSize = num => {
    if (num > 999999) {
      return `${(num / 1000000).toFixed(1)} MB`;
    }
    if (num > 999) {
      return `${Math.floor(num / 1000)} KB`;
    }
    return `${num} B`;
  };

  const removeAttachment = file => {
    const newAttArr = attachments.filter(item => {
      if (item.name !== file.name) {
        return true;
      }
      return item.size !== file.size;
    });
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
                <div className="editable-attachment">
                  <span>
                    <i className="fas fa-paperclip" aria-hidden="true" />
                    {file.name} ({getSize(file.size || file.attachmentSize)})
                  </span>
                  <va-button
                    onClick={() => removeAttachment(file)}
                    secondary
                    text="Remove"
                    class="remove-attachment-button"
                  />
                </div>
              )}
              {!editingEnabled && (
                <>
                  <i className="fas fa-paperclip" aria-hidden="true" />
                  <a
                    className="attachment"
                    href={file.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      recordEvent({
                        event: 'cta-button-click',
                        'button-type': 'link',
                        'button-click-label': 'Attachment link',
                      });
                    }}
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
