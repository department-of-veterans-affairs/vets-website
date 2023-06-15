import { Actions } from '../util/actionTypes';
import {
  getFolder,
  getMessageListAll,
  searchFolderAdvanced,
} from '../api/SmApi';

const findByKeyword = (keyword, messages) => {
  const parsedMessageId = parseInt(keyword, 10);
  return messages.filter(message => {
    const {
      subject,
      senderName,
      recipientName,
      messageId,
    } = message.attributes;
    return (
      (messageId && messageId === parsedMessageId) ||
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

export const runAdvancedSearch = (folder, query, keyword) => async dispatch => {
  dispatch({ type: Actions.Search.START });
  try {
    const response = await searchFolderAdvanced(folder.folderId, query);
    const matches = findByKeyword(keyword, response.data);

    dispatch({
      type: Actions.Search.RUN_ADVANCED,
      response: { folder, keyword, query, data: matches },
    });
  } catch (error) {
    const err = error.errors[0];
    if (err.code === 'SM99' && err.status === '502') {
      dispatch({
        type: Actions.Search.RUN_ADVANCED,
        response: { folder, query, data: [] },
      });
    } else {
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
  }
};

export const setSearchSort = sort => async dispatch => {
  dispatch({ type: Actions.Search.SET_SORT, payload: sort });
};

export const clearSearchResults = () => async dispatch => {
  dispatch({ type: Actions.Search.CLEAR });
};
