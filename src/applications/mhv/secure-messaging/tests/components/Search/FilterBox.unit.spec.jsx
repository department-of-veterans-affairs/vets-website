import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
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
      search: {},
    },
  };

  const setup = () => {
    return renderWithStoreAndRouter(<FilterBox folders={folderList} />, {
      initialState,
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
    const filterButton = screen.getByTestId('filter-messages-button');
    expect(filterButton).to.exist;
  });

  it('displays error modal when form is submitted if "Date range" is set to "any" and input box is blank', () => {
    const screen = setup();
    const filterButton = screen.getByTestId('filter-messages-button');
    fireEvent.click(filterButton);
    const errorModal = screen.getByText(
      "Please use at least one of the following search fields or choose a date range other than 'any'.",
    );
    expect(errorModal).to.exist;
  });
});
