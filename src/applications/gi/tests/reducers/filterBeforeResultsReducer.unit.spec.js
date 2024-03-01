import { createStore } from 'redux';
import { expect } from 'chai';
import filterBeforeResultsReducer from '../../reducers/filterBeforeResultsReducer';
import { FILTER_BEFORE_RESULTS } from '../../actions';

describe('filterBeforeResultsReducer', () => {
  let store;

  beforeEach(() => {
    store = createStore(filterBeforeResultsReducer);
  });

  it('should return the initial state', () => {
    expect(store.getState()).to.deep.equal({ showFiltersBeforeResult: true });
  });

  it('should handle FILTER_BEFORE_RESULTS action', () => {
    store.dispatch({ type: FILTER_BEFORE_RESULTS });
    expect(store.getState()).to.deep.equal({ showFiltersBeforeResult: false });
  });
});
