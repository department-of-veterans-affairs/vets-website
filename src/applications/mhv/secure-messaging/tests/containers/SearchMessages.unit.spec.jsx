import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import folderList from '../fixtures/folder-response.json';
import reducer from '../../reducers';
import SearchMessages from '../../containers/SearchMessages';

describe('Message search container', () => {
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
    expect(screen);
  });

  it('dispays loading indicator if folders are not yet loaded', () => {
    const screen = renderWithStoreAndRouter(<SearchMessages />, {
      initialState: {
        sm: {
          folders: { folderList: undefined },
          search: {},
        },
      },
      reducers: reducer,
      path: `/search/advanced`,
    });

    const loadingText = screen.findByText('Loading your secure messages...', {
      exact: true,
    });
    expect(loadingText).to.exist;
  });

  it('displays basic search if path is /search', done => {
    const screen = renderWithStoreAndRouter(<SearchMessages />, {
      initialState,
      reducers: reducer,
      path: `/search`,
    });
    setTimeout(() => {
      const headingText = screen.getByRole('heading', {
        name: 'Search messages',
      });
      const keyword = screen.getByTestId('keyword-text-input');
      const basicSearchButton = screen.getByRole('button', {
        name: 'Search',
      });
      expect(headingText).to.exist;
      expect(keyword).to.exist;
      expect(basicSearchButton).to.exist;
      done();
    }, 200);
  });

  it('displays advanced search if path is /search/advanced', done => {
    const screen = renderWithStoreAndRouter(<SearchMessages />, {
      initialState,
      reducers: reducer,
      path: `/search/advanced`,
    });

    setTimeout(() => {
      const headingText = screen.getByRole('heading', {
        name: 'Advanced search',
      });
      const folderSelect = screen.getByTestId('folder-dropdown');
      const advancedSearchButton = screen.getByRole('button', {
        name: 'Advanced search',
      });
      expect(headingText).to.exist;
      expect(folderSelect).to.exist;
      expect(advancedSearchButton).to.exist;
      done();
    }, 200);
  });
});
