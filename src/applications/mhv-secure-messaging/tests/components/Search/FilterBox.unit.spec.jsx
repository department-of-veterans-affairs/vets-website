import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import folderList from '../../fixtures/folder-inbox-response.json';
import folder from '../../fixtures/folder-inbox-metadata.json';

import reducer from '../../../reducers';
import FilterBox from '../../../components/Search/FilterBox';

describe('Filter box', () => {
  const initialState = {
    sm: {
      folders: {
        folderList,
        folder,
      },
      search: { query: { queryData: {} } },
    },
  };
  const initialProps = {
    folders: folderList,
  };

  const setup = (state = initialState, props = initialProps) => {
    return renderWithStoreAndRouter(<FilterBox {...props} />, {
      initialState: state,
      reducers: reducer,
      path: `/search/`,
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

  it('displays a filter button', () => {
    const screen = setup();
    const filterButton = screen.queryByTestId('filter-messages-button');
    expect(filterButton).to.be.null;
  });
});
