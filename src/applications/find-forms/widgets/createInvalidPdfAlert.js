// Dependencies.
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

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

export async function onDownloadLinkClick(event) {
  event.preventDefault();

  const link = event.target;
  const downloadUrl = link.href;
  const formNumber = link.dataset.formNumber;

  // Default to true in case we encounter an error
  // determining validity through the API.
  let formPdfIsValid = true;
  let form = null;

  try {
    const forms = await fetchFormsApi(formNumber);
    form = forms.results.find(f => f.id === formNumber);
    formPdfIsValid = form?.attributes.validPdf;
  } catch (err) {
    // Todo
  }

  if (formPdfIsValid) {
    link.removeEventListener('click', onDownloadLinkClick);
    link.click();
  } else {
    Sentry.withScope(scope => {
      scope.setExtra('form API response', form);
      scope.setExtra('form number', formNumber);
      scope.setExtra('download link (invalid)', downloadUrl);
      Sentry.captureMessage('Find Forms - Form Detail - invalid PDF accessed');
    });

    const div = document.createElement('div');
    const alertBox = <InvalidFormDownload downloadUrl={downloadUrl} />;

    ReactDOM.render(alertBox, div);
    link.parentNode.insertBefore(div, link);
    link.remove();
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
