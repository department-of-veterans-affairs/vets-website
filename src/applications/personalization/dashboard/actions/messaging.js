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

export const fetchFolder = (id, query = {}) => async dispatch => {
  dispatch({
    type: LOADING_FOLDER,
    request: { id, query },
  });

  // Escape early if do not have a valid ID with which to fetch folders.
  if (!id && id !== 0) {
    dispatch({ type: FETCH_FOLDER_FAILURE, errors: [] });
    return;
  }

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

  try {
    const folderResponse = await apiRequest(`${baseUrl}${folderUrl}`);
    const messagesResponse = await apiRequest(`${baseUrl}${messagesUrl}`);

    // Escape early if there are errors in either API request.
    if (folderResponse?.errors || messagesResponse?.errors) {
      dispatch({
        type: FETCH_FOLDER_FAILURE,
        errors: [...folderResponse?.errors, ...messagesResponse?.errors],
      });
      return;
    }

    dispatch({
      type: FETCH_FOLDER_SUCCESS,
      folder: folderResponse,
      messages: messagesResponse,
    });
  } catch (error) {
    dispatch({ type: FETCH_FOLDER_FAILURE, errors: [] });
  }
};

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
