import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import DownloadPDFModal from './DownloadPDFModal';
import InvalidFormDownload from './InvalidFormAlert';
import { sentryLogger } from './index';

const removeReactRoot = () => {
  const pdf = document.querySelector('.faf-pdf-alert-modal-root');
  pdf.remove();
};

const DownloadHandler = ({
  clickedId,
  downloadUrl,
  form,
  formNumber,
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

    ReactDOM.render(
      <Provider store={reduxStore}>
        <div
          className="faf-pdf-alert-modal"
          data-testid="faf-pdf-alert-modal"
          style={{
            pointerEvents: 'all',
          }}
        />
        <DownloadPDFModal
          clickedId={clickedId}
          formNumber={formNumber}
          removeNode={removeReactRoot}
          url={downloadUrl}
        />
      </Provider>,
      modalDiv,
    );

    pdfDownloadParent?.insertBefore(modalDiv, pdfDownloadButton);
  } else {
    const alertDiv = document.createElement('div');

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

    const alertBox = (
      <InvalidFormDownload
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
