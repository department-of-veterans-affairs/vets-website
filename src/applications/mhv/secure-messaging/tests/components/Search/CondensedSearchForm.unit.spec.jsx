import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import searchResults from '../../fixtures/search-response.json';
import folder from '../../fixtures/folder-inbox-metadata.json';
import reducer from '../../../reducers';
import CondensedSearchForm from '../../../components/Search/CondensedSearchForm';

describe('Condensed search form', () => {
  const initialState = {};

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(
      <CondensedSearchForm
        folder={folder}
        keyword="test"
        resultsCount={searchResults.length}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search/results`,
      },
    );
    expect(screen);
  });

  it('renders displays a query summary containing the number of results, searched keyword, and folder', async () => {
    const screen = renderWithStoreAndRouter(
      <CondensedSearchForm
        folder={folder}
        keyword="test"
        resultsCount={searchResults.length}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search/results`,
      },
    );

    const count = await screen.findByText('5', { exact: true });
    const statement = await screen.findByText('results for', { exact: false });
    const keyword = await screen.findByText('test', { exact: true });
    const statementFolder = await screen.findByText('Inbox', { exact: true });

    expect(count).to.exist;
    expect(statement).to.exist;
    expect(keyword).to.exist;
    expect(statementFolder).to.exist;
  });

  it('renders displays a query summary containing the number of results, folder, and query fields', async () => {
    const query = {
      messageId: '7232799',
      sender: 'islam',
      subject: 'mess',
      category: 'other',
      fromDate: '2022-09-19T00:00:00-07:00',
      toDate: '2022-12-19T21:55:17.766Z',
    };
    const screen = renderWithStoreAndRouter(
      <CondensedSearchForm
        folder={folder}
        resultsCount={searchResults.length}
        query={query}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search/results`,
      },
    );

    const queryItems = await screen.getAllByRole('listitem');
    const messageId = await screen.findByText('7232799', { exact: true });
    const sender = await screen.findByText('islam', { exact: true });
    const subject = await screen.findByText('mess', { exact: true });
    const category = await screen.findByText('other', { exact: true });
    const dateRange = await screen.findByText(
      'September 19th 2022 to December 19th 2022',
      { exact: true },
    );

    expect(queryItems.length).to.equal(5);
    expect(messageId).to.exist;
    expect(sender).to.exist;
    expect(subject).to.exist;
    expect(category).to.exist;
    expect(dateRange).to.exist;
  });

  it('displays a link to the advanced search page', () => {
    const screen = renderWithStoreAndRouter(
      <CondensedSearchForm
        folder={folder}
        keyword="test"
        resultsCount={searchResults.length}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search/results`,
      },
    );
    expect(screen.findByText('Advanced search', { exact: true }));
  });
});
