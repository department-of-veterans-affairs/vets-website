import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { folderList } from '../fixtures/folder-response.json';
import reducer from '../../reducers';
import Folders from '../../containers/Folders';

describe('Folders Landing Page', () => {
  const initialState = {
    sm: {
      folders: { folderList },
      search: {},
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<Folders />, {
      initialState,
      reducers: reducer,
      path: `/folders`,
    });
    expect(screen.findByText('My folders')).to.exist;
  });
});
