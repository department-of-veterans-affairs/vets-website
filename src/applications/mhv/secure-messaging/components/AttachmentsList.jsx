import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import RemoveAttachmentModal from './Modals/RemoveAttachmentModal';

const AttachmentsList = props => {
  const { attachments, setAttachments, editingEnabled } = props;
  const attachmentReference = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentRemoved, setIsAttachmentRemoved] = useState(false);
  const [removedAttachmentName, setRemovedAttachmentName] = useState('');
  const [fileToRemove, setFileToRemove] = useState(null);
  const [recentlyRemovedFile, setRecentlyRemovedFile] = useState(false);

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
    setRemovedAttachmentName(file.name);
    setAttachments(newAttArr);
    setIsAttachmentRemoved(true);

    focusElement(
      document
        .querySelector('.attach-file-button')
        .shadowRoot.querySelector('button'),
    );

    if (newAttArr.some(item => item.name !== file.name)) {
      setRecentlyRemovedFile(true);
    }
  };
  return (
    <div>
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
                    aria-live="polite"
                    aria-label={
                      recentlyRemovedFile
                        ? null
                        : `${file.name}, ${getSize(
                            file.size || file.attachmentSize,
                          )}, file successfully attached. Button available: Remove ${
                            file.name
                          }`
                    }
                  >
                    <i
                      className="fas fa-paperclip"
                      alt="Attachment icon"
                      aria-hidden="true"
                    />
                    <span>{file.name} </span>(
                    {getSize(file.size || file.attachmentSize)})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalVisible(true);
                      setFileToRemove(file);
                    }}
                    aria-label={`remove ${file.name}`}
                    className="remove-attachment-button vads-u-flex--auto vads-u-margin-right--1p5 vads-u-padding-y--2"
                  >
                    <span className="remove-attachment-icon vads-u-padding-right--3" />
                    Remove
                  </button>
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
      <RemoveAttachmentModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setIsAttachmentRemoved(false);
        }}
        onDelete={() => {
          setIsModalVisible(false);
          removeAttachment(fileToRemove);
        }}
      />
      {isAttachmentRemoved ? (
        <>
          <div
            ref={attachmentReference}
            role="status"
            aria-live="polite"
            className="sr-only"
            id="attachment-removed-successfully"
          >
            {`File ${removedAttachmentName} successfully removed. Attach file, button.`}
          </div>
        </>
      ) : null}
    </div>
  );
};

AttachmentsList.propTypes = {
  attachments: PropTypes.array,
  editingEnabled: PropTypes.bool,
  setAttachments: PropTypes.func,
};

export default AttachmentsList;
