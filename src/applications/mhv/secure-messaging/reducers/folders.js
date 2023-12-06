import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The current in-focus folder, i.e. the folder being viewed by the user
   */
  folder: undefined,
  /**
   * The list of the current user's Secure Messaging folders
   * @type {array}
   */
  folderList: undefined,
};

export const foldersReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Folder.GET_LIST:
      return {
        ...state,
        folderList: action.response.data.map(folder => {
          return {
            id: folder.attributes.folderId,
            name: folder.attributes.name,
            count: folder.attributes.count,
            unreadCount: folder.attributes.unreadCount,
            systemFolder: folder.attributes.systemFolder,
          };
        }),
      };
    case Actions.Folder.GET_LIST_ERROR:
      return {
        ...state,
        folderList: [],
      };
    case Actions.Folder.GET:
    case Actions.Folder.CREATE:
      return {
        ...state,
        folder: !action.response ? null : action.response.data.attributes,
      };
    case Actions.Folder.CLEAR:
      return { ...state, folder: { ...initialState } };
    case Actions.Folder.DELETE:
      return {
        ...state,
        folder: undefined,
      };
    default:
      return state;
  }
};
