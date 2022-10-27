import { Actions } from '../util/actionTypes';
import {
  getFolderList,
  getFolder,
  createFolder,
  deleteFolder,
  updateFolderName,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

export const getFolders = () => async dispatch => {
  try {
    const response = await getFolderList();
    dispatch({
      type: Actions.Folder.GET_LIST,
      response,
    });
  } catch (error) {
    const err = error.errors[0];
    dispatch({
      type: Actions.Alerts.ADD_ALERT,
      payload: {
        alertType: 'error',
        header: err.title,
        content: err.detail,
        response: err,
      },
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
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Folder.DELETE_FOLDER_ERROR,
      ),
    );
  } else {
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Folder.DELETE_FOLDER_SUCCESS,
      ),
    );
  }
};

export const renameFolder = (folderId, newName) => async dispatch => {
  try {
    await updateFolderName(folderId, newName);
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Folder.RENAME_FOLDER_SUCCESS,
      ),
    );
  } catch (e) {
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Folder.RENAME_FOLDER_ERROR,
      ),
    );
  }
};
