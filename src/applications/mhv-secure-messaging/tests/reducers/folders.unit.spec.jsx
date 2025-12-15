import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { createStore, applyMiddleware } from 'redux';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { foldersReducer } from '../../reducers/folders';
import foldersListResponse from '../fixtures/mock-api-responses/folders-list-response.json';
import createFolderResponse from '../fixtures/mock-api-responses/create-folder-response.json';
import {
  clearFolder,
  delFolder,
  getFolders,
  newFolder,
} from '../../actions/folders';

describe('folders reducer', () => {
  const mockStore = (initialState = { featureToggles: {} }) => {
    return createStore(foldersReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch a list of folders', async () => {
    const store = mockStore();
    mockApiRequest(foldersListResponse);
    await store.dispatch(getFolders());
    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      folderList: foldersListResponse.data.map(folder => {
        return {
          id: folder.attributes.folderId,
          name: folder.attributes.name,
          count: folder.attributes.count,
          unreadCount: folder.attributes.unreadCount,
          systemFolder: folder.attributes.systemFolder,
        };
      }),
    });
  });

  it('should dispatch an action on createFolder', async () => {
    const store = mockStore();
    mockApiRequest(createFolderResponse);
    await store.dispatch(newFolder(createFolderResponse.data.attributes.name));
    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      folder: createFolderResponse.data.attributes,
    });
  });

  it('should clear folder reducer value', async () => {
    const store = mockStore();
    await store.dispatch(clearFolder());
    expect(store.getState()).to.deep.equal({
      featureToggles: {},
      folder: {},
    });
  });

  it('should dispatch an action of delFolder', async () => {
    const initialState = {
      folder: undefined,
      folderList: undefined,
    };
    const store = mockStore(initialState);
    mockApiRequest({ method: 'DELETE', status: 204 });
    await store.dispatch(delFolder(1234));
    expect(store.getState()).to.deep.equal(initialState);
  });
});
