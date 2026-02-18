import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { focusElement } from 'platform/utilities/ui/focus';
import { checkFormValidity, fetchFormsApi } from '../api';
import { createLogMessage } from '../helpers/datadogLogger';
import InvalidFormAlert from '../components/InvalidFormAlert';
import DownloadModal from '../components/DownloadModal';

export const renderDownloadModal = (
  clickedId,
  reduxStore,
  formName,
  url,
  pdfDownloadParent,
  pdfDownloadButton,
) => {
  const modalDiv = document.createElement('div');
  const modalId = 'ff-detail-modal';

  const closeModal = () => {
    const pdf = document.getElementById(modalId);
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
        formName={formName}
        formUrl={url}
        isOpen
        modalId={modalId}
      />
    </Provider>,
    modalDiv,
  );

  pdfDownloadParent?.insertBefore(modalDiv, pdfDownloadButton);
};

const onDownloadLinkClick = async (event, reduxStore) => {
  event.preventDefault();

  // Get form attributes from the content-build link
  const link = event.target;
  const { formNumber, href: downloadUrl } = link.dataset;

  // Call Forms API for form details, then filter down by the form name
  const results = await fetchFormsApi(formNumber, reduxStore.dispatch);
  const form = results?.filter(
    f => f?.attributes?.formName === link?.dataset?.formNumber,
  )?.[0];

  if (form?.attributes) {
    const { formName, url } = form.attributes;
    const {
      formPdfIsValid,
      formPdfUrlIsValid,
      networkRequestError,
    } = await checkFormValidity(form, 'Form Detail');

    const pdfDownloadButton = document.getElementById(link.id);
    let pdfDownloadParent = null;
    let isRelatedForm = false;

    // We need to inject some HTML alongside the content-build download link
    // so we must define the parent of that link
    if (link.id === 'main-download-button') {
      pdfDownloadParent = document.getElementById('main-download-container');
    } else {
      pdfDownloadParent = document.getElementById(`${link.id}-parent`);
      isRelatedForm = true;
    }

    // If we have a valid form, render the download modal
    if (formPdfIsValid && formPdfUrlIsValid && !networkRequestError) {
      renderDownloadModal(
        link.id,
        reduxStore,
        formName,
        url,
        pdfDownloadParent,
        pdfDownloadButton,
      );
    } else {
      // If the form is not valid, log to Datadog and render the error banner
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
  }
};

export default (reduxStore, widgetType) => {
  const downloadLinks = document.querySelectorAll(
    `[data-widget-type="${widgetType}"]`,
  );

  for (const downloadLink of [...downloadLinks]) {
    downloadLink.addEventListener('click', e =>
      onDownloadLinkClick(e, reduxStore),
    );
  }
};
