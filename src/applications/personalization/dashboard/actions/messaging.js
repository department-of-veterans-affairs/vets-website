import { createUrlWithQuery } from '../utils/helpers';
import environment from '../../../../platform/utilities/environment';
import { apiRequest } from '../../../../platform/utilities/api';

import {
  FETCH_FOLDER_FAILURE,
  FETCH_FOLDER_SUCCESS,
  LOADING_FOLDER,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  LOADING_RECIPIENTS,
} from '../utils/constants';

const baseUrl = `${environment.API_URL}/v0/messaging/health`;

export function fetchFolder(id, query = {}) {
  return dispatch => {
    const errorHandler = () => dispatch({ type: FETCH_FOLDER_FAILURE });

    dispatch({
      type: LOADING_FOLDER,
      request: { id, query },
    });

    if (id !== null) {
      const folderUrl = `/folders/${id}`;
      const messagesUrl = createUrlWithQuery(`${folderUrl}/messages`, query);

      Promise.all(
        [folderUrl, messagesUrl].map(url =>
          apiRequest(
            `${baseUrl}${url}`,
            null,
            response => response,
            errorHandler,
          ),
        ),
      )
        .then(data =>
          dispatch({
            type: FETCH_FOLDER_SUCCESS,
            folder: data[0],
            messages: data[1],
          }),
        )
        .catch(errorHandler);
    } else {
      errorHandler();
    }
  };
}

export function fetchRecipients() {
  const url = '/recipients';
  return dispatch => {
    dispatch({ type: LOADING_RECIPIENTS });

    apiRequest(
      `${baseUrl}${url}`,
      null,
      recipients => dispatch({ type: FETCH_RECIPIENTS_SUCCESS, recipients }),
      response =>
        dispatch({ type: FETCH_RECIPIENTS_FAILURE, errors: response.errors }),
    );
  };
}
