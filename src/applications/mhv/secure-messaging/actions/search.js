import { Actions } from '../util/actionTypes';
import {
  getFolder,
  getMessageListAll,
  searchFolderAdvanced,
} from '../api/SmApi';

const findByKeyword = (keyword, messages) => {
  return messages.filter(message => {
    const { subject, senderName, recipientName } = message.attributes;
    return (
      (subject && subject.toLowerCase().includes(keyword)) ||
      (senderName && senderName.toLowerCase().includes(keyword)) ||
      (recipientName && recipientName.toLowerCase().includes(keyword))
    );
  });
};

export const runBasicSearch = (folderId, keyword) => async dispatch => {
  dispatch({ type: Actions.Search.START });
  const folder = await getFolder(folderId);
  const folderContents = await getMessageListAll(folderId);
  const matches = findByKeyword(keyword, folderContents.data);

  if (folder.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: folder.errors[0],
    });
  } else if (folderContents.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: folderContents.errors[0],
    });
  } else {
    dispatch({
      type: Actions.Search.RUN_BASIC,
      response: { folder: folder.data.attributes, keyword, data: matches },
    });
  }
};

export const runAdvancedSearch = (folder, query) => async dispatch => {
  dispatch({ type: Actions.Search.START });
  try {
    const response = await searchFolderAdvanced(folder.id, query);
    dispatch({
      type: Actions.Search.RUN_ADVANCED,
      response: { folder, query, data: response.data },
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
