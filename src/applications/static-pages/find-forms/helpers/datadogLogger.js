import { datadogLogger } from '../hooks/useFindFormsBrowserMonitoring';

export const createLogMessage = ({
  downloadUrl,
  form,
  formPdfIsValid,
  formPdfUrlIsValid,
  networkRequestError,
}) => {
  let errorMessage;

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

  datadogLogger(form, downloadUrl, errorMessage);
};
