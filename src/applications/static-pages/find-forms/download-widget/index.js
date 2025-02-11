import { checkFormValidity, fetchFormsApi } from '../api';
import DownloadHandler from './DownloadHandler';

export async function onDownloadLinkClick(event, reduxStore) {
  event.preventDefault();

  const link = event.target;
  const { formNumber, href: downloadUrl } = link.dataset;
  let formValidityIndicators = null;

  const results = await fetchFormsApi(formNumber, reduxStore.dispatch);

  const form = results?.filter(
    f => f?.attributes?.formName === link?.dataset?.formNumber,
  )?.[0];

  if (form?.attributes) {
    formValidityIndicators = await checkFormValidity(form, 'Form Detail');
  }

  return DownloadHandler({
    clickedId: link.id,
    downloadUrl,
    form,
    formNumber,
    formPdfIsValid: formValidityIndicators?.formPdfIsValid,
    formPdfUrlIsValid: formValidityIndicators?.formPdfUrlIsValid,
    networkRequestError: formValidityIndicators?.networkRequestError,
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
