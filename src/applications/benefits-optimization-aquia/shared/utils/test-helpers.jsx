import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

/**
 * Create a mock Redux store for testing
 * @param {Object} initialState - Initial Redux state
 * @returns {Object} Mock store
 */
export const createMockStore = (initialState = {}) => {
  const defaultState = {
    form: {
      data: {},
      lastSavedDate: null,
      autoSavedStatus: 'not-started',
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
    },
    navigation: {
      showLoginModal: false,
    },
    ...initialState,
  };

  return {
    getState: () => defaultState,
    subscribe: () => () => {},
    dispatch: () => {},
    replaceReducer: () => {},
  };
};

/**
 * Render a component with Redux Provider and Router context
 * Useful for testing components that use PageTemplate (which requires Redux/Router)
 *
 * @param {React.ReactElement} component - Component to render
 * @param {Object} options - Rendering options
 * @param {Object} options.initialState - Initial Redux state
 * @param {Object} options.store - Custom store (overrides initialState)
 * @param {string} options.initialRoute - Initial route path
 * @returns {Object} Render result from @testing-library/react
 *
 * @example
 * const { container } = renderWithProviders(
 *   <MyPage data={{}} setFormData={spy} goForward={spy} />
 * );
 */
export const renderWithProviders = (
  component,
  { initialState = {}, store = null, initialRoute = '/' } = {},
) => {
  const mockStore = store || createMockStore(initialState);
  const history = createMemoryHistory({ initialEntries: [initialRoute] });

  const result = render(
    <Provider store={mockStore}>
      <Router history={history}>{component}</Router>
    </Provider>,
  );

  return {
    ...result,
    store: mockStore,
    history,
  };
};
