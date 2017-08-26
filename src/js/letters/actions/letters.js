import Raven from 'raven-js';

import { apiRequest } from '../utils/helpers.jsx';
import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  INVALID_ADDRESS_PROPERTY,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTER_PDF_FAILURE,
  GET_LETTER_PDF_SUCCESS,
  LETTER_ELIGIBILITY_ERROR,
  UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAILURE
} from '../utils/constants';

// Copied from the vets-api v0/address POST swagger; TODO: delete once
// actual form data is passed to updateAddress
const exampleAddress = {
  type: 'DOMESTIC',
  addressEffectiveDate: '1973-01-01T05:00:00.000+00:00',
  addressOne: '140 Rock Creek Church Rd NW',
  addressTwo: '',
  addressThree: '',
  city: 'Washington',
  stateCode: 'DC',
  zipCode: '20011',
  zipSuffix: '1865'
};

export function getLetterList() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters',
      null,
      response => dispatch({
        type: GET_LETTERS_SUCCESS,
        data: response,
      }),
      (response) => {
        const error = response.errors.length > 0 ? response.errors[0] : undefined;
        if (error) {
          if (error.status === '503' || error.status === '504') {
            // Either EVSS or a partner service is down or EVSS times out
            return dispatch({ type: BACKEND_SERVICE_ERROR });
          }
          if (error.status === '403') {
            // Backend authentication problem
            return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
          }
          if (error.status === '422') {
            // Something about the address is invalid, unable to process the request
            return dispatch({ type: INVALID_ADDRESS_PROPERTY });
          }
          if (error.status === '502') {
            // Some of the partner services are down, so we cannot verify the eligibility
            // of some letters
            return dispatch({ type: LETTER_ELIGIBILITY_ERROR });
          }
          return Promise.reject(
            new Error(`vets_letters_error_server_get: error status ${error.status}`)
          );
        }
        return Promise.reject(
          new Error('vets_letters_error_server_get: unknown error status')
        );
      })
      .catch((error) => {
        Raven.captureException(error);
        return dispatch({ type: GET_LETTERS_FAILURE });
      });
  };
}

export function getBenefitSummaryOptions() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters/beneficiary',
      null,
      response => dispatch({
        type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
        data: response,
      }),
      () => dispatch({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE })
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
    dispatch({ type: 'GET_LETTER_PDF_DOWNLOADING', data: letterType });
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
        window.URL.revokeObjectURL(downloadUrl);
        dispatch({ type: GET_LETTER_PDF_SUCCESS, data: letterType });
      },
      () => dispatch({ type: GET_LETTER_PDF_FAILURE, data: letterType })
    );
  };
}

export function updateBenefitSummaryRequestOption(propertyPath, value) {
  return {
    type: UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
    propertyPath,
    value
  };
}

export function updateAddress() {
  const settings = {
    method: 'PATCH',  // TODO: decide whether to use PATCH or PUT here; check with Alastair
    headers: { 'Content-Type': 'application/json' },
    // TODO: pass in an address argument instead of using exampleAddress
    body: JSON.stringify(exampleAddress)
  };
  return (dispatch) => {
    apiRequest(
      '/v0/address',
      settings,
      () => dispatch({ type: UPDATE_ADDRESS_SUCCESS }),
      () => dispatch({ type: UPDATE_ADDRESS_FAILURE })
    );
  };
}
