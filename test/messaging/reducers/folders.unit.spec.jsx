import { expect } from 'chai';

import {
  CREATE_FOLDER_SUCCESS,
  DELETE_FOLDER_SUCCESS,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDERS_SUCCESS,
  TOGGLE_FOLDER_NAV,
  TOGGLE_MANAGED_FOLDERS
} from '../../../src/js/messaging/utils/constants';

import foldersReducer from '../../../src/js/messaging/reducers/folders';

describe('folders reducer', () => {
  const initialState = {
    data: {
      currentItem: {
        attributes: {},
        messages: [],
        pagination: {
          currentPage: 0,
          perPage: 0,
          totalEntries: 0,
          totalPages: 0
        },
        persistFolder: 0
      },
      items: []
    },
    ui: {
      nav: {
        foldersExpanded: false,
        visible: false
      }
    }
  };

  it('should create a folder', () => {
    const folder = {
      folderId: 1,
      name: 'test folder 1'
    };

    const newState = foldersReducer(initialState, {
      type: CREATE_FOLDER_SUCCESS,
      folder
    });

    expect(newState.data.items).to.have.lengthOf(1);
    expect(newState.data.items).to.contain(folder);
  });

  it('should delete a folder', () => {
    const state = {
      data: {
        items: [
          {
            folderId: 1,
            name: 'test folder 1'
          },
          {
            folderId: 2,
            name: 'test folder 2'
          },
          {
            folderId: 3,
            name: 'test folder 3'
          }
        ]
      }
    };

    const newState = foldersReducer(state, {
      type: DELETE_FOLDER_SUCCESS,
      folder: state.data.items[1]
    });

    expect(newState.data.items).to.have.lengthOf(2);
    expect(newState.data.items).to.contain(state.data.items[0]);
    expect(newState.data.items).to.contain(state.data.items[2]);
  });

  it('should set a folder fetched from the server', () => {
    const messages = {
      data: [
        {
          attributes: {
            messageId: 123,
            body: 'testing 123'
          }
        },
        {
          attributes: {
            messageId: 456,
            body: 'testing 456'
          }
        },
        {
          attributes: {
            messageId: 789,
            body: 'testing 789'
          }
        }
      ],
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 25,
          totalEntries: 3,
          totalPages: 1
        }
      }
    };

    const folder = {
      data: {
        attributes: {
          folderId: 1,
          name: 'test folder 1'
        }
      }
    };

    const newState = foldersReducer(initialState, {
      type: FETCH_FOLDER_SUCCESS,
      folder,
      messages
    });

    expect(newState.data.currentItem.attributes)
      .to.eql(folder.data.attributes);
    expect(newState.data.currentItem.messages)
      .to.eql(messages.data.map(message => message.attributes));
    expect(newState.data.currentItem.pagination)
      .to.eql(messages.meta.pagination);
  });

  it('should set folders fetched from the server', () => {
    const data = {
      data: [
        {
          attributes: {
            folderId: 123,
            name: 'test folder 123'
          }
        },
        {
          attributes: {
            folderId: 456,
            name: 'test folder 456'
          }
        },
        {
          attributes: {
            folderId: 789,
            name: 'test folder 789'
          }
        }
      ]
    };

    const newState = foldersReducer(initialState, {
      type: FETCH_FOLDERS_SUCCESS,
      data,
    });

    expect(newState.data.items)
      .to.eql(data.data.map(folder => folder.attributes));
  });

  it('should open and close the folder navigation', () => {
    let newState = foldersReducer(initialState, { type: TOGGLE_FOLDER_NAV });
    expect(newState.ui.nav.visible).to.be.true;
    newState = foldersReducer(newState, { type: TOGGLE_FOLDER_NAV });
    expect(newState.ui.nav.visible).to.be.false;
  });

  it('should expand and collapse managed folders', () => {
    let newState = foldersReducer(initialState, { type: TOGGLE_MANAGED_FOLDERS });
    expect(newState.ui.nav.foldersExpanded).to.be.true;
    newState = foldersReducer(newState, { type: TOGGLE_MANAGED_FOLDERS });
    expect(newState.ui.nav.foldersExpanded).to.be.false;
  });
});
