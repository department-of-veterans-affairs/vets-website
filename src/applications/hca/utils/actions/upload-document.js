import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

import {
  UPLOAD_ATTACHMENT_PREFIX,
  UPLOAD_ATTACHMENT_ACTIONS,
} from '../constants';
import {
  isClientError,
  isServerError,
  parseErrors,
} from '../helpers/disability-rating';

/**
 * Action to fetch users total disability rating
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for disability rating
 */
export function uploadAttachment(fileData) {
  return dispatch => {
    const {
      UPLOAD_ATTACHMENT_STARTED,
      UPLOAD_ATTACHMENT_FAILED,
      UPLOAD_ATTACHMENT_SUCCEEDED,
    } = UPLOAD_ATTACHMENT_ACTIONS;
    const requestUrl = `${environment.API_URL}/v0/hca_attachments`;

    dispatch({ type: UPLOAD_ATTACHMENT_STARTED });

    const data = new FormData();
    data.append('hca_attachment[file_data]', fileData);

    const payload = {
      method: 'POST',
      body: data,
    };

    // console.log('payload', payload);

    return apiRequest(requestUrl, payload)
      .then(response => {
        recordEvent({
          event: `${UPLOAD_ATTACHMENT_PREFIX}-combined-load-success`,
        });
        return dispatch({ type: UPLOAD_ATTACHMENT_SUCCEEDED, response });
      })
      .catch(response => {
        // console.log('parse error', parseErrors(response));
        const { code, detail } = parseErrors(response);
        let message;

        if (isServerError(code)) {
          message = `${code} internal error`;
        } else if (isClientError(code)) {
          message = `${code} no combined rating found`;
        }

        recordEvent({
          event: `${UPLOAD_ATTACHMENT_PREFIX}-failed`,
          'error-key': message,
        });
        return dispatch({
          type: UPLOAD_ATTACHMENT_FAILED,
          error: { code, detail },
        });
      });
  };
}
