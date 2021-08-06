import React from 'react';
import { Router } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import { commonReducer } from 'platform/startup/store';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import reducers from '../reducers';

const calculatorConstants = require('./data/calculator-constants.json');

export function mockConstants() {
  const constants = [];
  calculatorConstants.data.forEach(c => {
    constants[c.attributes.name] = c.attributes.value;
  });

  return { constants };
}

export function createTestHistory(path = '/') {
  const history = createHistory({ initialEntries: [path] });
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
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk),
    );

  const historyObject = history || createTestHistory(path);
  const screen = renderInReduxProvider(
    <Router history={historyObject}>{ui}</Router>,
    {
      store: testStore,
      initialState,
      reducers,
    },
  );

  return { ...screen, history: historyObject };
}
