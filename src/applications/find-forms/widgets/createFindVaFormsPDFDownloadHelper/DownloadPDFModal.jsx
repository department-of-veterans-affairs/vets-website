import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PdfModal from '../../components/PdfModal';

// DownloadPDFModal is state wrapper + modal for PDF guidance upon PDf being valid
const DownloadPDFModal = ({ clickedId, formNumber, removeNode, url }) => {
  const [modalState, setModalState] = useState({
    isOpen: true,
    pdfSelected: formNumber,
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

  const { isOpen, pdfSelected, pdfUrl } = modalState;

  return (
    <div
      className="faf-pdf-alert-modal"
      data-testid="faf-pdf-alert-modal"
      style={{
        pointerEvents: 'all',
      }}
    >
      <PdfModal
        isOpen={isOpen}
        pdfUrl={pdfUrl}
        pdfSelected={pdfSelected}
        prevFocusedLink={clickedId}
        toggleModalState={toggleModalState}
      />
    </div>
  );
};

DownloadPDFModal.propTypes = {
  formNumber: PropTypes.string,
  removeNode: PropTypes.func,
  url: PropTypes.string,
};

export default DownloadPDFModal;
