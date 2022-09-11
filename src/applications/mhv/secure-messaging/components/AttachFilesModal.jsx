import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AttachmentsList from './AttachmentsList';

const AttachFilesModal = ({ closeModal, attachments, setAttachments }) => {
  const [files, setFiles] = useState([...attachments]);
  const [filesChanged, setFilesChanged] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleFiles = event => {
    const selectedFile = event.target.files[0];
    setError(null);

    if (totalSize + selectedFile.size > 9999999) {
      setError('Total size too large');
      return;
    }
    if (selectedFile.size > 5999999) {
      setError('File too large. Must be less than 6MB');
      return;
    }

    setTotalSize(prevTotal => prevTotal + selectedFile.size);

    if (files.length) {
      setFiles(prevFiles => {
        if (prevFiles.find(item => item.name === selectedFile.name)) {
          return [...prevFiles];
        }
        setFilesChanged(true);
        return [...prevFiles, selectedFile];
      });
    } else {
      setFiles([selectedFile]);
      setFilesChanged(true);
    }
  };

  const useFileInput = () => {
    fileInputRef.current.click();
  };

  const handleConfirmAttach = () => {
    setAttachments(files);
    closeModal();
  };

  return (
    <VaModal
      large
      modalTitle="Attach files"
      onCloseEvent={closeModal}
      onPrimaryButtonClick={handleConfirmAttach}
      onSecondaryButtonClick={closeModal}
      primaryButtonText={filesChanged ? 'Attach' : ''}
      secondaryButtonText={filesChanged ? 'Cancel' : ''}
      visible
    >
      <p>You may attach up to 4 files.</p>
      <p>
        Files supported: .doc, .docx, .gif, .jpg, .pdf, .rtf, .txt, .xls, .xlsx
      </p>
      <p>
        Files size for a single attachment cannot exceed 6MB and the total size
        of all attachments cannot exceed 10MB.
      </p>

      {error && <p className="error">{error}</p>}

      <AttachmentsList
        attachments={files}
        setAttachments={setFiles}
        editingEnabled
      />

      <div className="compose-attachments-input">
        <input
          ref={fileInputRef}
          type="file"
          id="attachments"
          name="attachments"
          onChange={handleFiles}
          hidden
        />
        <button
          type="button"
          className="link-button attach-file-button"
          onClick={useFileInput}
        >
          {files.length ? 'Attach another file' : 'Attach a file'}
        </button>
      </div>
    </VaModal>
  );
};

AttachFilesModal.propTypes = {
  attachments: PropTypes.array,
  closeModal: PropTypes.func,
  setAttachments: PropTypes.func,
};

export default AttachFilesModal;
