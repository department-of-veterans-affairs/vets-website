import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/dom';
import folderList from '../../fixtures/folder-response.json';
import reducer from '../../../reducers';
import AdvancedSearchForm from '../../../components/Search/AdvancedSearchForm';

describe('Advanced search form', () => {
  const initialState = {
    sm: {
      folders: { folderList },
      search: {},
    },
  };

  const setup = options => {
    const {
      testingSubmit,
      testingDateRange,
      testingFromDate,
      testingToDate,
    } = options;
    return renderWithStoreAndRouter(
      <AdvancedSearchForm
        testingSubmit={testingSubmit}
        testingDateRange={testingDateRange}
        testingFromDate={testingFromDate}
        testingToDate={testingToDate}
      />,
      {
        initialState,
        reducers: reducer,
        path: `/search/advanced`,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup({});
    expect(screen);
  });

  it('displays search fields and folder select', () => {
    const screen = setup({});
    const folderSelect = screen.getByTestId('folder-dropdown');
    const messageIdTextInput = screen.getByTestId('message-id-text-input');
    const senderTextInput = screen.getByTestId('sender-text-input');
    const subjectTextInput = screen.getByTestId('subject-text-input');
    const categoryDropdown = screen.getByTestId('category-dropdown');
    const dateRangeDropdown = screen.getByTestId('date-range-dropdown');
    expect(folderSelect).to.exist;
    expect(messageIdTextInput).to.exist;
    expect(senderTextInput).to.exist;
    expect(subjectTextInput).to.exist;
    expect(categoryDropdown).to.exist;
    expect(dateRangeDropdown).to.exist;
  });

  it('displays an advanced search button', () => {
    const screen = setup({});
    const searchButton = screen.getByTestId('advanced-search-submit');
    expect(searchButton).to.exist;
  });

  it('displays error modal when form is submitted if "Date range" is set to "any" and "Message ID", "Sender name", "Subject", and "Category" are blank', () => {
    const screen = setup({});
    const searchButton = screen.getByTestId('advanced-search-submit');
    fireEvent.click(searchButton);
    const errorModal = screen.getByText(
      "Please use at least one of the following search fields or choose a date range other than 'any'.",
    );
    expect(errorModal).to.exist;
  });

  it('displays error modal when form is submitted if date range is custom but "Start date" and "End date" are blank', () => {
    const screen = setup({ testingDateRange: true });
    const searchButton = screen.getByTestId('advanced-search-submit');
    fireEvent.click(searchButton);
    const startDate = screen.getByTestId('date-start');
    const endDate = screen.getByTestId('date-end');
    expect(startDate.error).to.equal('Please enter a start date.');
    expect(endDate.error).to.equal('Please enter an end date.');
  });

  it('displays an error if date range is set to custom but "Start date" is before "End date"', () => {
    const screen = setup({
      testingDateRange: true,
      testingFromDate: '2023-01-01',
      testingToDate: '2022-01-01',
    });
    const searchButton = screen.getByTestId('advanced-search-submit');
    fireEvent.click(searchButton);
    const startDate = screen.getByTestId('date-start');
    const endDate = screen.getByTestId('date-end');
    expect(startDate.error).to.equal(
      'Start date must be on or before end date.',
    );
    expect(endDate.error).to.equal('End date must be on or after start date.');
  });

  it('submits search form when submit button is clicked', () => {
    const screen = setup({ testingSubmit: true });
    const searchButton = screen.getByTestId('advanced-search-submit');
    fireEvent.click(searchButton);
    const errorModal = screen.queryByText(
      "Please use at least one of the following search fields or choose a date range other than 'any'.",
    );
    expect(errorModal).to.be.null;
  });
});
