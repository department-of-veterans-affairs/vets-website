import React from 'react';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { folderList } from '../fixtures/folder-response.json';
import reducer from '../../reducers';
import SearchMessages from '../../containers/SearchMessages';

describe('Message search', () => {
  const initialState = {
    sm: {
      folders: { folderList },
      search: {},
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SearchMessages />, {
      initialState,
      reducers: reducer,
      path: `/search`,
    });
    expect(screen.findByText('Search messages', { exact: true }));
  });
});
