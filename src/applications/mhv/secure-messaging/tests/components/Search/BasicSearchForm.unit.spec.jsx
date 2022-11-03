import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { folderList } from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import SearchResults from '../../../containers/SearchResults';

describe('Basic search form', () => {
  const initialState = {
    sm: {
      folders: { folderList },
      search: {},
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SearchResults />, {
      initialState,
      reducers: reducer,
      path: `/search`,
    });
    expect(screen.findByText('Search results', { exact: true }));
  });
});
