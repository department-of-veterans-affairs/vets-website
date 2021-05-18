import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history-v4';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import createCommonStore, { commonReducer } from 'platform/startup/store';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import reducer from '../reducers';

const calculatorConstants = require('./data/calculator-constants.json');

export const getDefaultState = () => {
  const defaultState = createCommonStore(reducer).getState();

  defaultState.constants = {
    constants: {},
    version: calculatorConstants.meta.version,
    inProgress: false,
  };

  calculatorConstants.data.forEach(c => {
    defaultState.constants.constants[c.attributes.name] = c.attributes.value;
  });
  return defaultState;
};

export function createTestHistory(path = '/') {
  const history = createMemoryHistory({ initialEntries: [path] });
  sinon.spy(history, 'replace');
  sinon.spy(history, 'push');

  return history;
}

export function renderWithStoreAndRouter(
  ui,
  { initialState, store = null, path = '/', history = null },
) {
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducer }),
      initialState,
      applyMiddleware(thunk),
    );

  const historyObject = history || createTestHistory(path);
  const screen = renderInReduxProvider(
    <Router history={historyObject}>{ui}</Router>,
    {
      store: testStore,
      initialState,
      reducers: reducer,
    },
  );

  return { ...screen, history: historyObject };
}
