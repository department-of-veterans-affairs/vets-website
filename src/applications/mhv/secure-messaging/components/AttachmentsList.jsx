import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import RemoveAttachmentModal from './Modals/RemoveAttachmentModal';
import HowToAttachFiles from './HowToAttachFiles';

const AttachmentsList = props => {
  const {
    attachments,
    compose,
    reply,
    setAttachments,
    setNavigationError,
    editingEnabled,
    attachFileSuccess,
    setAttachFileSuccess,
    forPrint,
  } = props;
  const attachmentReference = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentRemoved, setIsAttachmentRemoved] = useState(false);
  const [removedAttachmentName, setRemovedAttachmentName] = useState('');
  const [fileToRemove, setFileToRemove] = useState(null);
  const [recentlyRemovedFile, setRecentlyRemovedFile] = useState(false);
  const attachFileAlertRef = useRef();
  const [focusedElement, setFocusedElement] = useState(null);

  const getSize = num => {
    if (num > 999999) {
      return `${(num / 1000000).toFixed(1)} MB`;
    }
    if (num > 999) {
      return `${Math.floor(num / 1000)} KB`;
    }
    return `${num} B`;
  };

  const attachmentNameId = messageId =>
    forPrint
      ? `attachment-name-for-print-${messageId}`
      : `attachment-name-${messageId}`;

  useEffect(
    () => {
      focusElement(focusedElement);
    },
    [focusedElement],
  );

  useEffect(
    () => {
      if (attachFileSuccess && attachFileAlertRef.current.shadowRoot) {
        setTimeout(() => {
          setFocusedElement(
            document.querySelector('#close-success-alert-button'),
          );
        }, 300);
      }
    },
    [attachFileSuccess, attachments, attachFileAlertRef],
  );

  useEffect(
    () => {
      if (attachments.length === 0) {
        setAttachFileSuccess(false);
      }
    },
    [attachments],
  );

  const removeAttachment = file => {
    const newAttArr = attachments?.filter(item => {
      if (item.name !== file.name) {
        return true;
      }
      return item.size !== file.size;
    });
    setRemovedAttachmentName(file.name);
    setAttachments(newAttArr);
    setIsAttachmentRemoved(true);
    setAttachFileSuccess(false);

    setFocusedElement(
      document
        .querySelector('.attach-file-button')
        .shadowRoot.querySelector('button'),
    );

    if (newAttArr.some(item => item.name !== file.name)) {
      setRecentlyRemovedFile(true);
    }
  };

  const handleSuccessAlertClose = () => {
    setAttachFileSuccess(false);
    if (attachments.length > 0) {
      setFocusedElement(
        document.querySelector('.attachments-list').firstChild.firstChild
          .lastChild,
      );
    } else {
      setFocusedElement(
        document
          .querySelector('.attach-file-button')
          .shadowRoot.querySelector('button'),
      );
    }
  };

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

      {attachFileSuccess &&
        attachments.length > 0 && (
          <VaAlert
            aria-live="polite"
            aria-label="file successfully attached"
            ref={attachFileAlertRef}
            background-only
            className="file-attached-success vads-u-margin-top--2"
            data-testid="file-attached-success-alert"
            disable-analytics
            full-width="false"
            show-icon
            status="success"
            onCloseEvent={handleSuccessAlertClose}
          >
            <p className="vads-u-margin-bottom--0">File attached</p>
            <button
              className="close-success-alert-button vads-u-padding--0p5"
              id="close-success-alert-button"
              data-testid="close-success-alert-button"
              aria-label="Close notification"
              type="button"
              onClick={() => {
                setAttachFileSuccess(false);
                handleSuccessAlertClose();
              }}
            >
              <i
                className="fas fa-times-circle vads-u-color--black"
                style={{ fontSize: '2.4rem' }}
                alt="Close notification icon"
                aria-hidden="true"
                role="presentation"
              />
            </button>
          </VaAlert>
        )}

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
                    data-testid="remove-attachment-button"
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
                    className="attachment"
                    data-testid="attachment-link-metadata"
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
                      id={attachmentNameId(file.messageId)}
                      data-testid={attachmentNameId(file.messageId)}
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
      {(compose || reply) && (
        <RemoveAttachmentModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setIsAttachmentRemoved(false);
          }}
          onDelete={() => {
            setNavigationError();
            setIsModalVisible(false);
            removeAttachment(fileToRemove);
          }}
          data-testid="remove-attachment-modal"
        />
      )}
      {isAttachmentRemoved ? (
        <>
          <div
            ref={attachmentReference}
            role="status"
            aria-live="polite"
            className="sr-only"
            id="attachment-removed-successfully"
            data-dd-privacy="mask"
          >
            {`File ${removedAttachmentName} successfully removed. Attach file, button.`}
          </div>
        </>
      ) : null}
    </div>
  );
};

AttachmentsList.propTypes = {
  attachFileSuccess: PropTypes.bool,
  attachments: PropTypes.array,
  compose: PropTypes.bool,
  editingEnabled: PropTypes.bool,
  forPrint: PropTypes.bool,
  reply: PropTypes.bool,
  setAttachFileSuccess: PropTypes.func,
  setAttachments: PropTypes.func,
  setIsModalVisible: PropTypes.func,
  setNavigationError: PropTypes.func,
};

export default AttachmentsList;
