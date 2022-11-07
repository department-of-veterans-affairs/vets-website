import { Actions } from '../util/actionTypes';

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
};

export const draftDetailsReducer = (state = initialState, action) => {
  const { data, included } = action.response || {};
  const msgAttachments =
    included &&
    included.map(item => ({
      id: item.id,
      link: item.links.download,
      ...item.attributes,
    }));

  switch (action.type) {
    case Actions.Draft.GET: {
      return {
        ...state,
        lastSaveTime: null,
        draftMessage: {
          ...data.attributes,
          attachments: msgAttachments,
        },
      };
    }
    case Actions.Draft.GET_HISTORY: {
      return {
        ...state,
        draftMessageHistory: action.response.data.map(message => {
          const msgAttr = message.attributes.attributes;
          return {
            ...msgAttr,
          };
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
        draftMessage: {
          ...data.attributes,
          attachments: msgAttachments,
        },
      };
    case Actions.Draft.UPDATE_SUCCEEDED:
      return {
        ...state,
        isSaving: false,
        lastSaveTime: Date.now(),
        saveError: null,
      };
    case Actions.Draft.SAVE_FAILED:
      return {
        ...state,
        isSaving: false,
        lastSaveTime: null,
        saveError: action.response,
      };
    case Actions.Draft.CLEAR_DRAFT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
