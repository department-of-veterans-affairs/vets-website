import { Actions } from '../util/actionTypes';
import { updateMessageInThread, updateDrafts } from '../util/helpers';

const initialState = {
  acceptInterstitial: false,
  drafts: [],
  messages: undefined,
  isLoading: false,
  replyToName: undefined,
  threadFolderId: undefined,
  replyToMessageId: undefined,
  isStale: false,
  replyDisabled: false,
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
        drafts: updateDrafts(state.drafts).map(d => {
          if (d.messageId === action.payload.messageId) {
            return {
              ...d,
              ...action.payload,
              isSaving: false,
              lastSaveTime: Date.now(),
            };
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
        drafts:
          state.drafts?.length > 1
            ? state.drafts.map(d => {
                if (d.messageId === action.payload.messageId) {
                  return { ...d, isSaving: true, saveError: null };
                }
                return d;
              })
            : state.drafts,
        isSaving: true,
        saveError: null,
      };

    case Actions.Draft.CREATE_SUCCEEDED:
      return {
        ...state,
        drafts: [
          ...state.drafts,
          {
            ...action.response.data.attributes,
            isSaving: false,
            saveError: null,
            lastSaveTime: Date.now(),
          },
        ],
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
        drafts: state.drafts.map(d => {
          if (d.messageId === action.payload.messageId) {
            return {
              ...d,
              isSaving: false,
              lastSaveTime: null,
              saveError: { ...action.response },
            };
          }
          return d;
        }),
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
