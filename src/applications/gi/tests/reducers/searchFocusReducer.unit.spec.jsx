import { expect } from 'chai';
import focusSearchReducer from '../../reducers/searchFocusReducer';
import { FOCUS_SEARCH } from '../../actions';

describe('focusSearchReducer', () => {
  const initialState = { focusOnSearch: false };

  it('should return the initial state by default', () => {
    const result = focusSearchReducer(undefined, {});
    expect(result).to.eql(initialState);
  });

  it('should handle FOCUS_SEARCH', () => {
    const action = { type: FOCUS_SEARCH };
    const expectedState = { ...initialState, focusOnSearch: true };

    const result = focusSearchReducer(initialState, action);
    expect(result).to.eql(expectedState);
  });

  it('should handle RESET_FOCUS', () => {
    const action = { type: 'RESET_FOCUS' };
    const modifiedState = { ...initialState, focusOnSearch: true };
    const expectedState = { ...initialState, focusOnSearch: false };

    const result = focusSearchReducer(modifiedState, action);
    expect(result).to.eql(expectedState);
  });
});
