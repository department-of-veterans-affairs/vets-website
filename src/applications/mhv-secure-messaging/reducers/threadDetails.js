import { Actions } from '../util/actionTypes';
import { updateMessageInThread, updateDraft } from '../util/helpers';

const initialState = {
  acceptInterstitial: false,
  draft: null,
  messages: undefined,
  isLoading: false,
  replyToName: undefined,
  threadFolderId: undefined,
  replyToMessageId: undefined,
  cannotReply: false,
  draftInProgress: {
    messageId: null,
    category: null,
    subject: null,
    body: null,
    recipientId: null,
    recipientName: null,
    careSystemName: null,
    careSystemVhaId: null,
    attachments: [],
    navigationError: null,
    saveError: null,
    savedDraft: false,
  },
};

const draftHandler = (draft, payload) => {
  const updatedDraft = updateDraft(draft);
  if (draft.messageId === payload.messageId) {
    return {
      ...updatedDraft,
      ...payload,
      isSaving: false,
      lastSaveTime: Date.now(),
    };
  }
  return updatedDraft;
};

const draftErrorHandler = (draft, payload, response) => {
  if (draft.messageId === payload.messageId) {
    return {
      ...draft,
      isSaving: false,
      lastSaveTime: null,
      saveError: { ...response },
    };
  }
  return draft;
};

export const threadDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Thread.GET_THREAD:
      return {
        ...initialState,
        acceptInterstitial: state.acceptInterstitial,
        draftInProgress: { ...state.draftInProgress },
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
        draft: draftHandler(state.draft, action.payload),
        isSaving: false,
        lastSaveTime: Date.now(),
      };
    }
    case Actions.Thread.DRAFT_SAVE_STARTED:
      return {
        ...state,
        draft: {
          ...state.draft,
          isSaving: true,
          saveError: null,
        },
        isSaving: true,
        saveError: null,
      };

    case Actions.Draft.CREATE_SUCCEEDED:
      return {
        ...state,
        draft: {
          ...state.draft,
          ...action.response.data.attributes,
          isSaving: false,
          saveError: null,
          lastSaveTime: Date.now(),
        },
        draftInProgress: {
          ...state.draftInProgress,
          messageId: action.response.data.attributes.messageId,
        },
        isSaving: false,
        saveError: null,
        lastSaveTime: Date.now(),
      };
    case Actions.Draft.SAVE_FAILED:
      return {
        ...state,
        draft: draftErrorHandler(state.draft, action.payload, action.response),
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
      return {
        ...initialState,
        acceptInterstitial: state.acceptInterstitial,
        draftInProgress: { ...state.draftInProgress },
      };
    case Actions.Thread.CANNOT_REPLY_ALERT: {
      return { ...state, cannotReply: action.payload };
    }

    case Actions.Draft.UPDATE_DRAFT_IN_PROGRESS: {
      return {
        ...state,
        draftInProgress: {
          ...state.draftInProgress,
          ...action.payload,
        },
      };
    }

    case Actions.Draft.CLEAR_DRAFT_IN_PROGRESS:
      return {
        ...state,
        draftInProgress: {
          ...initialState.draftInProgress,
        },
      };

    case Actions.Draft.SET_ACCEPT_INTERSTITIAL: {
      return {
        ...state,
        acceptInterstitial: action.payload,
      };
    }

    default:
      return state;
  }
};
