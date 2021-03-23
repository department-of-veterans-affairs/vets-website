import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { isPlainObject } from 'lodash';
import { render as rtlRender } from '@testing-library/react';

import { commonReducer } from 'platform/startup/store';

/**
 * A custom React Testing Library render function that wraps the desired
 * UI/component in a Redux Provider. This allows for easy testing of
 * Redux-connected components. Adding the thunk middleware allows for writing
 * integration tests that rely on async Redux actions.
 *
 * Based on the [custom render function described in the official
 * docs](https://testing-library.com/docs/example-react-redux), but with the
 * ability to customize the reducers and initial state via the options param.
 */
export function renderInReduxProvider(
  ui,
  { initialState = {}, reducers = {}, store = null, ...renderOptions } = {},
) {
  if (Object.keys(renderOptions).includes('reducer')) {
    /* eslint-disable no-console */
    console.log(
      'You passed in a `reducer` option to renderInReduxProvider. Did you mean to pass in a `reducers` option instead?',
    );
  }
  if (!isPlainObject(reducers)) {
    throw new TypeError(
      "renderInReduxProvider's `reducers` option must be an Object",
    );
  }
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk),
    );
  const Wrapper = ({ children }) => {
    return <Provider store={testStore}>{children}</Provider>;
  };
  return rtlRender(ui, {
    wrapper: Wrapper,
    store: testStore,
    ...renderOptions,
  });
}
