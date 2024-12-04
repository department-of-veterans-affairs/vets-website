import download from 'downloadjs';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_FORM_PDF_URL_STARTED = 'FETCH_FORM_PDF_URL_STARTED';
export const FETCH_FORM_PDF_URL_SUCCEEDED = 'FETCH_FORM_PDF_URL_SUCCEEDED';
export const FETCH_FORM_PDF_URL_FAILED = 'FETCH_FORM_PDF_URL_FAILED';

const RECORD_PROPS = {
  event: `api_call`,
  'api-name': 'POST form pdf url',
};

const getFormPdfUrl = (formId, submissionGuid) => {
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
    body: JSON.stringify({ formId, submissionGuid }),
  };

  return apiRequest(
    `${environment.API_URL}/v0/my_va/submission_pdf_urls`,
    options,
  );
};

export const actionStart = guid => ({ type: FETCH_FORM_PDF_URL_STARTED, guid });

export const actionFail = (guid, error) => ({
  type: FETCH_FORM_PDF_URL_FAILED,
  guid,
  error,
});

export const actionSuccess = (guid, response) => ({
  type: FETCH_FORM_PDF_URL_SUCCEEDED,
  guid,
  ...response,
});

const recordFail = (errorKey = 'server error') =>
  recordEvent({
    ...RECORD_PROPS,
    'error-key': errorKey,
    'api-status': 'failed',
  });

const recordSuccess = () =>
  recordEvent({
    ...RECORD_PROPS,
    'api-status': 'successful',
  });

export const fetchFormPdfUrl = (formId, submissionGuid) => async dispatch => {
  dispatch(actionStart(submissionGuid));
  try {
    const response = await getFormPdfUrl(formId, submissionGuid);
    const { url } = response;
    if (!url) {
      throw new Error('Invalid form pdf url');
    }
    recordSuccess();
    // TODO: alternate mode for browsers/devices that don't support downloads or filesystem?
    download(url, undefined, 'application/pdf');
    return dispatch(actionSuccess(submissionGuid, response));
  } catch (error) {
    recordFail('internal error');
    dispatch(actionFail(error));
    throw new Error(error);
  }
};
