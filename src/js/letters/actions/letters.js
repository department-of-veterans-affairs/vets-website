import { apiRequest } from '../utils/helpers';

export function getLetterList() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters',
      null,
      response => dispatch({
        type: 'GET_LETTERS_SUCCESS',
        data: response,
      }),
      () => dispatch({ type: 'GET_LETTERS_FAILURE' })
    );
  };
}

export function getBenefitSummaryOptions() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters/beneficiary',
      null,
      response => dispatch({
        type: 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS',
        data: response,
      }),
      () => dispatch({ type: 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE' })
    );
  };
}

export function getLetterPdf(letterType, letterName, letterOptions) {
  let settings;
  if (letterType === 'benefit_summary') {
    settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letterOptions)
    };
  } else {
    settings = {
      method: 'POST'
    };
  }

  // We handle IE10 separately but assume all other vets.gov-supported
  // browsers have blob URL support.
  // TODO: possibly want to explicitly check for blob URL support with something like
  // const blobSupported = !!(/^blob:/.exec(downloadUrl));
  const ie10 = !!window.navigator.msSaveOrOpenBlob;
  const save = document.createElement('a');
  let downloadWindow;
  const downloadSupported = typeof save.download !== 'undefined';
  if (!downloadSupported) {
    // Instead of giving the file a readable name and downloading
    // it directly, open it in a new window with an ugly hash URL
    downloadWindow = window.open();
  }
  let downloadUrl;
  return (dispatch) => {
    apiRequest(
      `/v0/letters/${letterType}`,
      settings,
      response => {
        response.blob().then(blob => {
          if (ie10) {
            window.navigator.msSaveOrOpenBlob(blob, letterName);
          } else {
            window.URL = window.URL || window.webkitURL;
            downloadUrl = window.URL.createObjectURL(blob);
            if (downloadSupported) {
              // Give the file a readable name if the download attribute is supported.
              save.download = letterName;
              save.href = downloadUrl;
              save.target = '_blank';
              document.body.appendChild(save);
              save.click();
              document.body.removeChild(save);
            } else {
              downloadWindow.location.href = downloadUrl;
            }
          }
        });
        window.URL.revokeObjectURL(downloadUrl); // make sure this doesn't cause problems
        dispatch({ type: 'GET_LETTER_PDF_SUCCESS' });
      },
      () => dispatch({ type: 'GET_LETTER_PDF_FAILURE', data: letterType })
    );
  };
}


export function updateBenefitSummaryRequestOption(propertyPath, value) {
  return {
    type: 'UPDATE_BENFIT_SUMMARY_REQUEST_OPTION',
    propertyPath,
    value
  };
}
