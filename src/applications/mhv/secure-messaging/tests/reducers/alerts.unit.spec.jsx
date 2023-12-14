import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { alertsReducer } from '../../reducers/alerts';
import { focusOutAlert } from '../../actions/alerts';

describe('alerts reducers', () => {
  const mockStore = (initialState = {}) => {
    return createStore(alertsReducer, initialState, applyMiddleware(thunk));
  };

  it('should dispatch action on alert focus out', async () => {
    const store = mockStore();
    await store.dispatch(focusOutAlert());
    expect(store.getState().alertFocusOut).to.equal(true);
  });
});
