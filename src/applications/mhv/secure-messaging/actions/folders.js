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
  await getFolder(folderId)
    .then(response => {
      if (
        response.data.attributes.folderId ===
        Constants.DefaultFolders.DELETED.id
      ) {
        response.data.attributes.name = Constants.DefaultFolders.DELETED.header;
      }
      dispatch({
        type: Actions.Folder.GET,
        response,
      });
    })
    .catch(error => {
      dispatch({
        type: Actions.Folder.GET,
        response: null,
      });
      dispatch(
        addAlert(Constants.ALERT_TYPE_ERROR, '', error.errors[0].detail),
      );
    });
};

export const clearFolder = () => async dispatch => {
  dispatch({ type: Actions.Folder.CLEAR });
};

export const newFolder = folderName => async dispatch => {
  try {
    const response = await createFolder(folderName);

    dispatch({
      type: Actions.Folder.CREATE,
      response,
    });
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Folder.CREATE_FOLDER_SUCCESS,
      ),
    );
    return response.data.attributes;
  } catch (e) {
    if (e.errors && e.errors.length > 0 && e.errors[0].code === 'SM126') {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Folder.FOLDER_NAME_TAKEN,
        ),
      );
    } else {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Folder.CREATE_FOLDER_ERROR,
        ),
      );
    }
    throw e;
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
    if (e.errors && e.errors.length > 0 && e.errors[0].code === 'SM126') {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Folder.FOLDER_NAME_TAKEN,
        ),
      );
    } else {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Folder.RENAME_FOLDER_ERROR,
        ),
      );
    }
  }
};
