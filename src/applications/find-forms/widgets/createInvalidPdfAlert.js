// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { fetchFormsApi } from '../api';

function InvalidFormDownload({ downloadUrl }) {
  const subject = encodeURIComponent('Bad PDF link');
  const body = encodeURIComponent(
    `I tried to download this form but the link doesn't work: ${downloadUrl}`,
  );
  const mailto = `mailto:VaFormsManagers@va.gov?subject=${subject}&body=${body}`;

  return (
    <AlertBox
      isVisible
      status="error"
      headline="This form link isn’t working"
      content={
        <>
          We’re sorry, but the form you’re trying to download appears to have an
          invalid link. Please <a href={mailto}>email the forms managers</a> for
          help with this form.
        </>
      }
    />
  );
}

// HOF for reusable situations in Component.
function sentryLogger(form, formNumber, downloadUrl, message) {
  return Sentry.withScope(scope => {
    scope.setExtra('form API response', form);
    scope.setExtra('form number', formNumber);
    scope.setExtra('download link (invalid)', downloadUrl);
    Sentry.captureMessage(message);
  });
}

export async function onDownloadLinkClick(event) {
  event.preventDefault();

  const link = event.target;
  const downloadUrl = link.href;
  const formNumber = link.dataset.formNumber;

  // Default to true in case we encounter an error
  // determining validity through the API.
  let formPdfIsValid = true;
  let formPdfUrlIsValid = true;
  let netWorkRequestError = false;
  let form = null;

  try {
    const forms = await fetchFormsApi(formNumber);
    form = forms.results.find(f => f.id === formNumber);
    formPdfIsValid = form?.attributes.validPdf;

    const isSameOrigin = downloadUrl?.startsWith(window.location.origin);
    if (formPdfIsValid && isSameOrigin) {
      // URLS can be entered invalid, 400 is returned, this checks to make sure href is valid
      // NOTE: There are Forms URLS under the https://www.vba.va.gov/ domain, we don't have a way currently to check if URL is valid on FE because of CORS
      const response = await fetch(downloadUrl, {
        method: 'HEAD', // HEAD METHOD SHOULD NOT RETURN BODY, WE ONLY CARE IF REQ WAS SUCCESSFUL
      });
      if (!response.ok) formPdfUrlIsValid = false;
    }
  } catch (err) {
    if (err) netWorkRequestError = true;

    sentryLogger(
      form,
      formNumber,
      downloadUrl,
      'Find Forms - Form Detail - onDownloadLinkClick function error',
    );
  }

  if (formPdfIsValid && formPdfUrlIsValid && !netWorkRequestError) {
    link.removeEventListener('click', onDownloadLinkClick);
    link.click();
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

    const div = document.createElement('div');
    const alertBox = <InvalidFormDownload downloadUrl={downloadUrl} />;

    ReactDOM.render(alertBox, div);
    const parentEl = link.parentNode;
    parentEl.insertBefore(div, link);
    parentEl.removeChild(link);
  }
}

export default (store, widgetType) => {
  const downloadLinks = document.querySelectorAll(
    `[data-widget-type="${widgetType}"]`,
  );

  for (const downloadLink of [...downloadLinks]) {
    downloadLink.addEventListener('click', onDownloadLinkClick);
  }
};
