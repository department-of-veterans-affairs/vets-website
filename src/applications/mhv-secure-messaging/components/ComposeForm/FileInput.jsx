import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/web-components/react-bindings';
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

  // Convert file types object to accept string for input element
  const acceptString = useMemo(
    () => {
      return Object.keys(acceptedFileTypesToUse)
        .map(ext => `.${ext}`)
        .join(',');
    },
    [acceptedFileTypesToUse],
  );

  // Handle file changes with VaFileInputMultiple events
  const handleMultipleChange = useCallback(
    event => {
      const { detail } = event;
      const { action, file } = detail;

      switch (action) {
        case 'FILE_ADDED': {
          setAttachFileError(null);

          // Validate file is not empty
          if (file.size === 0) {
            setAttachFileError({
              message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_EMPTY,
            });
            return;
          }

          // Validate file extension
          const fileExtension = file.name && file.name.split('.').pop();
          if (
            !fileExtension ||
            !acceptedFileTypesToUse[fileExtension.toLowerCase()]
          ) {
            setAttachFileError({
              message: invalidFileTypeError,
            });
            return;
          }

          // Check for duplicate files
          if (attachments.filter(a => a.name === file.name).length > 0) {
            setAttachFileError({
              message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_DUPLICATE,
            });
            return;
          }

          // Validate individual file size
          if (file.size > maxFileSize) {
            setAttachFileError({
              message: maxFileSizeError,
            });
            return;
          }

          // Validate total file size
          const currentTotalSize = attachments.reduce((currentSize, item) => {
            return currentSize + item.size;
          }, 0);

          if (currentTotalSize + file.size > totalMaxFileSize) {
            setAttachFileError({
              message: totalMaxFileSizeError,
            });
            return;
          }

          // All validations passed, add the file
          setAttachFileSuccess(true);
          if (attachments.length) {
            setAttachments(prevFiles => {
              return [...prevFiles, file];
            });
          } else {
            setAttachments([file]);
          }
          break;
        }
        case 'FILE_REMOVED': {
          setAttachments(prevFiles => {
            return prevFiles.filter(f => f.name !== file.name);
          });
          setAttachFileSuccess(false);
          break;
        }
        default:
          break;
      }
    },
    [
      acceptedFileTypesToUse,
      attachments,
      invalidFileTypeError,
      maxFileSize,
      maxFileSizeError,
      setAttachFileError,
      setAttachFileSuccess,
      setAttachments,
      totalMaxFileSize,
      totalMaxFileSizeError,
    ],
  );

  // Focus on error message when it appears
  useEffect(
    () => {
      if (attachFileError) {
        const errorElement = document.querySelector(
          `[data-testid="file-input-error-message"]`,
        );
        if (errorElement) {
          errorElement.focus();
        }
      }
    },
    [attachFileError],
  );

  const draftText = useMemo(
    () => {
      if (draftSequence) {
        return ` to draft ${draftSequence}`;
      }
      return '';
    },
    [draftSequence],
  );

  const buttonText = useMemo(
    () => {
      if (attachments.length > 0) {
        return `Attach additional file${draftText}`;
      }
      return `Attach file${draftText}`;
    },
    [attachments?.length, draftText],
  );

  const hintText = useMemo(
    () => {
      const fileTypesList = Object.keys(acceptedFileTypesToUse);
      const maxSize = useLargeAttachments ? '25 MB' : '6 MB';
      const totalSize = useLargeAttachments ? '25 MB' : '10 MB';

      // If file types list is very long (30+ types), summarize instead of listing all
      const fileTypesText =
        fileTypesList.length > 15
          ? 'common document and image formats'
          : fileTypesList.map(ext => ext.toUpperCase()).join(', ');

      return `You can upload up to ${totalMaxFileCount} files. Accepted file types: ${fileTypesText}. Maximum file size: ${maxSize}. Maximum total size: ${totalSize}.`;
    },
    [acceptedFileTypesToUse, useLargeAttachments, totalMaxFileCount],
  );

  // Don't show file input if max files reached or attachment scan error
  if (attachments?.length >= totalMaxFileCount || attachmentScanError) {
    return null;
  }

  return (
    <div className="file-input vads-u-margin-top--2">
      {attachFileError && (
        <div
          data-testid="file-input-error-message"
          role="alert"
          aria-live="polite"
          className="vads-u-margin-bottom--2"
        >
          <span className="usa-error-message">{attachFileError.message}</span>
        </div>
      )}
      <VaFileInputMultiple
        label="Attachments"
        name={`attachments${draftSequence ? `-${draftSequence}` : ''}`}
        buttonText={buttonText}
        hint={hintText}
        accept={acceptString}
        onVaMultipleChange={handleMultipleChange}
        data-testid={`attach-file-input${
          draftSequence ? `-${draftSequence}` : ''
        }`}
      />
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
