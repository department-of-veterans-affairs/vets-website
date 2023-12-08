import { Actions } from '../util/actionTypes';
import { updateMessageInThread } from '../util/helpers';

const initialState = {
  /**
   * The draft message that the user is currently composing
   */
  draftMessage: undefined,
  /**
   * The message history for the current draft message
   * @type {array}
   */
  draftMessageHistory: undefined,
  replyToMessageId: undefined,
};

export const draftDetailsReducer = (state = initialState, action) => {
  const { data } = action.response || {};

  switch (action.type) {
    case Actions.Draft.GET: {
      return {
        ...state,
        lastSaveTime: null,
        replyToMessageId: data.replyToMessageId,
        draftMessage: {
          replyToName: data.replyToName,
          threadFolderId: data.threadFolderId,
          ...data.attributes,
        },
      };
    }
    case Actions.Draft.GET_HISTORY: {
      return {
        ...state,
        draftMessageHistory: action.response.data.map(message => {
          return message.attributes;
        }),
      };
    }
    case Actions.Draft.SAVE_STARTED:
      return {
        ...state,
        isSaving: true,
        saveError: null,
      };
    case Actions.Draft.AUTO_SAVE_STARTED:
      return {
        ...state,
        saveError: null,
      };
    case Actions.Draft.CREATE_SUCCEEDED:
      return {
        ...state,
        isSaving: false,
        lastSaveTime: Date.now(),
        saveError: null,
        replyToMessageId: data.attributes.messageId,
        draftMessage: {
          ...data.attributes,
        },
      };
    case Actions.Draft.SAVE_FAILED:
      return {
        ...state,
        isSaving: false,
        lastSaveTime: null,
        saveError: { ...action.response },
      };
    case Actions.Draft.CLEAR_DRAFT:
      return {
        ...initialState,
      };
    case Actions.Draft.GET_IN_THREAD: {
      return {
        ...state,
        draftMessageHistory: updateMessageInThread(
          state.draftMessageHistory,
          action.response,
        ),
      };
    }
    default:
      return state;
  }
};
