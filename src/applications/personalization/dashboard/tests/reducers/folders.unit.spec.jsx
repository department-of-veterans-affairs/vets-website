import { expect } from 'chai';

import foldersReducer from '../../reducers/folders';

import { FETCH_FOLDER_SUCCESS } from '../../actions/messaging';

import { allFolders, messages } from '../../mocks/messaging';

const initialState = {
  data: {
    currentItem: {
      attributes: {},
      filter: {},
      messages: [],
      pagination: {},
      persistFolder: 0,
      sort: {
        value: 'sentDate',
        order: 'DESC',
      },
    },
    items: new Map(),
  },
  ui: {
    nav: {
      foldersExpanded: false,
      visible: false,
    },
  },
};

describe('folders reducer', () => {
  it('should set a folder fetched from the server', () => {
    const folder = { data: allFolders.data[0] };
    const newState = foldersReducer(initialState, {
      type: FETCH_FOLDER_SUCCESS,
      folder,
      messages,
    });

    expect(newState.data.currentItem.attributes).to.eql(folder.data.attributes);
    expect(newState.data.currentItem.messages).to.eql(
      messages.data.map(message => message.attributes),
    );
    expect(newState.data.currentItem.pagination).to.eql(
      messages.meta.pagination,
    );
    expect(newState.data.items.get('inbox')).to.eql(folder.data.attributes);
  });
});
