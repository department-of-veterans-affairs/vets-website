import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import searchResults from '../fixtures/search-response.json';
import folder from '../fixtures/folder-inbox-metadata.json';
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

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<SearchResults />, {
      initialState: state,
      reducers: reducer,
      path: `/search/results`,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Search results', { exact: true })).to.exist;
  });

  it('displays loading indicator when search results are not yet loaded', () => {
    const state = {
      sm: {
        search: {
          searchResults: undefined,
          folder,
          keyword: 'covid',
        },
      },
    };
    const screen = setup(state);
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it('displays a message when a basic search returns no results', async () => {
    const state = {
      sm: {
        search: {
          searchResults: [],
          folder,
          keyword: 'covid',
        },
      },
    };
    const screen = setup(state);
    const staticText = screen.queryByText('We didn’t find any results for ', {
      exact: false,
    });
    const keyword = screen.queryByText('covid');
    expect(staticText).to.exist;
    expect(keyword).to.exist;
  });

  it('displays a message when an advanced search returns no results', () => {
    const state = {
      sm: {
        search: {
          searchResults: [],
          folder,
          keyword: undefined,
        },
      },
    };
    const screen = setup(state);
    const noResultsMessage = screen.getByText(
      'We didn’t find any results based on the search criteria provided.',
    );
    expect(noResultsMessage).to.exist;
  });

  it('displays the name of folder being searched', () => {
    const screen = setup();
    const folderName = screen.getByText(folder.name);
    expect(folderName).to.exist;
  });

  it('displays a list of messages when search results are loaded', done => {
    const screen = setup();
    setTimeout(() => {
      const messageElems = screen
        .getAllByTestId('message-list-item')
        ?.map(el => el.value);
      expect(messageElems.length).to.equal(10);
      done();
    }, 200);
  });
});
