import { fetchFolders } from './folders';
import { fetchRecipients } from './compose';

export function initializeResources() {
  return dispatch => {
    return dispatch(fetchFolders()).then(() => {
      return dispatch(fetchRecipients());
    });
  };
}
