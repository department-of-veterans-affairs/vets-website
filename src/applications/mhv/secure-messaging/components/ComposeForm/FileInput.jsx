import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  acceptedFileTypes,
  Attachments,
  ErrorMessages,
} from '../../util/constants';

const FileInput = props => {
  const { attachments, setAttachments, setAttachFileSuccess } = props;

  const [error, setError] = useState();
  const fileInputRef = useRef();
  const errorRef = useRef(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

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
    setError(null);

    if (selectedFile.size === 0) {
      setError({
        message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_EMPTY,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (!fileExtension || !acceptedFileTypes[fileExtension.toLowerCase()]) {
      setError({
        message: ErrorMessages.ComposeForm.ATTACHMENTS.INVALID_FILE_TYPE,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (
      attachments.filter(
        a => a.name === selectedFile.name && a.size === selectedFile.size,
      ).length > 0
    ) {
      setError({
        message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_DUPLICATE,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (selectedFile.size > Attachments.MAX_FILE_SIZE) {
      setError({
        message: ErrorMessages.ComposeForm.ATTACHMENTS.FILE_TOO_LARGE,
      });
      fileInputRef.current.value = null;
      return;
    }

    if (
      currentTotalSize + selectedFile.size >
      Attachments.TOTAL_MAX_FILE_SIZE
    ) {
      setError({
        message:
          ErrorMessages.ComposeForm.ATTACHMENTS.TOTAL_MAX_FILE_SIZE_EXCEEDED,
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

  return (
    <div className="file-input vads-u-font-weight--bold vads-u-color--secondary-dark">
      {error && (
        <label
          htmlFor="attachments"
          id={`error-${selectedFileId}`}
          role="alert"
          data-testid="file-input-error-message"
          ref={errorRef}
          tabIndex="-1"
          aria-live="polite"
        >
          {error.message}
        </label>
      )}

      {attachments?.length < Attachments.MAX_FILE_COUNT && (
        <>
          {/* Wave plugin addressed this as an issue, label required */}
          <label htmlFor="attachments" hidden>
            Attachments input
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="attachments"
            name="attachments"
            data-testid="attach-file-input"
            onChange={handleFiles}
            hidden
          />

          <va-button
            onClick={useFileInput}
            secondary
            text={
              attachments.length > 0 ? 'Attach additional file' : 'Attach file'
            }
            class="attach-file-button"
            data-testid="attach-file-button"
            data-dd-action-name="Attach File Button"
          />
        </>
      )}
    </div>
  );
};

FileInput.propTypes = {
  attachments: PropTypes.array,
  setAttachFileSuccess: PropTypes.func,
  setAttachments: PropTypes.func,
};

export default FileInput;
