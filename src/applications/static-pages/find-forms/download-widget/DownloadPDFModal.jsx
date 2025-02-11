import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DownloadModal from '../components/DownloadModal';

// DownloadPDFModal is state wrapper + modal for PDF guidance upon PDf being valid
const DownloadPDFModal = ({ clickedId, formNumber, removeNode, url }) => {
  const [modalState, setModalState] = useState({
    isOpen: true,
    formName: formNumber,
    pdfUrl: url,
  });

  useEffect(
    () => {
      if (modalState.isOpen === false) {
        removeNode(); // removes react widget from dom
      }
    },
    [modalState, removeNode],
  );

  const toggleModalState = () =>
    setModalState({ ...modalState, isOpen: !modalState.isOpen });

  const { isOpen, formName, pdfUrl } = modalState;

  return (
    <div
      className="faf-pdf-alert-modal"
      data-testid="faf-pdf-alert-modal"
      style={{
        pointerEvents: 'all',
      }}
    >
      <DownloadModal
        selectedPdfId={clickedId}
        isOpen={isOpen}
        pdfUrl={pdfUrl}
        formName={formName}
        toggleModalState={toggleModalState}
      />
    </div>
  );
};

DownloadPDFModal.propTypes = {
  clickedId: PropTypes.string,
  formNumber: PropTypes.string,
  removeNode: PropTypes.func,
  url: PropTypes.string,
};

export default DownloadPDFModal;
