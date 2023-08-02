import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import searchResults from '../../fixtures/search-response.json';
import folder from '../../fixtures/folder-inbox-metadata.json';
import folderList from '../../fixtures/folder-inbox-response.json';
import threadList from '../../fixtures/thread-list-response.json';
import reducer from '../../../reducers';
import SearchForm from '../../../components/Search/SearchForm';

describe('Search form', () => {
  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
    },
  };
  const defaultProps = {
    folder,
    keyword: 'test',
    resultsCount: searchResults.length,
    query: {},
  };

  const setup = (props = defaultProps) => {
    return renderWithStoreAndRouter(<SearchForm {...props} />, {
      initialState,
      reducers: reducer,
      path: `/inbox`,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays the name of folder to be searched', () => {
    const screen = setup();
    const folderStatementStart = screen.getByText('Filter messages in Inbox');

    expect(folderStatementStart.textContent).to.contain(
      `Filter messages in ${folder.name}`,
    );
  });
  it('displays keyword field', () => {
    const screen = setup();
    const keyword = screen.getByTestId('keyword-search-input');
    expect(keyword).to.exist;
  });

  it('renders displays a query summary containing the number of results, searched keyword, and folder', async () => {
    const query = {
      category: 'other',
      fromDate: '2022-09-19T00:00:00-07:00',
      toDate: '2022-12-19T21:55:17.766Z',
    };
    const screen = renderWithStoreAndRouter(
      <SearchForm
        folder={folder}
        keyword="test"
        resultsCount={searchResults.length}
        query={query}
        threadCount={threadList}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search`,
      },
    );

    const count = await screen.findByText('5', { exact: true });
    const statement = await screen.findByText('matches in', { exact: false });
    const keyword = await screen.findByText('test', { exact: true });
    const statementFolder = await screen.findByText('Inbox', { exact: true });

    expect(count).to.exist;
    expect(statement).to.exist;
    expect(keyword).to.exist;
    expect(statementFolder).to.exist;
  });

  it('renders displays a query summary containing the number of results, folder, and query fields', async () => {
    const query = {
      category: 'other',
      fromDate: '2022-09-19T00:00:00-07:00',
      toDate: '2022-12-19T21:55:17.766Z',
    };
    const screen = renderWithStoreAndRouter(
      <SearchForm
        folder={folder}
        resultsCount={searchResults.length}
        query={query}
        threadCount={threadList}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search`,
      },
    );

    const queryItems = await screen.getAllByRole('listitem');
    const category = await screen.findByText('General', { exact: true });
    const dateRange = await screen.findByText(
      'September 19th 2022 to December 19th 2022',
      { exact: true },
    );

    expect(queryItems.length).to.equal(2);
    expect(category).to.exist;
    expect(dateRange).to.exist;
  });
});
