import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { datadogRum } from '@datadog/browser-rum';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import featureToggles from '../hooks/useFeatureToggles';
import { closeAlert } from '../actions/alerts';
import RemoveAttachmentModal from './Modals/RemoveAttachmentModal';
import HowToAttachFiles from './HowToAttachFiles';
import { Alerts } from '../util/constants';
import { getSize } from '../util/helpers';

const AttachmentsList = props => {
  const {
    attachFileSuccess,
    attachments,
    attachmentScanError,
    compose,
    draftSequence,
    editingEnabled,
    forPrint,
    isOhTriageGroup,
    reply,
    setAttachFileError,
    setAttachFileSuccess,
    setAttachments,
    setNavigationError,
  } = props;
  const dispatch = useDispatch();
  const {
    mhvSecureMessagingCuratedListFlow,
    cernerPilotSmFeatureFlag,
    largeAttachmentsEnabled,
  } = featureToggles();
  const attachmentReference = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttachmentRemoved, setIsAttachmentRemoved] = useState(false);
  const [removedAttachmentName, setRemovedAttachmentName] = useState('');
  const [fileToRemove, setFileToRemove] = useState(null);
  const [recentlyRemovedFile, setRecentlyRemovedFile] = useState(false);
  const attachFileAlertRef = useRef();
  const [focusedElement, setFocusedElement] = useState(null);

  const useLargeAttachments = useMemo(
    () => {
      return (
        largeAttachmentsEnabled || (cernerPilotSmFeatureFlag && isOhTriageGroup)
      );
    },
    [largeAttachmentsEnabled, cernerPilotSmFeatureFlag, isOhTriageGroup],
  );

  const focusAttachFileButton = useCallback(() => {
    const attachButton = document.querySelector('.attach-file-button');
    const button = attachButton
      ? attachButton.shadowRoot?.querySelector('button')
      : null;
    if (button !== null) setFocusedElement(button);
  }, []);

  useEffect(
    () => {
      if (attachmentScanError) {
        setTimeout(
          () =>
            setFocusedElement(
              attachments.length > 1
                ? document.getElementById('remove-all-attachments-button')
                : document.querySelector('.remove-attachment-button'),
            ),
          400,
        );
      }
    },
    [attachmentScanError, attachments.length],
  );

  const attachmentNameId = id =>
    forPrint ? `has-attachment-for-print-${id}` : `has-attachment-${id}`;

  useEffect(
    () => {
      focusElement(focusedElement);
    },
    [focusedElement],
  );

  useEffect(
    () => {
      const alertButton = attachFileAlertRef?.current?.shadowRoot?.querySelector(
        '#close-success-alert-button',
      );
      if (attachFileSuccess && alertButton) {
        setTimeout(() => {
          setFocusedElement(alertButton);
        }, 400);
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
    [attachments, setAttachFileSuccess],
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
    setAttachFileError(null);

    if (newAttArr.some(item => item.name !== file.name)) {
      setRecentlyRemovedFile(true);
    }

    setTimeout(() => focusAttachFileButton(), 400);
  };

  const handleRemoveAllAttachments = () => {
    setAttachments([]);
    dispatch(closeAlert()).then(() => {
      setTimeout(() => focusAttachFileButton(), 400);

      setAttachFileError(null);
    });
  };

  const handleSuccessAlertClose = () => {
    setAttachFileSuccess(false);
    if (attachments.length > 0) {
      setFocusedElement(
        document.querySelector('.attachments-list').firstChild.firstChild
          .lastChild,
      );
    } else {
      focusAttachFileButton();
    }
  };

  return (
    <div>
      <div className="message-body-attachments-label vads-u-margin-bottom--1 vads-u-margin-top--3">
        {mhvSecureMessagingCuratedListFlow ? (
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--0">
            Attachments
          </h2>
        ) : (
          'Attachments'
        )}
        {attachments.length > 0 ? (
          <span data-testid="attachments-count"> ({attachments.length})</span>
        ) : (
          ''
        )}
      </div>
      {editingEnabled && (
        <HowToAttachFiles useLargeAttachments={useLargeAttachments} />
      )}

      {attachFileSuccess &&
        attachments.length > 0 &&
        !attachmentScanError && (
          <VaAlert
            aria-live="polite"
            aria-label="file successfully attached"
            ref={attachFileAlertRef}
            background-only
            className="file-attached-success vads-u-margin-top--2"
            data-testid="file-attached-success-alert"
            data-dd-action-name="File Attached Alert"
            disable-analytics
            full-width="false"
            show-icon
            status="success"
            onCloseEvent={handleSuccessAlertClose}
          >
            <p className="vads-u-margin-y--0">File attached</p>
            <button
              className="close-success-alert-button vads-u-padding--0p5 vads-u-color--base"
              id="close-success-alert-button"
              data-testid="close-success-alert-button"
              aria-label="Close notification"
              type="button"
              onClick={() => {
                setAttachFileSuccess(false);
                handleSuccessAlertClose();
                datadogRum.addAction('File Attached Alert Closed');
              }}
            >
              <va-icon
                icon="cancel"
                size={3}
                alt="Close notification icon"
                aria-hidden="true"
                role="presentation"
              />
            </button>
          </VaAlert>
        )}

      {attachmentScanError &&
        (attachments.length > 1 ? (
          <VaAlert
            data-testid="attachment-virus-alert"
            aria-label={Alerts.Message.MULTIPLE_ATTACHMENTS_SCAN_FAIL}
            background-only
            className="file-attached-success vads-u-margin-top--2"
            disable-analytics
            full-width="false"
            show-icon
            status="error"
          >
            <p
              aria-live="assertive"
              className="vads-u-margin--0 vads-u-margin-bottom--1"
            >
              {Alerts.Message.MULTIPLE_ATTACHMENTS_SCAN_FAIL}
            </p>
            <va-button
              text="Remove all attachments"
              secondary
              className="usa-button-secondary vads-u-margin-bottom--0 vads-u-margin-right--0"
              id="remove-all-attachments-button"
              data-testid="remove-all-attachments-button"
              onClick={() => {
                handleRemoveAllAttachments();
              }}
            />
          </VaAlert>
        ) : (
          <VaAlert
            data-testid="attachment-virus-alert"
            aria-label={Alerts.Message.ATTACHMENT_SCAN_FAIL}
            background-only
            className="file-attached-success vads-u-margin-top--2"
            disable-analytics
            full-width="false"
            show-icon
            status="error"
          >
            <p aria-live="assertive" className="vads-u-margin--0">
              {Alerts.Message.ATTACHMENT_SCAN_FAIL}
            </p>
          </VaAlert>
        ))}

      <ul className="attachments-list">
        {!!attachments.length &&
          attachments.map(file => (
            <li
              key={file.name + file.size}
              data-dd-action-name="Attachment Item"
            >
              {editingEnabled && (
                <div className="editable-attachment vads-u-display--flex vads-u-flex-direction--row">
                  <span
                    data-dd-privacy="mask"
                    ref={attachmentReference}
                    className="vads-u-flex--1 vads-u-align-items--center vads-u-display--flex vads-u-flex-direction--row"
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
                    <div className="vads-u-flex--auto vads-u-margin-right--0p5 vads-u-color--link-default">
                      <va-icon
                        icon="attach_file"
                        size={2}
                        alt="Attachment icon"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="vads-u-flex--1">
                      <span className="attachment-name-text">{file.name}</span>(
                      {getSize(file.size || file.attachmentSize)})
                    </div>
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
                    Remove
                  </button>
                </div>
              )}
              {!editingEnabled && (
                <>
                  <a
                    className="attachment"
                    tabIndex={0}
                    data-testid={
                      !forPrint
                        ? `attachment-link-metadata-${file.id}`
                        : `attachment-link-metadata-for-print-${file.id}`
                    }
                    href={file.download}
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
                    <va-icon
                      aria-labelledby={attachmentNameId(file.id)}
                      icon="attach_file"
                      aria-hidden="true"
                      alt="Attachment icon"
                    />
                    <span
                      className="attachment-name-text"
                      id={attachmentNameId(file.id)}
                      data-testid={attachmentNameId(file.id)}
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
          draftSequence={draftSequence}
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setIsAttachmentRemoved(false);
          }}
          onDelete={() => {
            if (attachments.length === 1) {
              dispatch(closeAlert());
            }
            setNavigationError();
            setIsModalVisible(false);
            removeAttachment(fileToRemove);
          }}
          data-testid={`remove-attachment-modal${
            draftSequence ? `-${draftSequence}` : ''
          }`}
        />
      )}
      {isAttachmentRemoved ? (
        <>
          <div
            ref={attachmentReference}
            role="status"
            aria-live="polite"
            className="sr-only"
            id={`attachment-removed-successfully${
              draftSequence ? `-${draftSequence}` : ''
            }`}
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
  attachmentScanError: PropTypes.bool,
  attachments: PropTypes.array,
  compose: PropTypes.bool,
  draftSequence: PropTypes.number,
  editingEnabled: PropTypes.bool,
  forPrint: PropTypes.bool,
  isOhTriageGroup: PropTypes.bool,
  reply: PropTypes.bool,
  setAttachFileError: PropTypes.func,
  setAttachFileSuccess: PropTypes.func,
  setAttachments: PropTypes.func,
  setIsModalVisible: PropTypes.func,
  setNavigationError: PropTypes.func,
};

export default AttachmentsList;
