import React, {
  useEffect,
  useMemo,
  useCallback,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { VaFileInputMultiple } from '@department-of-veterans-affairs/web-components/react-bindings';
import {
  acceptedFileTypes,
  acceptedFileTypesExtended,
  Attachments,
  ErrorMessages,
  Alerts,
} from '../../util/constants';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import HowToAttachFiles from '../HowToAttachFiles';

const FileInput = props => {
  const {
    attachFileError,
    attachments,
    attachmentScanError,
    draftSequence,
    isOhTriageGroup,
    setAttachFileError,
    setAttachments,
    showHelp = true,
  } = props;

  const fileInputRef = useRef();

  // Key to force component re-render when invalid file is detected
  const [fileInputKey, setFileInputKey] = useState(0);
  const [pendingKeyReset, setPendingKeyReset] = useState(false);

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
  // IMPORTANT: Use ONLY MIME types, not extensions
  // VaFileInput's normalizeAcceptProp() returns undefined for extensions
  // not in its extensionToMimeType map (like .jfif, .pjpeg, .pjp)
  // which causes: "undefined is not an object (evaluating 'r.endsWith')"
  const acceptString = useMemo(
    () => {
      // Only use MIME types to avoid undefined values in VaFileInput validation
      return Object.values(acceptedFileTypesToUse).join(',');
    },
    [acceptedFileTypesToUse],
  );

  // Validate a file BEFORE it's added to VaFileInputMultiple
  // Returns true if valid, false if invalid (with error set)
  const validateFileBeforeAdd = useCallback(
    file => {
      // Validate file is not empty
      if (file.size === 0) {
        setAttachFileError({
          message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_EMPTY,
        });
        return false;
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
        return false;
      }

      // Check for duplicate files
      if (attachments.filter(a => a.name === file.name).length > 0) {
        setAttachFileError({
          message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_DUPLICATE,
        });
        return false;
      }

      // Check if adding this file would exceed max file count
      if (attachments.length >= totalMaxFileCount) {
        setAttachFileError({
          message: `You can only attach up to ${totalMaxFileCount} files.`,
        });
        return false;
      }

      // Validate individual file size
      if (file.size > maxFileSize) {
        setAttachFileError({
          message: maxFileSizeError,
        });
        return false;
      }

      // Validate total file size
      const currentTotalSize = attachments.reduce((currentSize, item) => {
        return currentSize + item.size;
      }, 0);

      if (currentTotalSize + file.size > totalMaxFileSize) {
        setAttachFileError({
          message: totalMaxFileSizeError,
        });
        return false;
      }

      // All validations passed
      return true;
    },
    [
      acceptedFileTypesToUse,
      attachments,
      invalidFileTypeError,
      maxFileSize,
      maxFileSizeError,
      totalMaxFileCount,
      totalMaxFileSize,
      totalMaxFileSizeError,
    ],
  );

  // Handle file changes with VaFileInputMultiple events
  const handleMultipleChange = useCallback(
    event => {
      const { detail } = event;
      const { action, file } = detail;

      switch (action) {
        case 'FILE_ADDED': {
          setAttachFileError(null);

          // Validate the file
          if (!validateFileBeforeAdd(file)) {
            // Validation failed - schedule component reset
            // Use pendingKeyReset flag to trigger reset in useEffect
            // This avoids race condition with value prop during render
            setPendingKeyReset(true);
            return;
          }

          // All validations passed, add the file
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
          // User-initiated removal - update state and clear messages
          setAttachments(prevFiles => {
            return prevFiles.filter(f => f.name !== file.name);
          });
          setAttachFileError(null);

          // Focus management: return focus to attach button after removal
          setTimeout(() => {
            const fileInputElement = document.querySelector(
              `[data-testid="attach-file-input${
                draftSequence ? `-${draftSequence}` : ''
              }"]`,
            );
            const button = fileInputElement?.shadowRoot?.querySelector(
              'button',
            );
            if (button) {
              button.focus();
            }
          }, 100);

          break;
        }
        default:
          break;
      }
    },
    [
      attachments,
      draftSequence,
      setAttachFileError,
      setAttachments,
      validateFileBeforeAdd,
    ],
  );

  // Handle pending key reset after state updates complete
  useEffect(
    () => {
      if (pendingKeyReset) {
        // Reset the flag first
        setPendingKeyReset(false);
        // Then increment key to force component remount
        setFileInputKey(prevKey => prevKey + 1);
      }
    },
    [pendingKeyReset],
  );

  // Focus on error message when it appears
  useEffect(
    () => {
      if (attachFileError) {
        const timeoutId = setTimeout(() => {
          const errorElement = document.querySelector(
            `[data-testid="file-input-error-message"]`,
          );
          if (errorElement) {
            errorElement.focus();
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      }
      return undefined;
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

      // Summarize file types if more than 15 (shows basic types, hides extended types)
      const fileTypesText =
        fileTypesList.length > 15
          ? 'common document and image formats'
          : fileTypesList.map(ext => ext.toUpperCase()).join(', ');

      return `You can upload up to ${totalMaxFileCount} files. Accepted file types: ${fileTypesText}. Maximum file size: ${maxSize}. Maximum total size: ${totalSize}.`;
    },
    [acceptedFileTypesToUse, useLargeAttachments, totalMaxFileCount],
  );

  // Generate errors array for VaFileInputMultiple
  const fileErrors = useMemo(
    () => {
      if (!attachmentScanError) return [];

      // When virus scan fails, show error for all attachments
      const errorMessage =
        attachments.length > 1
          ? Alerts.Message.MULTIPLE_ATTACHMENTS_SCAN_FAIL
          : Alerts.Message.ATTACHMENT_SCAN_FAIL;

      return attachments.map(() => errorMessage);
    },
    [attachmentScanError, attachments],
  );

  // VaFileInputMultiple handles displaying both the attach button and file list
  // We need to keep rendering so users can see and remove files even at max count
  //
  // VALIDATION STRATEGY: Key-based component reset with conditional value prop
  // 1. VaFileInputMultiple emits FILE_ADDED event when user selects file
  // 2. We validate the file in our handleMultipleChange handler
  // 3. If validation FAILS, we schedule a key increment via pendingKeyReset state
  //    - useEffect triggers the key increment after current render completes
  //    - This completely remounts the component, clearing the invalid file
  //    - Component remounts with value={attachments} to restore valid files
  // 4. If validation PASSES, we add file to React state normally
  //    - VaFileInputMultiple manages its own internal state for valid files
  //
  // CRITICAL: Conditional value prop to prevent duplicate va-file-input elements
  // - On initial mount (fileInputKey = 0): value={undefined}
  //   * Prevents duplicate empty va-file-input elements from being created
  //   * Allows component to start clean with its default single empty input
  // - After key reset (fileInputKey > 0): value={attachments}
  //   * Restores all valid files after rejecting invalid file
  //   * Works because new instance has valueAdded=false flag
  //
  // Without conditional value prop:
  // - Using value on initial mount creates 3 va-file-input elements instead of 2
  // - This causes duplicate "Drag an additional file here or choose from folder" text
  //
  // VaFileInputMultiple does NOT support programmatic file removal:
  // - Only emits events (does not listen to incoming events)
  // - No public API methods for file manipulation
  // - Key-based reset is the only way to reject invalid files
  //
  // This approach validates:
  // - File is not empty
  // - File type is allowed
  // - File is not a duplicate
  // - Won't exceed max file count
  // - Won't exceed individual file size limit
  // - Won't exceed total file size limit

  return (
    <div
      className="file-input vads-u-margin-top--2"
      data-dd-action-name="Attach File to Message"
    >
      {/* Show HowToAttachFiles help text when showHelp prop is true */}
      {showHelp && (
        <HowToAttachFiles useLargeAttachments={useLargeAttachments} />
      )}

      {/* Error message with enhanced visual styling */}
      {attachFileError && (
        <div
          data-testid="file-input-error-message"
          role="alert"
          aria-live="polite"
          className="vads-u-margin-bottom--2 vads-u-border-left--4px vads-u-border-color--secondary-dark vads-u-padding-left--2"
        >
          <span className="usa-error-message">{attachFileError.message}</span>
        </div>
      )}

      <VaFileInputMultiple
        key={fileInputKey}
        ref={fileInputRef}
        label="Attachments"
        name={`attachments${draftSequence ? `-${draftSequence}` : ''}`}
        buttonText={buttonText}
        hint={hintText}
        accept={acceptString}
        errors={fileErrors}
        value={fileInputKey > 0 ? attachments : undefined}
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
  setAttachments: PropTypes.func,
  showHelp: PropTypes.bool,
};

export default FileInput;
