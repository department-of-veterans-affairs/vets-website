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

const recordFail = (r = recordEvent, errorKey = 'server error') =>
  r({
    ...RECORD_PROPS,
    'error-key': errorKey,
    'api-status': 'failed',
  });

const recordSuccess = (r = recordEvent) =>
  r({
    ...RECORD_PROPS,
    'api-status': 'successful',
  });

const validateUrl = ({ url }) => {
  if (!url) {
    throw new Error('Invalid form pdf url');
  }
  return url;
};

export const makeFetchFormPdfUrl = (r = recordEvent) => (
  formId,
  submissionGuid,
) => async dispatch => {
  dispatch(actionStart(submissionGuid));
  try {
    const response = await getFormPdfUrl(formId, submissionGuid);
    validateUrl(response);
    recordSuccess(r);
    return dispatch(actionSuccess(submissionGuid, response));
  } catch (error) {
    recordFail(r, 'internal error');
    dispatch(actionFail(submissionGuid, error));
    if (error.response && error.response.status === 400) {
      return {
        error:
          "Sorry, we're unable to generate a PDF at this time. You can try again later.",
      };
    }

    return {
      error:
        "You can't download a copy of your form right now. We're sorry. Check back later.",
    };
  }
};

export default makeFetchFormPdfUrl();
