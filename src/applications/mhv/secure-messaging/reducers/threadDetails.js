import { Actions } from '../util/actionTypes';
import { updateMessageInThread } from '../util/helpers';

const initialState = {
  drafts: undefined,
  messages: undefined,
  isLoading: false,
  replyToName: undefined,
  threadFolderId: undefined,
  replyToMessageId: undefined,
  cannotReply: false,
  threadViewCount: 5,
};

export const threadDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Thread.GET_THREAD:
      return {
        ...initialState,
        ...action.payload,
      };
    case Actions.Thread.GET_MESSAGE_IN_THREAD: {
      return {
        ...state,
        messages: updateMessageInThread(state.messages, action.response),
      };
    }
    case Actions.Thread.UPDATE_DRAFT_IN_THREAD: {
      return {
        ...state,
        drafts: state.drafts.map(d => {
          if (d.messageId === action.payload.messageId) {
            return { ...d, ...action.payload };
          }
          return d;
        }),
        isSaving: false,
        lastSaveTime: Date.now(),
      };
    }
    case Actions.Thread.DRAFT_SAVE_STARTED:
      return {
        ...state,
        isSaving: true,
        saveError: null,
      };
    case Actions.Draft.CREATE_SUCCEEDED:
      return {
        ...state,
        drafts: [action.response.data.attributes],
        isSaving: false,
        saveError: null,
        lastSaveTime: Date.now(),
      };
    case Actions.Draft.SAVE_FAILED:
      return {
        ...state,
        isSaving: false,
        lastSaveTime: null,
        saveError: { ...action.response },
      };
    case Actions.Thread.RESET_LAST_SAVE_TIME:
      return {
        ...state,
        lastSaveTime: null,
      };
    case Actions.Message.MOVE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Actions.Message.MOVE_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case Actions.Thread.CLEAR_THREAD:
      return initialState;
    case Actions.Thread.CANNOT_REPLY_ALERT: {
      return { ...state, cannotReply: action.payload };
    }
    case Actions.Thread.SET_THREAD_VIEW_COUNT: {
      return { ...state, threadViewCount: action.payload };
    }
    default:
      return state;
  }
};
