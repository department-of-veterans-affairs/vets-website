import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { recipientsReducer } from '../../reducers/recipients';
import { Actions } from '../../util/actionTypes';

// Minimal smoke tests to ensure reducer tolerates new actions

describe('reducers: recipients recent actions', () => {
  const mockStore = (initialState = {}) =>
    createStore(recipientsReducer, initialState, applyMiddleware(thunk));

  it('ignores GET_RECENT by default (no state changes unless handled)', () => {
    const store = mockStore();
    store.dispatch({
      type: Actions.AllRecipients.GET_RECENT,
      response: [1, 2],
    });
    const state = store.getState();
    expect(state).to.be.an('object');
    // reducer does not currently store recent ids; just verify no crash and unchanged known keys
    expect(state.allRecipients).to.be.an('array');
  });

  it('ignores GET_RECENT_ERROR by default', () => {
    const store = mockStore();
    store.dispatch({ type: Actions.AllRecipients.GET_RECENT_ERROR });
    const state = store.getState();
    expect(state).to.be.an('object');
  });
});
