import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { folderList } from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import BasicSearchForm from '../../../components/Search/BasicSearchForm';

describe('Basic search form', () => {
  let screen;
  beforeEach(() => {
    const initialState = {
      sm: {
        folders: { folderList },
        search: {},
      },
    };
    screen = renderWithStoreAndRouter(<BasicSearchForm />, {
      initialState,
      reducers: reducer,
      path: `/search`,
    });
  });

  it('renders without errors', () => {
    expect(screen);
  });
  it('displays a search button', () => {
    expect(screen.getByTestId('search-button-text')).to.exist;
  });
});
