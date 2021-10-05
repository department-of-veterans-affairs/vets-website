// Dependencies.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

// DownloadPDFModal is state wrapper + modal for PDF guidance upon PDf being valid
const DownloadPDFModal = ({ formNumber, removeNode, url }) => {
  const [modalState, setModalState] = useState({
    isOpen: true,
    pdfSelected: formNumber,
    pdfUrl: url,
  });

  const toggleModalState = cb =>
    setModalState({ ...modalState, isOpen: !modalState.isOpen }, cb ?? cb());

  // modal state variables
  const { isOpen, pdfSelected, pdfUrl } = modalState;
  return (
    <div
      className="faf-pdf-alert-modal"
      style={{
        pointerEvents: 'all',
      }}
    >
      <Modal
        onClose={() => toggleModalState(removeNode)}
        secondaryButton={{
          action: () => {
            toggleModalState(removeNode);
          },
          text: 'Close',
        }}
        title="Adobe Reader DC Required"
        visible={isOpen}
      >
        <>
          <p className="vads-u-display--block vads-u-margin-bottom--3">
            <span>
              All PDF forms do not function fully in a web browser or other PDF
              viewer. Please download the form and use Adobe Acrobat Reader DC
              to fill out. For specific instructions about working with PDFs
            </span>{' '}
            <a href="https://www.va.gov/resources/how-to-download-and-open-a-vagov-pdf-form">
              please read our Resources and Support Article
            </a>
          </p>
          <a
            className="vads-u-display--block vads-u-margin-bottom--1p5"
            href="https://get.adobe.com/reader/"
            rel="noopener noreferrer"
          >
            <span>Get Acrobat Reader DC</span>
          </a>
          <a
            href={pdfUrl}
            className="vads-u-display--block vads-u-margin-bottom--3"
          >
            <i
              aria-hidden="true"
              className="fas fa-download fa-lg vads-u-margin-right--1"
              role="presentation"
            />
            <span>Download VA Form {pdfSelected}</span>
          </a>
        </>
      </Modal>
    </div>
  );
};

DownloadPDFModal.propTypes = {
  formNumber: PropTypes.string,
  removeNode: PropTypes.func,
  url: PropTypes.string,
};

export default DownloadPDFModal;
