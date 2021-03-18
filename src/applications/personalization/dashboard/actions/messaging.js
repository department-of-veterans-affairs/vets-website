import { createUrlWithQuery } from '../utils/helpers';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import { mockFolderResponse } from '~/applications/personalization/dashboard-2/utils/mocks/messaging/folder';
import { mockMessagesResponse } from '~/applications/personalization/dashboard-2/utils/mocks/messaging/messages';
import { shouldMockApiRequest } from '~/applications/personalization/dashboard/tests/helpers';
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

      if (shouldMockApiRequest()) {
        dispatch({
          type: FETCH_FOLDER_SUCCESS,
          folder: mockFolderResponse,
          messages: mockMessagesResponse,
        });

        return;
      }

      Promise.all(
        [folderUrl, messagesUrl].map(url =>
          apiRequest(`${baseUrl}${url}`)
            .then(response => response)
            .catch(errorHandler),
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

    apiRequest(`${baseUrl}${url}`)
      .then(recipients =>
        dispatch({ type: FETCH_RECIPIENTS_SUCCESS, recipients }),
      )
      .catch(response =>
        dispatch({ type: FETCH_RECIPIENTS_FAILURE, errors: response.errors }),
      );
  };
}
