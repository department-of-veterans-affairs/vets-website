import {
  createUrlWithQuery,
  getFolderList,
  countUnreadMessages,
} from '../utils/helpers';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';

// Loading action types
export const LOADING_FOLDER = 'LOADING_FOLDER';
export const LOADING_RECIPIENTS = 'LOADING_RECIPIENTS';
export const LOADING_UNREAD_MESSAGES_COUNT = 'LOADING_UNREAD_MESSAGES_COUNT';

// Compose action types
export const FETCH_RECIPIENTS_FAILURE = 'FETCH_RECIPIENTS_FAILURE';
export const FETCH_RECIPIENTS_SUCCESS = 'FETCH_RECIPIENTS_SUCCESS';

// Folders action types
export const FETCH_FOLDER_FAILURE = 'FETCH_FOLDER_FAILURE';
export const FETCH_FOLDER_SUCCESS = 'FETCH_FOLDER_SUCCESS';

// Unread messages actions
export const FETCH_UNREAD_MESSAGES_COUNT_SUCCESS =
  'FETCH_UNREAD_MESSAGES_COUNT_SUCCESS';
export const FETCH_UNREAD_MESSAGES_COUNT_ERROR =
  'FETCH_UNREAD_MESSAGES_COUNT_ERROR';

export const ITEMS_PER_PAGE = 10;

const baseUrl = `${environment.API_URL}/my_health/v1/messaging`;

export const fetchUnreadMessagesCount = () => async dispatch => {
  dispatch({
    type: LOADING_UNREAD_MESSAGES_COUNT,
  });

  try {
    const folders = await getFolderList();

    const response = countUnreadMessages(folders);
    dispatch({
      type: FETCH_UNREAD_MESSAGES_COUNT_SUCCESS,
      unreadMessagesCount: response,
    });
  } catch (error) {
    const errors = error.errors ?? [error];
    dispatch({ type: FETCH_UNREAD_MESSAGES_COUNT_ERROR, errors });
  }
};

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

  try {
    const folderResponse = await apiRequest(`${baseUrl}${folderUrl}`);
    const messagesResponse = await apiRequest(`${baseUrl}${messagesUrl}`);

    dispatch({
      type: FETCH_FOLDER_SUCCESS,
      folder: folderResponse,
      messages: messagesResponse,
    });
  } catch (error) {
    const errors = error.errors ?? [error];
    dispatch({ type: FETCH_FOLDER_FAILURE, errors });
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
