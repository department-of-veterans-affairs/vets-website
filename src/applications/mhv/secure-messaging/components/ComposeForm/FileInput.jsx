import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HowToAttachFiles from '../HowToAttachFiles';

const acceptedFileTypes = {
  doc: 'application/msword',
  docx:
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
  png: 'image/png',
  rtf: 'text/rtf',
  txt: 'text/plain',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

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
    if (!selectedFile) return;
    const fileExtension =
      selectedFile.name && selectedFile.name.split('.').pop();
    setError(null);

    if (!fileExtension || !acceptedFileTypes[fileExtension]) {
      setError({
        title: 'File type not supported',
        message:
          'File supported: doc, docx, gif, jpg, jpeg, pdf, png, rtf, txt, xls, xlsx',
      });
      fileInputRef.current.value = null;
      return;
    }
    if (attachments.length === 4) {
      setError('You have already attached the maximum number of files.');
      setError({
        title: 'Maximum number of files exceeded',
        message: 'You may only attach up to 4 files',
      });
      fileInputRef.current.value = null;
      return;
    }
    if (selectedFile.size > 6000000) {
      setError({
        title: 'File is too large',
        message: 'File size for a single attachment cannot exceed 6MB',
      });
      fileInputRef.current.value = null;
      return;
    }
    if (currentTotalSize + selectedFile.size > 10000000) {
      setError({
        title: 'Total size of files is too large',
        message: 'The total size of all attachments cannot exceed 10MB',
      });
      fileInputRef.current.value = null;
      return;
    }

    if (attachments.length) {
      setAttachments(prevFiles => {
        if (prevFiles.find(item => item.name === selectedFile.name)) {
          return [...prevFiles];
        }
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
        >
          <p>{error.message}</p>
        </VaModal>
      )}

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
      <HowToAttachFiles />
    </div>
  );
};

FileInput.propTypes = {
  attachments: PropTypes.array,
  setAttachments: PropTypes.func,
};

export default FileInput;
