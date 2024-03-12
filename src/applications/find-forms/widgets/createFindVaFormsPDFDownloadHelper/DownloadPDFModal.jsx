import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '~/platform/monitoring/record-event';

// DownloadPDFModal is state wrapper + modal for PDF guidance upon PDf being valid
const DownloadPDFModal = ({ formNumber, removeNode, url }) => {
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
      <VaModal
        onCloseEvent={() => {
          toggleModalState();
          recordEvent({
            event: 'int-modal-click',
            'modal-status': 'closed',
            'modal-title': 'Download this PDF and open it in Acrobat Reader',
          });
        }}
        modalTitle="Download this PDF and open it in Acrobat Reader"
        visible={isOpen}
        uswds
      >
        <>
          <p>
            Download this PDF to your desktop computer or laptop. Then use Adobe
            Acrobat Reader to open and fill out the form. Don’t try to open the
            PDF on a mobile device or fill it out in your browser.
          </p>{' '}
          <p>
            If you just want to fill out a paper copy, open the PDF in your
            browser and print it from there.
          </p>{' '}
          <a
            href="https://get.adobe.com/reader/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Acrobat Reader for free from Adobe
          </a>
          <a
            href={pdfUrl}
            className="usa-button vads-u-margin-top--2"
            role="button"
            rel="noreferrer noopener"
            onClick={() => {
              recordEvent({
                event: 'int-modal-click',
                'modal-status': 'open',
                'modal-title':
                  'Download this PDF and open it in Acrobat Reader',
                'modal-primaryButton-text': `Download VA Form ${pdfSelected}`,
              });
            }}
          >
            Download VA Form {pdfSelected}
          </a>
        </>
      </VaModal>
    </div>
  );
};

DownloadPDFModal.propTypes = {
  formNumber: PropTypes.string,
  removeNode: PropTypes.func,
  url: PropTypes.string,
};

export default DownloadPDFModal;
