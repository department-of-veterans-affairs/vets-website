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
  dispatch({ type: Actions.Search.CLEAR });
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
      type: Actions.Search.RUN,
      response: { folder: folder.data.attributes, keyword, data: matches },
    });
  }
};

export const runAdvancedSearch = () => async dispatch => {
  dispatch({ type: Actions.Search.CLEAR });
  const response = await searchFolderAdvanced();
  if (response.errors) {
    dispatch({
      type: Actions.Alert.ADD_ALERT,
      payload: response.errors[0],
    });
  } else {
    dispatch({
      type: Actions.Search.RUN,
      response,
    });
  }
};

export const clearSearch = () => async dispatch => {
  dispatch({ type: Actions.Search.CLEAR });
};
