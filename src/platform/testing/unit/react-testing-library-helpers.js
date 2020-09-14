import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
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
