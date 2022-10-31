import React from 'react';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { searchResults } from '../fixtures/search-response.json';
import { folder } from '../fixtures/folder-inbox-metadata.json';
import reducer from '../../reducers';
import SearchResults from '../../containers/SearchResults';

describe('Search results', () => {
  const initialState = {
    sm: {
      search: {
        searchResults,
        folder,
        keyword: 'covid',
      },
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SearchResults />, {
      initialState,
      reducers: reducer,
      path: `/search/results`,
    });
    expect(screen.findByText('Search results', { exact: true }));
  });
});
