import React from 'react';

const DownloadErrorHandler = ({
  formPdfIsValid,
  formPdfUrlIsValid,
  networkRequestError,
}) => {
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
};

export default DownloadErrorHandler;
