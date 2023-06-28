import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const AttachmentsList = props => {
  const { attachments, setAttachments, editingEnabled } = props;
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
      if (
        attachments?.length > 0 &&
        editingEnabled &&
        attachmentReference.current
      ) {
        focusElement(attachmentReference.current);
      }
    },
    [attachments, editingEnabled],
  );

  const removeAttachment = file => {
    const newAttArr = attachments.filter(item => {
      if (item.name !== file.name) {
        return true;
      }
      return item.size !== file.size;
    });
    setAttachments(newAttArr);
    focusElement(
      document
        .querySelector('.attach-file-button')
        .shadowRoot.querySelector('button'),
    );
  };

  return (
    <div>
      <div className="message-body-attachments-label">
        <strong>Attachments</strong>
      </div>
      <ul className="attachments-list">
        {!!attachments.length &&
          attachments.map(file => (
            <li key={file.name + file.size}>
              {editingEnabled && (
                <div className="editable-attachment vads-u-display--flex vads-u-flex-direction--row">
                  <span
                    ref={attachmentReference}
                    className="vads-u-flex--1"
                    role="alert"
                    aria-label={`${file.name}, ${getSize(
                      file.size || file.attachmentSize,
                    )}, file successfully attached. Button available: Remove ${
                      file.name
                    }`}
                  >
                    <i className="fas fa-paperclip" aria-hidden="true" />
                    <span>{file.name} </span>(
                    {getSize(file.size || file.attachmentSize)})
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
                    <i
                      role="img"
                      aria-labelledby="has-attachment"
                      className="fas fa-paperclip"
                      aria-hidden="true"
                      alt="Attachment icon"
                    />
                    <span id="has-attachment" ref={attachmentReference}>
                      {file.name}
                    </span>
                    ({getSize(file.size || file.attachmentSize)})
                    <span className="sr-only">Has attachment</span>
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
