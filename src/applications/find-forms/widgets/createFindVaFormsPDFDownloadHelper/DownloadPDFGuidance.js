import React from 'react';
import ReactDOM from 'react-dom';
import recordEvent from '~/platform/monitoring/record-event';
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
  link,
  netWorkRequestError,
}) => {
  const div = document.createElement('div');
  div.className = 'faf-pdf-alert-modal-root';
  const parentEl = link.parentNode;

  if (formPdfIsValid && formPdfUrlIsValid && !netWorkRequestError) {
    ReactDOM.render(
      <DownloadPDFModal
        formNumber={formNumber}
        removeNode={removeReactRoot}
        url={downloadUrl}
      />,
      div,
    );

    parentEl.insertBefore(div, link); // Insert modal on DOM

    recordEvent({
      event: 'int-modal-click',
      'modal-status': 'opened',
      'modal-title': 'Download this PDF and open it in Acrobat Reader',
    });
  } else {
    let errorMessage = 'Find Forms - Form Detail - invalid PDF accessed';

    if (netWorkRequestError)
      errorMessage =
        'Find Forms - Form Detail - onDownloadLinkClick function error';

    if (!formPdfIsValid && !formPdfUrlIsValid)
      errorMessage =
        'Find Forms - Form Detail - invalid PDF accessed & invalid PDF link';

    if (formPdfIsValid && !formPdfUrlIsValid)
      errorMessage = 'Find Forms - Form Detail - invalid PDF link';

    sentryLogger(form, formNumber, downloadUrl, errorMessage);

    const alertBox = <InvalidFormDownload downloadUrl={downloadUrl} />;

    ReactDOM.render(alertBox, div);
    parentEl.insertBefore(div, link);
    parentEl.removeChild(link);
  }
};

export default DownloadPDFGuidance;
