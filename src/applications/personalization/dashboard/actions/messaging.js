import { createUrlWithQuery } from '../utils/helpers';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import {
  mockFolderResponse,
  mockFolderErrorResponse,
} from '~/applications/personalization/dashboard-2/utils/mocks/messaging/folder';
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
    const errorHandler = error => {
      console.log('FETCH_FOLDER_FAILURE error', error);
      dispatch({ type: FETCH_FOLDER_FAILURE });
    };

    dispatch({
      type: LOADING_FOLDER,
      request: { id, query },
    });

    console.log('id', id);
    console.log('query', query);

    if (!id) {
      const folderUrl = `/folders/${id}`;
      const messagesUrl = createUrlWithQuery(`${folderUrl}/messages`, query);

      // Mock API endpoint if we need to and escape early.
      if (shouldMockApiRequest()) {
        console.log('shouldMockApiRequest');
        console.log('action', {
          type: FETCH_FOLDER_SUCCESS,
          folder: mockFolderResponse,
          messages: mockMessagesResponse,
        });
        dispatch({
          type: FETCH_FOLDER_SUCCESS,
          folder: mockFolderResponse,
          messages: mockMessagesResponse,
        });
        return;
      }

      // Make API requests to folder URL and messages URL.
      console.log('Make API requests to folder URL and messages URL.', [
        folderUrl,
        messagesUrl,
      ]);
      Promise.all(
        [folderUrl, messagesUrl].map(url =>
          apiRequest(`${baseUrl}${url}`)
            .then(response => response)
            .catch(errorHandler),
        ),
      )
        .then(data => {
          const folder = data?.[0];
          const messages = data?.[1];

          // If messages or folder response has errors, escape early.
          if (folder?.errors || messages?.errors) {
            throw new Error('Folder or messages have errors', data);
          }

          console.log('fetch folder Success', {
            type: FETCH_FOLDER_SUCCESS,
            folder,
            messages,
          });
          dispatch({
            type: FETCH_FOLDER_SUCCESS,
            folder,
            messages,
          });
        })
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
