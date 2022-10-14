import { Actions } from '../util/actionTypes';
import {
  getFolderList,
  getFolder,
  createFolder,
  deleteFolder,
} from '../api/SmApi';

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

export const delFolder = folderId => async dispatch => {
  const response = await deleteFolder(folderId);
  if (response.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: response.errors[0],
    });
  } else {
    dispatch({
      type: Actions.Folder.DELETE,
      payload: folderId,
    });
  }
};
