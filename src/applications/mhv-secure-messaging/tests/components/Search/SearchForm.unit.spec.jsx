import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import searchResults from '../../fixtures/search-response.json';
import folder from '../../fixtures/folder-inbox-metadata.json';
import folderList from '../../fixtures/folder-inbox-response.json';
import threadList from '../../fixtures/thread-list-response.json';
import reducer from '../../../reducers';
import SearchForm from '../../../components/Search/SearchForm';
import {
  selectVaDate,
  selectVaSelect,
  inputVaTextInput,
} from '../../../util/testUtils';
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
    query: { queryData: {} },
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
    const folderStatementStart = screen.getByText('Filter messages in inbox');

    expect(folderStatementStart.textContent).to.contain(
      `Filter messages in ${folder.name.toLowerCase()}`,
    );
  });
  it('displays keyword field', () => {
    const screen = setup();
    const keyword = screen.getByTestId('keyword-search-input');
    expect(keyword).to.exist;
  });

  it('renders displays a query summary containing the number of results, searched keyword, and folder', async () => {
    const searchTerm = 'test';
    const query = {
      category: 'other',
      fromDate: '2022-09-19T00:00:00-07:00',
      toDate: '2022-12-19T21:55:17.766Z',
      queryData: { searchTerm },
    };
    const screen = renderWithStoreAndRouter(
      <SearchForm
        folder={folder}
        keyword={searchTerm}
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
      queryData: {},
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
      queryData: {},
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
    userEvent.click(document.querySelector('va-button[text="Apply filters"]'));
    expect(screen.getByTestId('date-start')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.START_DATE_REQUIRED,
    );
    expect(
      screen.getByRole('heading', { name: /Filter messages in inbox/i }),
    ).to.have.attribute('aria-describedby', 'filter-default');
    expect(screen.getByText('No filters applied')).to.exist;
  });

  it('returns error message on invalid custom end date', async () => {
    const query = {
      category: 'other',
      queryData: {},
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
    userEvent.click(document.querySelector('va-button[text="Apply filters"]'));
    expect(screen.getByTestId('date-end')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.END_DATE_REQUIRED,
    );
  });

  // TODO: need to update this selectVaDate function for Node 22 upgrade
  it.skip('returns error message on start date beyond end date', async () => {
    const query = {
      category: 'other',
      queryData: {},
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
    userEvent.click(document.querySelector('va-button[text="Apply filters"]'));
    expect(screen.getByTestId('date-start')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.START_DATE_AFTER_END_DATE,
    );
    expect(screen.getByTestId('date-end')).to.have.attribute(
      'error',
      ErrorMessages.SearchForm.END_DATE_BEFORE_START_DATE,
    );
  });

  // TODO: need to update this selectVaDate function for Node 22 upgrade
  it.skip('returns error message when end date year is greater then current year', async () => {
    const query = {
      category: 'other',
      queryData: {},
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
    userEvent.click(document.querySelector('va-button[text="Apply filters"]'));

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
      queryData: {
        range: {
          value: DateRangeValues.LAST12,
          label: 'Last 12 months',
        },
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
    userEvent.click(document.querySelector('va-button[text="Apply filters"]'));
    expect(
      screen.getByText('Last 12 months', {
        selector: 'strong',
        exact: true,
      }),
    );
    expect(screen.getByText('January 1st 2022 to December 31st 2022'));
  });

  describe('Datadog RUM action names', () => {
    it('should have data-dd-action-name on filter results label', () => {
      const searchTerm = 'test';
      const query = {
        category: 'other',
        fromDate: '2022-09-19T00:00:00-07:00',
        toDate: '2022-12-19T21:55:17.766Z',
        queryData: { searchTerm },
      };
      const customProps = {
        ...defaultProps,
        keyword: searchTerm,
        resultsCount: searchResults.length,
        query,
        threadCount: threadList.length,
      };
      const screen = setup(customProps);

      const resultsLabel = screen.getByTestId(
        'search-message-folder-input-label',
      );
      expect(resultsLabel.getAttribute('data-dd-action-name')).to.equal(
        'Filter Messages matches label',
      );
    });

    it('should have data-dd-action-name on filter messages heading for inbox', () => {
      const screen = setup();

      const heading = screen.getByRole('heading', {
        name: 'Filter messages in inbox',
      });
      expect(heading.getAttribute('data-dd-action-name')).to.equal(
        'Filter Messages in Inbox',
      );
    });

    it('should have data-dd-action-name on filter messages heading for custom folder', () => {
      const customFolder = {
        folderId: 123,
        name: 'My Custom Folder',
        count: 10,
        unreadCount: 2,
        systemFolder: false,
      };
      const customProps = {
        ...defaultProps,
        folder: customFolder,
      };

      const customState = {
        sm: {
          folders: {
            folderList,
            folder: customFolder,
          },
        },
      };

      const screen = renderWithStoreAndRouter(<SearchForm {...customProps} />, {
        initialState: customState,
        reducers: reducer,
        path: `/folders/${customFolder.folderId}`,
      });

      const heading = screen.getByRole('heading', {
        name: /Filter messages in My Custom Folder/i,
      });
      expect(heading.getAttribute('data-dd-action-name')).to.equal(
        'Filter Messages in Custom Folder',
      );
    });

    it('should have data-dd-action-name on filter input field', () => {
      const screen = setup();

      const filterInput = screen.getByTestId('keyword-search-input');
      expect(filterInput.getAttribute('data-dd-action-name')).to.equal(
        'Input Field - Filter',
      );
    });

    it('should have data-dd-action-name on message ID info expandable', () => {
      const customProps = {
        ...defaultProps,
        threadCount: threadList.length,
      };
      const screen = setup(customProps);

      const messageIdInfo = screen.container.querySelector(
        'va-additional-info',
      );
      expect(messageIdInfo).to.exist;
      expect(messageIdInfo.getAttribute('trigger')).to.equal(
        "What's a message ID?",
      );
      expect(messageIdInfo.getAttribute('data-dd-action-name')).to.equal(
        "What's a message ID? Expandable Info",
      );
    });

    it('should have data-dd-action-name on apply filters button', () => {
      const customProps = {
        ...defaultProps,
        threadCount: threadList.length,
      };
      const screen = setup(customProps);

      const applyButton = screen.getByTestId('filter-messages-button');
      expect(applyButton.getAttribute('data-dd-action-name')).to.equal(
        'Filter Button',
      );
    });

    it('should have dd-action-name on clear filters button when results exist', () => {
      const searchTerm = 'test';
      const query = {
        category: 'other',
        queryData: { searchTerm },
      };
      const customProps = {
        ...defaultProps,
        keyword: searchTerm,
        resultsCount: searchResults.length,
        query,
        threadCount: threadList.length,
      };
      const screen = setup(customProps);

      const clearButton = screen.container.querySelector(
        'va-button[text="Clear filters"]',
      );
      expect(clearButton).to.exist;
      expect(clearButton.getAttribute('dd-action-name')).to.equal(
        'Clear filters Button',
      );
      expect(
        screen.getByRole('heading', { name: /Filter messages in inbox/i }),
      ).to.have.attribute('aria-describedby', 'filter-default');
      expect(screen.getByText('No filters applied')).to.exist;
      userEvent.click(clearButton);
      expect(
        screen.getByRole('heading', { name: /Filter messages in inbox/i }),
      ).to.have.attribute('aria-describedby', 'filter-clear-success');
      expect(screen.getByText('Filters successfully cleared')).to.exist;
    });

    it('should have the correct aria-describedby on heading after applying then clearing filters', async () => {
      const searchTerm = 'test';
      const query = {
        category: 'other',
        queryData: { searchTerm },
      };
      const customProps = {
        ...defaultProps,
        keyword: searchTerm,
        resultsCount: searchResults.length,
        query,
        threadCount: threadList.length,
      };
      const screen = setup(customProps);

      const inboxHeading = screen.getByRole('heading', {
        name: /Filter messages in inbox/i,
      });

      const applyButton = screen.getByTestId('filter-messages-button');
      const clearButton = screen.container.querySelector(
        'va-button[text="Clear filters"]',
      );

      expect(inboxHeading).to.have.attribute(
        'aria-describedby',
        'filter-default',
      );
      expect(screen.getByText('No filters applied')).to.exist;
      expect(screen.queryByText('Filters successfully applied')).to.not.exist;
      expect(screen.queryByText('Filters successfully cleared')).to.not.exist;

      inputVaTextInput(screen.container, 'test', '#filter-input');
      userEvent.click(applyButton);

      await waitFor(
        () => {
          expect(inboxHeading).to.have.attribute(
            'aria-describedby',
            'filter-applied-success',
          );
        },
        { timeout: 3000 },
      );

      await waitFor(() => {
        expect(screen.getByText('Filters successfully applied')).to.exist;
      });
      expect(screen.queryByText('No filters applied')).to.not.exist;
      expect(screen.queryByText('Filters successfully cleared')).to.not.exist;

      userEvent.click(clearButton);

      await waitFor(
        () => {
          expect(inboxHeading).to.have.attribute(
            'aria-describedby',
            'filter-clear-success',
          );
        },
        { timeout: 3000 },
      );

      await waitFor(() => {
        expect(screen.getByText('Filters successfully cleared')).to.exist;
      });
      expect(screen.queryByText('No filters applied')).to.not.exist;
      expect(screen.queryByText('Filters successfully applied')).to.not.exist;
    });
  });
});
