import { Actions } from '../util/actionTypes';
import { searchFolderAdvanced } from '../api/SmApi';

export const findByKeyword = (keyword, messages) => {
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

export const runAdvancedSearch = (
  folder,
  query,
  keyword,
  queryData = {},
) => async dispatch => {
  dispatch({ type: Actions.Search.START });
  try {
    const response = await searchFolderAdvanced(folder.folderId, query);
    const matches = findByKeyword(keyword, response.data);

    dispatch({
      type: Actions.Search.RUN_ADVANCED,
      response: {
        folder,
        keyword,
        query: { ...query, queryData },
        data: matches,
      },
    });
  } catch (error) {
    const err = error.errors[0];
    if (err.code === 'SM99' && err.status === '502') {
      dispatch({
        type: Actions.Search.RUN_ADVANCED,
        response: { folder, query: { ...query, queryData }, data: [] },
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

export const setSearchPage = page => async dispatch => {
  dispatch({ type: Actions.Search.SET_PAGE, payload: page });
};

export const clearSearchResults = () => async dispatch => {
  dispatch({ type: Actions.Search.CLEAR });
};
