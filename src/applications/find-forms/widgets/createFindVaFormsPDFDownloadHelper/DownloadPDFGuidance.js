import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import DownloadPDFModal from './DownloadPDFModal';
import InvalidFormDownload from './InvalidFormAlert';
import { sentryLogger } from './index';

const removeReactRoot = () => {
  const pdf = document.querySelector('.faf-pdf-alert-modal-root');
  pdf.remove();
};

// DownloadPDFGuidance sole purpose is to render the react widget depending on params (PDF is valid or not)
const DownloadPDFGuidance = ({
  downloadUrl,
  form,
  formNumber,
  formPdfIsValid,
  formPdfUrlIsValid,
  networkRequestError,
  reduxStore
}) => {
  const div = document.createElement('div');
  div.className = 'faf-pdf-alert-modal-root';
  const pdfDownloadContainer = document.getElementById('pdf-download-container');
  const pdfDownloadButton = document.getElementById('pdf-download-button');

  // if (formPdfIsValid && formPdfUrlIsValid && !networkRequestError) {
  if (true) {
    ReactDOM.render(
      <Provider store={reduxStore}>
        <DownloadPDFModal
          formNumber={formNumber}
          removeNode={removeReactRoot}
          url={downloadUrl}
        />
      </Provider>,
      div,
    );

    pdfDownloadContainer.insertBefore(div, pdfDownloadButton); // Insert modal on DOM
  } else {
    let errorMessage = 'Find Forms - Form Detail - invalid PDF accessed';

    if (networkRequestError) {
      errorMessage =
        'Find Forms - Form Detail - onDownloadLinkClick function error';
    }

    if (!formPdfIsValid && !formPdfUrlIsValid) {
      errorMessage =
        'Find Forms - Form Detail - invalid PDF accessed & invalid PDF link';
    }

    if (formPdfIsValid && !formPdfUrlIsValid) {
      errorMessage = 'Find Forms - Form Detail - invalid PDF link';
    }

    sentryLogger(form, formNumber, downloadUrl, errorMessage);

    const alertBox = <InvalidFormDownload downloadUrl={downloadUrl} />;

    ReactDOM.render(alertBox, div);
    pdfDownloadContainer.insertBefore(div, pdfDownloadButton);
    pdfDownloadContainer.removeChild(pdfDownloadButton);
  }
};

export default DownloadPDFGuidance;
