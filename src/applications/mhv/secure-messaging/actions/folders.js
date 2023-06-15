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
  // dispatch({ type: Actions.Folder.CLEAR });
  let folder;
  const response = await getFolder(folderId);
  if (response.errors) {
    dispatch({
      type: Actions.Alerts.ADD_ALERT,
      payload: response.errors[0],
    });
  } else {
    if (response.data.attributes.folderId === -3) {
      folder = {
        data: {
          attributes: {
            count: response.data.attributes.count,
            folderId: response.data.attributes.folderId,
            name: 'Trash',
            systemFolder: response.data.attributes.systemFolder,
            unreadCount: response.data.attributes.unreadCount,
          },
        },
      };
    } else {
      folder = response;
    }
    dispatch({
      type: Actions.Folder.GET,
      response: folder,
    });
  }
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
