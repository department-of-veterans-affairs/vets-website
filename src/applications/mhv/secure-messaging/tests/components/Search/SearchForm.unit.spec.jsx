import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import searchResults from '../../fixtures/search-response.json';
import folder from '../../fixtures/folder-inbox-metadata.json';
import folderList from '../../fixtures/folder-inbox-response.json';
import threadList from '../../fixtures/thread-list-response.json';
import reducer from '../../../reducers';
import SearchForm from '../../../components/Search/SearchForm';
import { selectVaDate, selectVaSelect } from '../../../util/testUtils';
import { ErrorMessages } from '../../../util/constants';
import { DateRangeValues } from '../../../util/inputContants';

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
    query: { queryRange: {} },
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

  it('displays the name of folder to be searched', async () => {
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
      queryRange: {},
    };
    const screen = renderWithStoreAndRouter(
      <SearchForm
        folder={folder}
        keyword="test"
        resultsCount={searchResults.length}
        query={query}
        threadCount={threadList.length}
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
      queryRange: {},
    };
    const screen = renderWithStoreAndRouter(
      <SearchForm
        folder={folder}
        resultsCount={searchResults.length}
        query={query}
        threadCount={threadList.length}
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

  it('returns error message on invalid custom start date', async () => {
    const query = {
      category: 'other',
      queryRange: {},
    };
    const customProps = {
      ...defaultProps,
      threadCount: threadList.length,
      query,
    };
    const screen = setup(customProps);
    selectVaSelect(screen.container, 'custom', 'va-select[name="dateRange"]');
    const dateValue = '2022-09-19';
    selectVaDate(
      screen.container,
      dateValue,
      'va-date[data-testid="date-end"]',
    );
    fireEvent.click(document.querySelector('va-button[text="Filter"]'));
    expect(screen.getByTestId('date-start')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.START_DATE_REQUIRED,
    );
  });

  it('returns error message on invalid custom end date', async () => {
    const query = {
      category: 'other',
      queryRange: {},
    };
    const customProps = {
      ...defaultProps,
      threadCount: threadList.length,
      query,
    };
    const screen = setup(customProps);
    selectVaSelect(screen.container, 'custom', 'va-select[name="dateRange"]');
    const dateValue = '2022-09-19';
    selectVaDate(
      screen.container,
      dateValue,
      'va-date[data-testid="date-start"]',
    );
    fireEvent.click(document.querySelector('va-button[text="Filter"]'));
    expect(screen.getByTestId('date-end')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.END_DATE_REQUIRED,
    );
  });

  it('returns error message on start date beyond end date', async () => {
    const query = {
      category: 'other',
      queryRange: {},
    };
    const customProps = {
      ...defaultProps,
      threadCount: threadList.length,
      query,
    };
    const screen = setup(customProps);
    selectVaSelect(screen.container, 'custom', 'va-select[name="dateRange"]');
    const startDateValue = '2022-09-21';
    const endDateValue = '2022-09-19';
    selectVaDate(
      screen.container,
      startDateValue,
      'va-date[data-testid="date-start"]',
    );
    selectVaDate(
      screen.container,
      endDateValue,
      'va-date[data-testid="date-end"]',
    );
    fireEvent.click(document.querySelector('va-button[text="Filter"]'));
    expect(screen.getByTestId('date-start')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.START_DATE_AFTER_END_DATE,
    );
    expect(screen.getByTestId('date-end')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.END_DATE_BEFORE_START_DATE,
    );
  });

  it('returns error message when end date year is greater then current year', async () => {
    const query = {
      category: 'other',
      queryRange: {},
    };
    const customProps = {
      ...defaultProps,
      threadCount: threadList.length,
      query,
    };
    const screen = setup(customProps);
    selectVaSelect(screen.container, 'custom', 'va-select[name="dateRange"]');
    const startDateValue = '2022-09-21';
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    const endDateValue = `${nextYear}-09-19`;

    selectVaDate(
      screen.container,
      startDateValue,
      'va-date[data-testid="date-start"]',
    );
    selectVaDate(
      screen.container,
      endDateValue,
      'va-date[data-testid="date-end"]',
    );
    fireEvent.click(document.querySelector('va-button[text="Filter"]'));

    expect(screen.getByTestId('date-end')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.END_YEAR_GREATER_THAN_CURRENT_YEAR,
    );
  });

  it('responds to filtering by preselected date range', async () => {
    const query = {
      category: 'other',
      fromDate: '2022-01-01T00:00:00-07:00',
      toDate: '2022-12-31T23:59:00.000Z',
      queryRange: {
        value: DateRangeValues.LAST12,
        label: 'Last 12 months',
      },
    };
    const customProps = {
      ...defaultProps,
      threadCount: threadList.length,
      query,
    };
    const screen = setup(customProps);

    selectVaSelect(
      screen.container,
      DateRangeValues.LAST12,
      'va-select[name="dateRange"]',
    );
    fireEvent.click(document.querySelector('va-button[text="Filter"]'));
    expect(
      screen.getByText('Last 12 months', {
        selector: 'strong',
        exact: true,
      }),
    );
    expect(screen.getByText('January 1st 2022 to December 31st 2022'));
  });
});
