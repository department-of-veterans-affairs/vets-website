import { expect } from 'chai';
import sinon from 'sinon';
import createCommonStore from '../store';

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

  it('should integrate additional middlewares that modify action flow', () => {
    // Create a middleware that transforms action types by adding a prefix
    const prefixingMiddleware = () => next => action => {
      // Transform action types that start with 'TEST_' by adding 'PREFIXED_'
      if (action.type && action.type.startsWith('TEST_')) {
        return next({
          ...action,
          type: `PREFIXED_${action.type}`,
        });
      }
      return next(action);
    };

    // Mock reducer that responds differently based on the action type
    const mockReducer = (state = { actionSeen: null }, action) => {
      if (action.type === 'TEST_ACTION') {
        return { ...state, actionSeen: 'original' };
      }
      if (action.type === 'PREFIXED_TEST_ACTION') {
        return { ...state, actionSeen: 'prefixed' };
      }
      return state;
    };

    // Create a store with our test reducer and middlewares
    const spyInstance = { spy: sinon.spy() };
    const spyMiddlewareWithSpy = () => next => action => {
      spyInstance.spy(action);
      return next(action);
    };

    const store = createCommonStore(
      { testReducer: mockReducer },
      [], // No analytics events
      [prefixingMiddleware, spyMiddlewareWithSpy], // Our additional middlewares
    );

    // Dispatch an action that should be transformed by our middleware
    store.dispatch({ type: 'TEST_ACTION' });

    // Verify that the action was transformed by the middleware
    expect(spyInstance.spy.calledWith({ type: 'PREFIXED_TEST_ACTION' })).to.be
      .true;

    // Verify that the state reflects the transformed action was processed
    expect(store.getState().testReducer.actionSeen).to.equal('prefixed');

    // Dispatch a different action that won't be transformed
    store.dispatch({ type: 'REGULAR_ACTION' });

    // Verify the spy saw the untransformed action
    expect(spyInstance.spy.calledWith({ type: 'REGULAR_ACTION' })).to.be.true;
  });
});
