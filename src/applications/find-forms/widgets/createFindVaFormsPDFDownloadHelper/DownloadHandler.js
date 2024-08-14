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
  const div = document.createElement('div');
  div.className = 'faf-pdf-alert-modal-root';

  const pdfDownloadContainer = document.getElementById(
    'main-download-container',
  );
  const pdfDownloadButton = document.getElementById('main-download-button');

  if (formPdfIsValid && formPdfUrlIsValid && !networkRequestError) {
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
      div,
    );

    pdfDownloadContainer?.insertBefore(div, pdfDownloadButton);
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
    pdfDownloadContainer?.insertBefore(div, pdfDownloadButton);
    pdfDownloadContainer?.removeChild(pdfDownloadButton);
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
