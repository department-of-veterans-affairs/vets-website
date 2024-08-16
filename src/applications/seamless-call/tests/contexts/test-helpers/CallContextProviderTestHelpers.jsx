import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import reducer, { initialState } from '../../../reducers';
import { CallContext } from '../../../contexts/CallContext';
import { createCallContext } from '../../test-helpers/CallTestFactories';

const createTestStore = (state = {}) =>
  createStore(combineReducers({ call: reducer }), {
    call: { ...initialState, ...state },
  });

export const renderWithCallContextProvider = (
  ui,
  { callContext = {}, state = {} } = {},
) => {
  const testStore = createTestStore(state);
  const testCallContext = createCallContext(callContext);
  return {
    store: testStore,
    callContext: testCallContext,
    view: render(
      <CallContext.Provider value={testCallContext}>
        <Provider store={testStore}>{ui}</Provider>
      </CallContext.Provider>,
    ),
  };
};

export const renderWithReduxProvider = (ui, { state = {} } = {}) => {
  const testStore = createTestStore(state);
  return {
    store: testStore,
    view: render(<Provider store={testStore}>{ui}</Provider>),
  };
};
