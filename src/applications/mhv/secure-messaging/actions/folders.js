import { Actions } from '../util/actionTypes';
import { getFolderList, getFolder } from '../api/SmApi';

export const getFolders = () => async dispatch => {
  const response = await getFolderList();
  if (response.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: response.errors[0],
    });
  } else {
    dispatch({
      type: Actions.Folder.GET_LIST,
      response,
    });
  }
};

export const retrieveFolder = folderId => async dispatch => {
  dispatch({ type: Actions.Folder.CLEAR });
  const response = await getFolder(folderId);
  if (response.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: response.errors[0],
    });
  } else {
    dispatch({
      type: Actions.Folder.GET,
      response,
    });
  }
};
