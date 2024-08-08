import * as Sentry from '@sentry/browser';
import { fetchFormsApi } from '../../api';
import DownloadPDFGuidance from './DownloadPDFGuidance';

// HOF for reusable situations in Component.
export function sentryLogger(form, formNumber, downloadUrl, message) {
  return Sentry.withScope(scope => {
    scope.setExtra('form API response', form);
    scope.setExtra('form number', formNumber);
    scope.setExtra('download link (invalid)', downloadUrl);
    Sentry.captureMessage(message);
  });
}

export async function onDownloadLinkClick(event) {
  // This function purpose is to determine if the PDF is valid on click.
  // Once it's done, it passes information to DownloadPDFGuidance() which determines what to render.
  event.preventDefault();
  const link = event.target;
  const downloadUrl = link.href;
  const { formNumber } = link.dataset;

  // Default to true in case we encounter an error
  // determining validity through the API.
  let formPdfIsValid = true;
  let formPdfUrlIsValid = true;
  let netWorkRequestError = false;
  let form = null;

  try {
    const forms = await fetchFormsApi(formNumber);

    form = forms.results.find(
      f => f?.attributes?.formName === link?.dataset?.formNumber,
    );

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

  return DownloadPDFGuidance({
    downloadUrl,
    form,
    formNumber,
    formPdfIsValid,
    formPdfUrlIsValid,
    link,
    netWorkRequestError,
  });
}

export default widgetType => {
  const downloadLinks = document.querySelectorAll(
    `[data-widget-type="${widgetType}"]`,
  );

  for (const downloadLink of [...downloadLinks]) {
    downloadLink.addEventListener('click', e => onDownloadLinkClick(e));
  }
};
