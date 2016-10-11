import { expect } from 'chai';

import foldersReducer from '../../../src/js/messaging/reducers/folders';

import {
  CREATE_FOLDER_SUCCESS,
  DELETE_FOLDER_SUCCESS,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDERS_SUCCESS,
  TOGGLE_FOLDER_NAV,
  TOGGLE_MANAGED_FOLDERS
} from '../../../src/js/messaging/utils/constants';

import { testData } from '../../util/messaging-helpers';

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

describe('folders reducer', () => {
  it('should create a folder', () => {
    const folder = testData.folders.data[0].attributes;
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
        items: testData.folders.data.map(folder => folder.attributes)
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
    const messages = testData.folderMessages;
    const folder = { data: testData.folders.data[0] };

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
    const data = testData.folders;

    const newState = foldersReducer(initialState, {
      type: FETCH_FOLDERS_SUCCESS,
      data
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
