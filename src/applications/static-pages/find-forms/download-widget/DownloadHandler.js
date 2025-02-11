import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { focusElement } from 'platform/utilities/ui/focus';
import DownloadPDFModal from './DownloadPDFModal';
import InvalidFormAlert from '../components/InvalidFormAlert';
import { createLogMessage } from '../helpers/sentryLogger';
import DownloadModal from '../components/DownloadModal';

const DownloadHandler = ({
  clickedId,
  downloadUrl,
  form,
  formPdfIsValid,
  formPdfUrlIsValid,
  networkRequestError,
  reduxStore,
}) => {
  const pdfDownloadButton = document.getElementById(clickedId);
  let pdfDownloadParent = null;
  let isRelatedForm = false;

  if (clickedId === 'main-download-button') {
    pdfDownloadParent = document.getElementById('main-download-container');
  } else {
    pdfDownloadParent = document.getElementById(`${clickedId}-parent`);
    isRelatedForm = true;
  }

  if (formPdfIsValid && formPdfUrlIsValid && !networkRequestError) {
    const modalDiv = document.createElement('div');

    const closeModal = () => {
      const pdf = document.querySelector('.pdf-alert-modal');
      pdf.remove();

      const lastDownloadLinkClicked = document.getElementById(clickedId);
      focusElement(lastDownloadLinkClicked);
    };

    ReactDOM.render(
      <Provider store={reduxStore}>
        <div
          className="faf-pdf-alert-modal"
          data-testid="faf-pdf-alert-modal"
          style={{
            pointerEvents: 'all',
          }}
        />
        <DownloadModal
          closeModal={closeModal}
          formName={form?.formName}
          isOpen
          selectedPdfId={clickedId}
          pdfUrl={downloadUrl}
        />
        {/* <DownloadPDFModal
          clickedId={clickedId}
          formNumber={form?.formName}
          removeNode={removeReactRoot}
          url={downloadUrl}
        /> */}
      </Provider>,
      modalDiv,
    );

    pdfDownloadParent?.insertBefore(modalDiv, pdfDownloadButton);
  } else {
    const alertDiv = document.createElement('div');

    createLogMessage(
      downloadUrl,
      form,
      formPdfIsValid,
      formPdfUrlIsValid,
      networkRequestError,
    );

    const alertBox = (
      <InvalidFormAlert
        isRelatedForm={isRelatedForm}
        downloadUrl={downloadUrl}
      />
    );

    ReactDOM.render(alertBox, alertDiv);

    pdfDownloadParent?.insertBefore(alertDiv, pdfDownloadButton);
    pdfDownloadParent?.removeChild(pdfDownloadButton);
  }
};

DownloadHandler.propTypes = {
  clickedId: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  formNumber: PropTypes.string.isRequired,
  formPdfIsValid: PropTypes.bool.isRequired,
  formPdfUrlIsValid: PropTypes.bool.isRequired,
  networkRequestError: PropTypes.bool.isRequired,
  reduxStore: PropTypes.object.isRequired,
};

export default DownloadHandler;
