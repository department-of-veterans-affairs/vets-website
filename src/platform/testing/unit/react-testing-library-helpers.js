import React from 'react';
import { Router } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import { Provider } from 'react-redux';
import { PropTypes } from 'prop-types';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { isPlainObject } from 'lodash';
import { render as rtlRender } from '@testing-library/react';

import { commonReducer } from 'platform/startup/store';
import { createTestHistory } from './helpers';

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
  {
    initialState = {},
    reducers = {},
    store = null,
    additionalMiddlewares = [],
    ...renderOptions
  } = {},
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
      applyMiddleware(thunk, ...additionalMiddlewares),
    );
  const Wrapper = ({ children }) => {
    return <Provider store={testStore}>{children}</Provider>;
  };
  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return rtlRender(ui, {
    wrapper: Wrapper,
    store: testStore,
    ...renderOptions,
  });
}

/**
 * Takes a React element and wraps it in a Redux Provider and React Router.
 *
 * This function allows for rendering part of an app with the usual
 * context it operates in, namely with a Redux store and Router.
 * You can pass components with routes defined in them and routing
 * between those pages will work. Or, you can pass a single page component.
 *
 * Will return the {@link https://testing-library.com/docs/react-testing-library/api#render-result|result of the render function}
 * from React Testing Library, with the history object added in.
 *
 * @export
 * @param {ReactElement} ui ReactElement that you want to render for testing
 * @param {Object} renderParams
 * @param {Object} [renderParams.initialState] Initial Redux state, used to create a new store if a store is not passed
 * @param {Object} [renderParams.reducers={}] App specific reducers
 * @param {ReduxStore} [renderParams.store=null] Redux store to use for the rendered page or section of the app
 * @param {string} [renderParams.path='/'] Url path to start from
 * @param {History} [renderParams.history=null] Custom history object to use, will create one if not passed
 * @param {Array} [renderParams.additionalMiddlewares=[]] Additional Redux middlewares to add to the store
 * @returns {Object} Return value of the React Testing Library render function, plus the history object used
 */
export function renderWithStoreAndRouter(
  ui,
  {
    initialState,
    reducers = {},
    store = null,
    path = '/',
    history = null,
    additionalMiddlewares = [],
  },
) {
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk, ...additionalMiddlewares),
    );

  const historyObject = history || createTestHistory(path);
  const screen = renderInReduxProvider(
    <Router history={historyObject}>{ui}</Router>,
    {
      store: testStore,
      initialState,
      reducers,
      additionalMiddlewares,
    },
  );

  return { ...screen, history: historyObject };
}

/**
 * Takes a React element and wraps it in a Redux Provider and a React Router v6 MemoryRouter.
 *
 * @export
 * @param {ReactElement} ui ReactElement that you want to render for testing
 * @param {Object} renderParams
 * @param {Object} [renderParams.initialState] Initial Redux state, used to create a new store if a store is not passed
 * @param {Object} [renderParams.reducers={}] App specific reducers
 * @param {ReduxStore} [renderParams.store=null] Redux store to use for the rendered page or section of the app
 * @param {string[]} [renderParams.initialEntries=['/'] Array of initial entries for the router
 * @returns {Object} Return value of the React Testing Library render function
 */
export function renderWithStoreAndRouterV6(
  ui,
  {
    initialState,
    reducers = {},
    store = null,
    initialEntries = ['/'],
    additionalMiddlewares = [],
  },
) {
  const testStore =
    store ||
    createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      initialState,
      applyMiddleware(thunk, ...additionalMiddlewares),
    );

  // Convert single string path to array if needed
  const entries = Array.isArray(initialEntries)
    ? initialEntries
    : [initialEntries];

  const screen = renderInReduxProvider(
    <MemoryRouter initialEntries={entries}>{ui}</MemoryRouter>,
    {
      store: testStore,
      initialState,
      reducers,
    },
  );

  return { ...screen };
}
