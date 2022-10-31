import React from 'react';
// import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import reducers from '../../reducers';

import FolderListView from '../../containers/FolderListView';
// import folderResponse from '../fixtures/folder-response.json';
import inbox from '../fixtures/folder-inbox-response.json';

describe('FolderListView', () => {
  it('renders without errors', () => {
    const initialState = {
      sm: {
        folders: { folder: inbox },
        messages: [],
      },
    };

    const screen = renderWithStoreAndRouter(<FolderListView />, {
      path: '/',
      initialState,
      reducers,
    });

    expect(screen);
  });
});
