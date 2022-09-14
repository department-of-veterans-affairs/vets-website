import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AttachFilesModal from './AttachFilesModal';
import HowToAttachFiles from './HowToAttachFiles';

const FileInput = ({ attachments, setAttachments }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="file-input">
      {modalOpen && (
        <AttachFilesModal
          closeModal={closeModal}
          attachments={attachments}
          setAttachments={setAttachments}
        />
      )}
      <va-button
        onClick={openModal}
        secondary
        text="Attach files"
        class="open-files-modal-button"
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
