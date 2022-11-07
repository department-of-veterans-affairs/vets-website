import React from 'react';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import { folderList } from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import AdvancedSearchForm from '../../../components/Search/AdvancedSearchForm';

describe('Advanced search form', () => {
  let screen;
  beforeEach(() => {
    const initialState = {
      sm: {
        folders: { folderList },
        search: {},
      },
    };
    screen = renderWithStoreAndRouter(<AdvancedSearchForm />, {
      initialState,
      reducers: reducer,
      path: `/search/advanced`,
    });
  });

  it('renders without errors', () => {
    expect(screen);
  });
  it('displays an advanced search button', () => {
    expect(screen.getByTestId('advanced-search-button')).to.exist;
  });
});
