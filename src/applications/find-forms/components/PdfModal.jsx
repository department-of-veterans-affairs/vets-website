import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PdfModal = ({
  isOpen,
  pdfLabel = null,
  pdfUrl,
  pdfSelected,
  prevFocusedLink,
  searchResults = false,
  toggleModalState,
}) => {
  return (
    <VaModal
      onCloseEvent={() => {
        if (searchResults) {
          toggleModalState(pdfSelected, pdfUrl, pdfLabel, true);
        }

        toggleModalState();
        document.getElementById(prevFocusedLink).focus();
      }}
      modalTitle="Download this PDF and open it in Acrobat Reader"
      initialFocusSelector="#va-modal-title"
      visible={isOpen}
    >
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <p>
          Download this PDF to your desktop computer or laptop. Then use Adobe
          Acrobat Reader to open and fill out the form. Don’t try to open the
          PDF on a mobile device or fill it out in your browser.
        </p>{' '}
        <p className="vads-u-margin-top--0">
          If you want to fill out a paper copy, open the PDF in your browser and
          print it from there.
        </p>{' '}
        <a
          data-e2e-id="adobe-link"
          href="https://get.adobe.com/reader/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Acrobat Reader for free from Adobe
        </a>
        <a
          data-e2e-id="modal-download-link"
          href={pdfUrl}
          className="vads-u-margin-top--2"
          download
        >
          <va-icon
            className="vads-u-margin-right--1"
            icon="file_download"
            size="3"
          />
          <span className="vads-u-text-decoration--underline">
            Download VA Form {pdfSelected}
          </span>
        </a>
      </div>
    </VaModal>
  );
};

PdfModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  prevFocusedLink: PropTypes.node.isRequired,
  toggleModalState: PropTypes.func.isRequired,
  pdfLabel: PropTypes.string,
  pdfSelected: PropTypes.string,
  pdfUrl: PropTypes.string,
  searchResults: PropTypes.bool,
};

export default PdfModal;
