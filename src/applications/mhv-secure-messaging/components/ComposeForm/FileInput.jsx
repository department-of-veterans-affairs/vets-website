import React, { useRef, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  acceptedFileTypes,
  acceptedFileTypesExtended,
  Attachments,
  ErrorMessages,
} from '../../util/constants';
import useFeatureToggles from '../../hooks/useFeatureToggles';

const FileInput = props => {
  const {
    attachFileError,
    attachments,
    attachmentScanError,
    draftSequence,
    isOhTriageGroup,
    setAttachFileError,
    setAttachFileSuccess,
    setAttachments,
  } = props;

  const fileInputRef = useRef();
  const errorRef = useRef(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const {
    largeAttachmentsEnabled,
    cernerPilotSmFeatureFlag,
  } = useFeatureToggles();

  const useLargeAttachments = useMemo(
    () => {
      return (
        largeAttachmentsEnabled || (cernerPilotSmFeatureFlag && isOhTriageGroup)
      );
    },
    [largeAttachmentsEnabled, cernerPilotSmFeatureFlag, isOhTriageGroup],
  );

  const {
    maxFileSize,
    maxFileSizeError,
    totalMaxFileSize,
    totalMaxFileSizeError,
    totalMaxFileCount,
    invalidFileTypeError,
  } = useMemo(
    () => {
      return {
        maxFileSize: useLargeAttachments
          ? Attachments.MAX_FILE_SIZE_LARGE
          : Attachments.MAX_FILE_SIZE,
        maxFileSizeError: useLargeAttachments
          ? ErrorMessages.ComposeForm.ATTACHMENTS.FILE_TOO_LARGE_LARGE_UPLOAD
          : ErrorMessages.ComposeForm.ATTACHMENTS.FILE_TOO_LARGE,
        totalMaxFileSize: useLargeAttachments
          ? Attachments.TOTAL_MAX_FILE_SIZE_LARGE
          : Attachments.TOTAL_MAX_FILE_SIZE,
        totalMaxFileSizeError: useLargeAttachments
          ? ErrorMessages.ComposeForm.ATTACHMENTS
              .TOTAL_MAX_FILE_SIZE_EXCEEDED_LARGE
          : ErrorMessages.ComposeForm.ATTACHMENTS.TOTAL_MAX_FILE_SIZE_EXCEEDED,
        totalMaxFileCount: useLargeAttachments
          ? Attachments.MAX_FILE_COUNT_LARGE
          : Attachments.MAX_FILE_COUNT,
        invalidFileTypeError: useLargeAttachments
          ? ErrorMessages.ComposeForm.ATTACHMENTS.INVALID_FILE_TYPE_EXTENDED
          : ErrorMessages.ComposeForm.ATTACHMENTS.INVALID_FILE_TYPE,
      };
    },
    [useLargeAttachments],
  );

  const acceptedFileTypesToUse = useMemo(
    () => {
      if (useLargeAttachments) {
        return acceptedFileTypesExtended;
      }
      return acceptedFileTypes;
    },
    [useLargeAttachments],
  );

  // Validation for files
  const handleFiles = event => {
    const currentTotalSize = attachments.reduce((currentSize, item) => {
      return currentSize + item.size;
    }, 0);
    const selectedFile = event.target.files[0];

    setSelectedFileId(selectedFile.lastModified);
    // eslint disabled here to clear the input's stored value to allow a user to remove and re-add the same attachment
    // https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
    // eslint-disable-next-line no-param-reassign
    event.target.value = null;

    if (!selectedFile) return;
    const fileExtension =
      selectedFile.name && selectedFile.name.split('.').pop();
    setAttachFileError(null);

    if (selectedFile.size === 0) {
      setAttachFileError({
        message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_EMPTY,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (
      !fileExtension ||
      !acceptedFileTypesToUse[fileExtension.toLowerCase()]
    ) {
      setAttachFileError({
        message: invalidFileTypeError,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (attachments.filter(a => a.name === selectedFile.name).length > 0) {
      setAttachFileError({
        message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_DUPLICATE,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setAttachFileError({
        message: maxFileSizeError,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (currentTotalSize + selectedFile.size > totalMaxFileSize) {
      setAttachFileError({
        message: totalMaxFileSizeError,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (attachments.length) {
      setAttachments(prevFiles => {
        setAttachFileSuccess(true);
        return [...prevFiles, selectedFile];
      });
    } else {
      setAttachFileSuccess(true);
      setAttachments([selectedFile]);
    }
  };

  useEffect(
    () => {
      const errorElement = document.getElementById(`error-${selectedFileId}`);
      if (errorElement) {
        errorElement.focus();
      }
    },
    [selectedFileId],
  );

  const useFileInput = () => {
    fileInputRef.current.click();
    setAttachFileSuccess(false);
  };

  const draftText = useMemo(
    () => {
      if (draftSequence) {
        return ` to draft ${draftSequence}`;
      }
      return '';
    },
    [draftSequence],
  );
  const attachText = useMemo(
    () => {
      if (attachments.length > 0) {
        return 'Attach additional file';
      }
      return 'Attach file';
    },
    [attachments?.length],
  );

  return (
    <div
      className={`
        file-input
        vads-u-font-weight--bold
        vads-u-color--secondary-dark
        ${
          attachFileError
            ? 'vads-u-margin-left--neg2 vads-u-border-left--4px vads-u-border-color--secondary-dark vads-u-padding-left--2'
            : ''
        }`}
    >
      {attachFileError && (
        <label
          htmlFor={`attachments${draftSequence ? `-${draftSequence}` : ''}`}
          id={`error-${selectedFileId}`}
          role="alert"
          data-testid="file-input-error-message"
          ref={errorRef}
          tabIndex="-1"
          aria-live="polite"
        >
          {attachFileError.message}
        </label>
      )}

      {attachments?.length < totalMaxFileCount &&
        !attachmentScanError && (
          <>
            {/* Wave plugin addressed this as an issue, label required */}
            <label
              htmlFor={`attachments${draftSequence ? `-${draftSequence}` : ''}`}
              hidden
            >
              Attachments input
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id={`attachments${draftSequence ? `-${draftSequence}` : ''}`}
              name={`attachments${draftSequence ? `-${draftSequence}` : ''}`}
              data-testid={`attach-file-input${
                draftSequence ? `-${draftSequence}` : ''
              }`}
              onChange={handleFiles}
              hidden
            />

            <va-button
              onClick={useFileInput}
              secondary
              text={`${attachText}${draftText}`}
              class="attach-file-button"
              data-testid={`attach-file-button${
                draftSequence ? `-${draftSequence}` : ''
              }`}
              id={`attach-file-button${
                draftSequence ? `-${draftSequence}` : ''
              }`}
              data-dd-action-name={`${attachText}${draftText} Button`}
            />
          </>
        )}
    </div>
  );
};

FileInput.propTypes = {
  attachFileError: PropTypes.object,
  attachmentScanError: PropTypes.bool,
  attachments: PropTypes.array,
  draftSequence: PropTypes.number,
  isOhTriageGroup: PropTypes.bool,
  setAttachFileError: PropTypes.func,
  setAttachFileSuccess: PropTypes.func,
  setAttachments: PropTypes.func,
};

export default FileInput;
