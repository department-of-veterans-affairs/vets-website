import createCommonStore from '../store';
import { expect } from 'chai';

describe('Common Redux store', () => {
  it('should support injecting reducer', () => {
    const store = createCommonStore();
    const fakeReducer = (state = {}, action) => {
      if (action.type === 'test') {
        return { testActionHappened: true };
      }

      return state;
    };

    store.injectReducer('testSlice', fakeReducer);

    store.dispatch({ type: 'test' });

    expect(store.getState().testSlice.testActionHappened).to.be.true;
  });
});
