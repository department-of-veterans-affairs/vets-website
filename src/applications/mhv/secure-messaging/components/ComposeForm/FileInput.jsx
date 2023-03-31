import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { acceptedFileTypes, Attachments } from '../../util/constants';

const FileInput = ({ attachments, setAttachments }) => {
  const [error, setError] = useState();
  const fileInputRef = useRef();

  // Validation for files
  const handleFiles = event => {
    const currentTotalSize = attachments.reduce((currentSize, item) => {
      return currentSize + item.size;
    }, 0);
    const selectedFile = event.target.files[0];

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
        message: 'Your file is empty. Try attaching a different file.',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (!fileExtension || !acceptedFileTypes[fileExtension.toLowerCase()]) {
      setError({
        message: `We can't attach this file type. Try attaching a DOC, JPG, PDF, PNG, RTF, TXT, or XLS.`,
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
        message: 'You have already attached this file.',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (attachments.length === 4) {
      setError('You have already attached the maximum number of files.');
      setError({
        message: 'You may only attach up to 4 files.',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (selectedFile.size > Attachments.MAX_FILE_SIZE) {
      setError({
        message:
          'Your file is too large. Try attaching a file smaller than 6MB.',
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
          'Your files are too large. The total size of all files must be smaller than 10MB.',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (attachments.length) {
      setAttachments(prevFiles => {
        return [...prevFiles, selectedFile];
      });
    } else {
      setAttachments([selectedFile]);
    }
  };

  const useFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-input vads-u-font-weight--bold vads-u-color--secondary-dark">
      {error && (
        <label
          htmlFor="attachments"
          id="error-message"
          role="alert"
          data-testid="file-input-error-message"
        >
          <p>{error.message}</p>
        </label>
      )}

      {attachments?.length < Attachments.MAX_FILE_COUNT && (
        <>
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
            text="Attach file"
            class="attach-file-button"
            data-testid="attach-file-button"
          />
        </>
      )}
    </div>
  );
};

FileInput.propTypes = {
  attachments: PropTypes.array,
  setAttachments: PropTypes.func,
};

export default FileInput;
