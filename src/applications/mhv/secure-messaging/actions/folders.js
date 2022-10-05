import { Actions } from '../util/actionTypes';
import { getFolderList, getFolder, createFolder } from '../api/SmApi';

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

export const newFolder = folderName => async dispatch => {
  const response = await createFolder(folderName);
  if (response.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: response.errors[0],
    });
  } else {
    dispatch({
      type: Actions.Folder.CREATE,
      payload: folderName,
    });
  }
};
