import { fetchFormsApi } from '../api';
import { sentryLogger } from './sentryLogger';
import DownloadHandler from './DownloadHandler';

export async function onDownloadLinkClick(event, reduxStore) {
  // This function purpose is to determine if the PDF is valid on click.
  // Once it's done, it passes information to DownloadHandler() which determines what to render.
  event.preventDefault();

  const link = event.target;
  const { formNumber, href: downloadUrl } = link.dataset;

  // Default to true in case we encounter an error
  // determining validity through the API.
  let formPdfIsValid = true;
  let formPdfUrlIsValid = true;
  let networkRequestError = false;
  let form = null;

  try {
    const forms = await fetchFormsApi(formNumber);

    form = forms?.results.find(
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

      if (!response.ok) {
        formPdfUrlIsValid = false;
      }
    }
  } catch (err) {
    if (err) {
      networkRequestError = true;
    }

    sentryLogger(
      form,
      formNumber,
      downloadUrl,
      'Find Forms - Form Detail - onDownloadLinkClick function error',
    );
  }

  return DownloadHandler({
    clickedId: link.id,
    downloadUrl,
    form,
    formNumber,
    formPdfIsValid,
    formPdfUrlIsValid,
    networkRequestError,
    reduxStore,
  });
}

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
