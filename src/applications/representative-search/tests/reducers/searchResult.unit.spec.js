/* eslint-disable camelcase */

import { expect } from 'chai';
import {
  FETCH_REPRESENTATIVES,
  SORT_TYPE_UPDATED,
  // SEARCH_FAILED,
  // REPORT_FAILED,
  CLEAR_SEARCH_RESULTS,
  REPORT_SUBMITTED,
  REPORT_ITEMS_UPDATED,
} from '../../utils/actionTypes';
import { SearchResultReducer } from '../../reducers/searchResult';

const INITIAL_STATE = {
  searchResults: [],
  reportedResults: [],
  reportSubmissionInProgress: false,
  reportSubmissionStatus: 'INITIAL',
  pagination: {},
};

describe('representatives reducer', () => {
  it('should handle fetching a list of representatives', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_REPRESENTATIVES,
      payload: {
        data: [{ name: 'selectedResult1' }, { name: 'selectedResult2' }],
        meta: {
          pagination: {
            currentPage: 1,
          },
        },
      },
    });

    expect(state.searchResults.length).to.eql(2);
    expect(state.pagination.currentPage).to.eql(1);
  });

  it('should handle sort type updated', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: SORT_TYPE_UPDATED,
      payload: {
        sortType: 'DISTANCE_DSC',
      },
    });

    expect(state.sortType).to.not.eql('DISTANCE_ASC');
  });

  it('should handle clearing search results', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: CLEAR_SEARCH_RESULTS,
    });

    expect(state).to.eql(INITIAL_STATE);
  });
  it('should handle starting report', () => {
    const state = SearchResultReducer(
      { ...INITIAL_STATE, reportSubmissionInProgress: false },
      {
        type: REPORT_SUBMITTED,
      },
    );

    expect(state.reportSubmissionInProgress).to.eql(true);
  });
  it('should handle new report items', () => {
    const reports = {
      flags: [
        {
          flag_type: 'email',
          flag_value: 'example@rep.com',
        },
      ],
    };

    const state = SearchResultReducer(
      { ...INITIAL_STATE },
      {
        type: REPORT_ITEMS_UPDATED,
        payload: reports,
      },
    );

    expect(state.reportedResults).to.eql(reports);
  });

  it('should handle fetching state to build a search query object', () => {
    const state = SearchResultReducer(INITIAL_STATE, {
      type: FETCH_REPRESENTATIVES,
      payload: {
        data: [
          {
            attributes: {
              name: 'Test representative',
              representativeType: 'Test rep type',
              lat: 40.7365270700001,
              long: -73.97761421,
              address: {
                physical: {
                  zip: '10010',
                  city: 'New York',
                  state: 'NY',
                  address1: '123 East 33rd Street',
                },
              },
            },
          },
        ],
        meta: {
          pagination: {
            currentPage: 1,
          },
        },
      },
    });

    expect(state.searchResults.length).to.eql(1);
    expect(state.searchResults[0].attributes.name).to.eql(
      'Test representative',
    );
    expect(state.searchResults[0].attributes.representativeType).to.eql(
      'Test rep type',
    );
    expect(state.searchResults[0].attributes.lat).to.eql(40.7365270700001);
    expect(state.searchResults[0].attributes.long).to.eql(-73.97761421);
    expect(state.searchResults[0].attributes.address.physical.zip).to.eql(
      '10010',
    );
    expect(state.searchResults[0].attributes.address.physical.city).to.eql(
      'New York',
    );
    expect(state.searchResults[0].attributes.address.physical.state).to.eql(
      'NY',
    );
    expect(state.searchResults[0].attributes.address.physical.address1).to.eql(
      '123 East 33rd Street',
    );
    expect(state.pagination.currentPage).to.eql(1);
  });
});
