import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { handleRemoveAttachmentButtonId, getSize } from '../util/helpers';
import HowToAttachFiles from './HowToAttachFiles';

const AttachmentsList = props => {
  const {
    attachments,
    setFileToRemove,
    editingEnabled,
    setIsModalVisible,
    recentlyRemovedFile,
  } = props;
  const attachmentReference = useRef(null);

  return (
    <div>
      <div className="message-body-attachments-label vads-u-margin-bottom--1 vads-u-margin-top--3">
        Attachments
        {attachments.length > 0 ? (
          <span data-testid="attachments-count"> ({attachments.length})</span>
        ) : (
          ''
        )}
      </div>
      {editingEnabled && <HowToAttachFiles />}
      <ul className="attachments-list">
        {!!attachments.length &&
          attachments.map(file => (
            <li key={file.name + file.size}>
              {editingEnabled && (
                <div className="editable-attachment vads-u-display--flex vads-u-flex-direction--row">
                  <span
                    data-dd-privacy="mask"
                    ref={attachmentReference}
                    className="vads-u-flex--1"
                    role="alert"
                    aria-live="polite"
                    aria-label={
                      recentlyRemovedFile
                        ? null
                        : `${file.name}, ${getSize(
                            file.size || file.attachmentSize,
                          )}, button available: Remove ${file.name}`
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
                    data-testid={handleRemoveAttachmentButtonId(file)}
                    data-dd-action-name="Remove Attachment Button"
                    className="remove-attachment-button vads-u-flex--auto vads-u-margin-right--1p5 vads-u-padding-y--2"
                  >
                    <span className="remove-attachment-icon vads-u-padding-right--3" />
                    REMOVE
                  </button>
                </div>
              )}
              {!editingEnabled && (
                <>
                  <a
                    data-testid="attachment-link-metadata"
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
                      aria-labelledby={`has-attachment-${file.messageId}`}
                      className="fas fa-paperclip"
                      aria-hidden="true"
                      alt="Attachment icon"
                    />
                    <span
                      id={`has-attachment-${file.messageId}`}
                      data-testid={`attachment-name-${file.id}`}
                      ref={attachmentReference}
                      data-dd-privacy="mask"
                    >
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
  attachFileSuccess: PropTypes.bool,
  attachments: PropTypes.array,
  editingEnabled: PropTypes.bool,
  recentlyRemovedFile: PropTypes.bool,
  setAttachFileSuccess: PropTypes.func,
  setAttachments: PropTypes.func,
  setFileToRemove: PropTypes.func,
  setIsModalVisible: PropTypes.func,
  setNavigationError: PropTypes.func,
};

export default AttachmentsList;
