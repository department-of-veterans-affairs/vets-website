import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

const AttachmentsList = props => {
  const { attachments, setAttachments, editingEnabled, compose } = props;
  const attachmentReference = useRef(null);

  const getSize = num => {
    if (num > 999999) {
      return `${(num / 1000000).toFixed(1)} MB`;
    }
    if (num > 999) {
      return `${Math.floor(num / 1000)} KB`;
    }
    return `${num} B`;
  };

  useEffect(
    () => {
      if (attachments?.length > 0 && compose) {
        attachmentReference.current?.focus();
      }
    },
    [attachments, compose],
  );

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
            <li key={file.name + file.size}>
              {editingEnabled && (
                <div className="editable-attachment vads-u-display--flex vads-u-flex-direction--row">
                  <span className="vads-u-flex--1">
                    <i className="fas fa-paperclip" aria-hidden="true" />
                    <span ref={attachmentReference} tabIndex={-1}>
                      {file.name}{' '}
                    </span>
                    ({getSize(file.size || file.attachmentSize)})
                  </span>
                  <va-button
                    onClick={() => removeAttachment(file)}
                    secondary
                    text="REMOVE"
                    aria-label={`remove ${file.name}`}
                    class="remove-attachment-button vads-u-flex--auto"
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
                    <span ref={attachmentReference} tabIndex={-1}>
                      {file.name}{' '}
                    </span>
                    ({getSize(file.size || file.attachmentSize)})
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
  compose: PropTypes.bool,
  editingEnabled: PropTypes.bool,
  setAttachments: PropTypes.func,
};

export default AttachmentsList;
