import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import searchResults from '../fixtures/search-response.json';
import folder from '../fixtures/folder-inbox-metadata.json';
import reducer from '../../reducers';
import SearchResults from '../../containers/SearchResults';
import { threadSortingOptions } from '../../util/constants';

describe('Search results', () => {
  const initialState = {
    sm: {
      search: {
        awaitingResults: false,
        searchFolder: folder,
        searchResults,
        folder,
        keyword: 'covid',
        query: {},
        searchSort: threadSortingOptions.SENT_DATE_DESCENDING.value,
        page: 1,
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
    expect(screen.getByTestId('search-messages')).to.exist;
    expect(screen.getByTestId('sort-button')).to.exist;
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
          keyword: 'messagenotfound',
          query: {},
        },
      },
    };
    const screen = setup(state);

    expect(screen.getByText('We didn’t find any matches for these filters')).to
      .exist;
    expect(
      screen.getByText(
        'Try changing your filter settings to find matches. Take these steps:',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Make sure you enter information from one of these fields: to, from, message ID, or subject. We can’t search for information inside the full messages.',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Make sure you’re in the right folder. We can only filter in one folder at a time.',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Check your spelling. We can only filter for exact matches.',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Try removing a filter. If you use too many filters, it’s harder to find a match.',
      ),
    ).to.exist;
  });

  it('displays a message when an advanced search returns no results', () => {
    const state = {
      sm: {
        search: {
          searchResults: [],
          awaitingResults: false,
          folder,
          keyword: '',
          query: {
            messageId: '',
            sender: 'asdf',
            subject: '',
            category: '',
          },
        },
      },
    };
    const screen = setup(state);

    expect(screen.getByText('We didn’t find any matches for these filters')).to
      .exist;
    expect(
      screen.getByText(
        'Try changing your filter settings to find matches. Take these steps:',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Make sure you enter information from one of these fields: to, from, message ID, or subject. We can’t search for information inside the full messages.',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Make sure you’re in the right folder. We can only filter in one folder at a time.',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Check your spelling. We can only filter for exact matches.',
      ),
    ).to.exist;
    expect(
      screen.getByText(
        'Try removing a filter. If you use too many filters, it’s harder to find a match.',
      ),
    ).to.exist;
  });

  it('displays a list of messages when search results are loaded', done => {
    const screen = setup();
    setTimeout(() => {
      const messageElems = screen
        .getAllByTestId('message-list-item')
        ?.map(el => el.value);
      expect(messageElems.length).to.equal(5);
      done();
    }, 200);
  });
});
