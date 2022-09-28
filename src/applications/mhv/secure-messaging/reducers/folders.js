import { Actions } from '../util/actionTypes';

const initialState = {
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
    case 'b':
    default:
      return state;
  }
};
