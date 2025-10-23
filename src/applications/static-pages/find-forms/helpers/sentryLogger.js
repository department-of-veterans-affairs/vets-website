import * as Sentry from '@sentry/browser';

// HOF for reusable situations in Component.
export function sentryLogger(form, downloadUrl, message) {
  return Sentry.withScope(scope => {
    scope.setExtra('form API response', form);
    scope.setExtra('form number', form?.formName);
    scope.setExtra('download link (invalid)', downloadUrl);
    Sentry.captureMessage(message);
  });
}

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

  sentryLogger(form, downloadUrl, errorMessage);
};
