import { expect } from 'chai';
import { pageTrackerReducer } from '../../reducers/pageTracker';
import { Actions } from '../../util/actionTypes';

const initialState = {
  pageNumber: null,
};

describe('pageTrackerReducer', () => {
  it('stores the current page number of the list page', () => {
    const state = pageTrackerReducer(initialState, {
      type: Actions.PageTracker.SET_PAGE_TRACKER,
      payload: 2,
    });
    expect(state.pageNumber).to.equal(2);
  });
  it('clears the page number', () => {
    const state = pageTrackerReducer(initialState, {
      type: Actions.PageTracker.CLEAR_PAGE_TRACKER,
    });
    expect(state.pageNumber).to.equal(null);
  });
});
