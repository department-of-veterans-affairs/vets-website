import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import {
  apiRequest,
  getStatus,
  // eslint-disable-next-line -- LH_MIGRATION
  LH_MIGRATION__getEntryPoint
} from '../utils/helpers.jsx';
import {
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_FAILURE,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  LETTER_ELIGIBILITY_ERROR,
  LETTER_TYPES,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
  INVALID_ADDRESS_PROPERTY,
  LETTER_HAS_EMPTY_ADDRESS,
} from '../utils/constants';

// eslint-disable-next-line -- LH_MIGRATION
export function getLetterList(dispatch, LH_MIGRATION__options, shouldUseLettersDiscrepancies = false) {
  if (shouldUseLettersDiscrepancies) {
    // Call the endpoint to log evss vs lighthouse letter discrepancies
    apiRequest('/v0/letters_discrepancy');
  }

  // eslint-disable-next-line -- LH_MIGRATION
  return apiRequest(LH_MIGRATION__options.listEndpoint.path)
    .then(response => {
      // eslint-disable-next-line -- LH_MIGRATION
      const LH_MIGRATION__entryPointKeys = LH_MIGRATION__options.dataEntryPoint;
      // eslint-disable-next-line -- LH_MIGRATION
      const data = LH_MIGRATION__getEntryPoint(response, LH_MIGRATION__entryPointKeys)

      recordEvent({ event: 'letter-list-success' });
      return dispatch({ type: GET_LETTERS_SUCCESS, data });
    })
    .catch(response => {
      recordEvent({ event: 'letter-list-failure' });
      const status = getStatus(response);
      if (status === '403') {
        // Backend authentication problem
        dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
      } else if (status === '422') {
        // User has an invalid address for his or her letters
        dispatch({ type: INVALID_ADDRESS_PROPERTY });
      } else if (status === '502') {
        // Some of the partner services are down, so we cannot verify the
        // eligibility of some letters
        dispatch({ type: LETTER_ELIGIBILITY_ERROR });
      } else if (status === '503' || status === '504') {
        // Either EVSS or a partner service is down or EVSS times out
        dispatch({ type: BACKEND_SERVICE_ERROR });
      } else {
        dispatch({ type: GET_LETTERS_FAILURE });
      }

      Sentry.withScope(scope => {
        scope.setFingerprint(['{{ default }}', status]);
        Sentry.captureException(
          new Error(`vets_letters_error_getLetterList ${status}`),
        );
      });
      return Promise.reject();
    });
}

// eslint-disable-next-line -- LH_MIGRATION
export function getBenefitSummaryOptions(dispatch, LH_MIGRATION__options) {
  // eslint-disable-next-line -- LH_MIGRATION
  return apiRequest(LH_MIGRATION__options.summaryEndpoint.path)
    .then(response => {
      // eslint-disable-next-line -- LH_MIGRATION
      const LH_MIGRATION__entryPointKeys = LH_MIGRATION__options.dataEntryPoint;
      // eslint-disable-next-line -- LH_MIGRATION
      const data = LH_MIGRATION__getEntryPoint(response, LH_MIGRATION__entryPointKeys)

      recordEvent({ event: 'letter-get-bsl-success' });
      return dispatch({ type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS, data });
    })
    .catch(response => {
      recordEvent({ event: 'letter-get-bsl-failure' });
      dispatch({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE });
      const status = getStatus(response);
      throw new Error(`vets_letters_error_getBenefitSummaryOptions: ${status}`);
    });
}

// Call getLetterList then getBenefitSummaryOptions
// eslint-disable-next-line -- LH_MIGRATION
export function getLetterListAndBSLOptions(LH_MIGRATION__options, shouldUseLettersDiscrepancies) {
  return dispatch =>
    // eslint-disable-next-line -- LH_MIGRATION
    getLetterList(dispatch, LH_MIGRATION__options, shouldUseLettersDiscrepancies)
      // eslint-disable-next-line -- LH_MIGRATION
      .then(() => getBenefitSummaryOptions(dispatch, LH_MIGRATION__options))
      .catch(() => {});
}

export function getLetterPdfFailure(letterType) {
  recordEvent({
    event: 'letter-pdf-failure',
    'letter-type': letterType,
  });
  return { type: GET_LETTER_PDF_FAILURE, data: letterType };
}

// eslint-disable-next-line -- LH_MIGRATION
export function getLetterPdf(letterType, letterName, letterOptions, LH_MIGRATION__options) {
  let settings;
  if (letterType === LETTER_TYPES.benefitSummary) {
    settings = {
      // eslint-disable-next-line -- LH_MIGRATION
      method: LH_MIGRATION__options.downloadEndpoint.method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letterOptions),
    };
  } else {
    settings = {
      // eslint-disable-next-line -- LH_MIGRATION
      method: LH_MIGRATION__options.downloadEndpoint.method,
    };
  }

  return dispatch => {
    recordEvent({
      event: 'letter-pdf-pending',
      'letter-type': letterType,
    });
    dispatch({ type: GET_LETTER_PDF_DOWNLOADING, data: letterType });

    const { userAgent } = window.navigator;
    const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
    const webkit = !!userAgent.match(/WebKit/i);
    const isMobileSafari = iOS && webkit && !userAgent.match(/CriOS/i);
    // We handle IE10 separately but assume all other vets.gov-supported
    // browsers have blob URL support.
    // TODO: possibly want to explicitly check for blob URL support with something like
    // const blobSupported = !!(/^blob:/.exec(downloadUrl));
    const isIE = !!window.navigator.msSaveOrOpenBlob;
    const save = document.createElement('a');
    let downloadWindow;

    if (isMobileSafari) {
      // Instead of giving the file a readable name and downloading
      // it directly, open it in a new window with an ugly hash URL
      // NOTE: We're opening the window here because Safari won't open
      //  it as a result of an AJAX call--it has to be traced back to
      //  a user interaction.
      downloadWindow = window.open();
    }
    // eslint-disable-next-line -- LH_MIGRATION
    return apiRequest(`${LH_MIGRATION__options.downloadEndpoint.path}/${letterType}`, settings)
      .then(response => {
        let downloadUrl;
        response.blob().then(blob => {
          if (isIE) {
            window.navigator.msSaveOrOpenBlob(blob, `${letterName}.pdf`);
          } else {
            window.URL = window.URL || window.webkitURL;
            downloadUrl = window.URL.createObjectURL(blob);

            // Give the file a readable name if the download attribute is supported.
            if (typeof save.download !== 'undefined') {
              save.download = letterName;
            }
            save.href = downloadUrl;
            save.target = '_blank';
            document.body.appendChild(save);
            save.click();
            document.body.removeChild(save);

            if (isMobileSafari) {
              downloadWindow.location.href = downloadUrl;
            }
          }
        });
        window.URL.revokeObjectURL(downloadUrl);
        recordEvent({
          event: 'letter-pdf-success',
          'letter-type': letterType,
        });
        return dispatch({ type: GET_LETTER_PDF_SUCCESS, data: letterType });
      })
      .catch(response => {
        const status = getStatus(response);
        Sentry.withScope(scope => {
          scope.setFingerprint(['{{ default }}', status]);
          Sentry.captureException(
            new Error(
              `vets_letters_error_getLetterPdf_${letterType} ${status}`,
            ),
          );
        });
        return dispatch(getLetterPdfFailure(letterType));
      });
  };
}

export function updateBenefitSummaryRequestOption(propertyPath, value) {
  return {
    type: UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
    propertyPath,
    value,
  };
}

export const profileHasEmptyAddress = () => ({
  type: LETTER_HAS_EMPTY_ADDRESS,
});
