import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { acceptedFileTypes, Attachments } from '../../util/constants';

const FileInput = ({ attachments, setAttachments }) => {
  const [error, setError] = useState();
  const fileInputRef = useRef();

  const closeModal = () => {
    setError(null);
  };

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
        title: 'File is empty',
        message:
          'The file you are attempting to attach is empty. Please select a non-empty file.',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (!fileExtension || !acceptedFileTypes[fileExtension.toLowerCase()]) {
      setError({
        title: 'File type not supported',
        message:
          'File supported: doc, docx, gif, jpg, jpeg, pdf, png, rtf, txt, xls, xlsx',
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
        title: 'File already attached',
        message: 'You have already attached this file.',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (attachments.length === 4) {
      setError('You have already attached the maximum number of files.');
      setError({
        title: 'Maximum number of files exceeded',
        message: 'You may only attach up to 4 files.',
      });
      fileInputRef.current.value = null;
      return;
    }
    if (selectedFile.size > Attachments.MAX_FILE_SIZE) {
      setError({
        title: 'File is too large',
        message: 'File size for a single attachment cannot exceed 6MB.',
      });
      fileInputRef.current.value = null;
      return;
    }
    if (
      currentTotalSize + selectedFile.size >
      Attachments.TOTAL_MAX_FILE_SIZE
    ) {
      setError({
        title: 'Total size of files is too large',
        message: 'The total size of all attachments cannot exceed 10MB.',
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
    <div className="file-input">
      {error && (
        <VaModal
          modalTitle={error.title}
          onCloseEvent={closeModal}
          onPrimaryButtonClick={closeModal}
          primaryButtonText="Continue editing"
          status="warning"
          visible
          data-testid="attach-file-error-modal"
        >
          <p>{error.message}</p>
        </VaModal>
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
