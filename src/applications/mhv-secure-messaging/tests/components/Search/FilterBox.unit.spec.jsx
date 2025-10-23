import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import folderList from '../../fixtures/folder-inbox-response.json';
import folder from '../../fixtures/folder-inbox-metadata.json';
import threadList from '../../fixtures/thread-list-response.json';

import reducer from '../../../reducers';
import FilterBox from '../../../components/Search/FilterBox';
import { Paths } from '../../../util/constants';

describe('Filter box', () => {
  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
      search: {
        query: { queryData: {} },
        awaitingResults: false,
        keyword: '',
        searchSort: 'SENT_DATE_DESCENDING',
        page: 1,
      },
      threads: { threadList },
    },
  };
  const initialProps = {
    threadCount: threadList.length,
  };

  const setup = (state = initialState, props = initialProps) => {
    return renderWithStoreAndRouter(<FilterBox {...props} />, {
      initialState: state,
      reducers: reducer,
      path: Paths.INBOX,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays filter fields', () => {
    const screen = setup();
    const categoryDropdown = screen.getByTestId('category-dropdown');
    const dateRangeDropdown = screen.getByTestId('date-range-dropdown');
    expect(categoryDropdown).to.exist;
    expect(dateRangeDropdown).to.exist;
  });

  it('displays a filter button', async () => {
    const screen = setup();
    await waitFor(() => {
      const filterButton = screen.getByTestId('accordion-item-filter');
      expect(filterButton).to.exist;
    });
  });

  it('displays closed filter', async () => {
    const screen = setup();
    const filterButton = screen.getByTestId('accordion-item-filter');
    expect(filterButton).to.contain.text('Show filters');
    expect(filterButton).to.have.attribute('open', 'false');
  });
});
