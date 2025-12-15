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
import { getFirstError } from '../util/serverErrors';
import { sendDatadogError } from '../util/helpers';

const handleErrors = err => async dispatch => {
  const newErr = getFirstError(err);
  dispatch({
    type: Actions.Alerts.ADD_ALERT,
    payload: {
      alertType: 'error',
      header: newErr.title,
      content: newErr.detail,
      response: newErr,
    },
  });
};

export const getFolders = () => async dispatch => {
  try {
    const response = await getFolderList();
    if (response.data) {
      dispatch({
        type: Actions.Folder.GET_LIST,
        response,
      });
    }
    if (response.errors) {
      dispatch(handleErrors(response));
    }
  } catch (error) {
    sendDatadogError(error, 'action_folders_getFolders');
    dispatch(handleErrors(error));
    dispatch({
      type: Actions.Folder.GET_LIST_ERROR,
    });
  }
};

export const retrieveFolder = folderId => async dispatch => {
  await getFolder({ folderId })
    .then(response => {
      if (response.data) {
        if (
          response.data.attributes.folderId ===
          Constants.DefaultFolders.DELETED.id
        ) {
          response.data.attributes.name =
            Constants.DefaultFolders.DELETED.header;
        }
        dispatch({
          type: Actions.Folder.GET,
          response,
        });
      }
      if (response.errors) {
        dispatch({
          type: Actions.Folder.GET,
          response: null,
        });
        dispatch(handleErrors(response));
      }
    })
    .catch(error => {
      sendDatadogError(error, 'action_folders_getFolders');
      dispatch({
        type: Actions.Folder.GET,
        response: null,
      });
      dispatch(handleErrors(error));
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
    dispatch(getFolders());

    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Folder.CREATE_FOLDER_SUCCESS,
      ),
    );
    return response.data.attributes;
  } catch (e) {
    sendDatadogError(e, 'action_folders_getFolders');
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
  try {
    await deleteFolder(folderId);
    dispatch({ type: Actions.Folder.DELETE });
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Folder.DELETE_FOLDER_SUCCESS,
      ),
    );
  } catch (error) {
    sendDatadogError(error, 'action_folders_getFolders');
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_ERROR,
        '',
        Constants.Alerts.Folder.DELETE_FOLDER_ERROR,
      ),
    );
  }
};

export const renameFolder = (folderId, newName) => async dispatch => {
  try {
    await updateFolderName(folderId, newName);
    await dispatch(getFolders());
    await dispatch(retrieveFolder(folderId));
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Folder.RENAME_FOLDER_SUCCESS,
      ),
    );
  } catch (e) {
    sendDatadogError(e, 'action_folders_getFolders');
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
