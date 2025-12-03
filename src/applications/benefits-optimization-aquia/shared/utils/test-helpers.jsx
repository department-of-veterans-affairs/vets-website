import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/**
 * Create a simple mock store for testing
 * @param {Object} initialState - Initial Redux state
 * @returns {Object} Mock store
 */
export const createMockStore = (initialState = {}) => {
  const defaultState = {
    form: {
      data: {},
      formId: '21-2680',
      submission: {
        status: false,
        hasAttemptedSubmit: false,
      },
    },
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
      },
    },
    navigation: {
      showLoginModal: false,
    },
    ...initialState,
  };

  // Simple reducer that just returns state
  const rootReducer = (state = defaultState) => state;

  // Create store with thunk middleware
  return createStore(rootReducer, defaultState, applyMiddleware(thunk));
};

/**
 * Create a mock route object for testing pages that use form wizard
 * @param {Object} options - Route options
 * @returns {Object} Mock route object
 */
export const createMockRoute = (options = {}) => ({
  path: '/test-page',
  pageConfig: {},
  pageList: [],
  ...options,
});

/**
 * Create a mock formConfig object for testing
 * @param {Object} options - FormConfig options
 * @returns {Object} Mock formConfig object
 */
export const createMockFormConfig = (options = {}) => ({
  formId: '21-2680',
  title: 'Test Form',
  subTitle: 'Test Form Subtitle',
  customText: {
    finishAppLaterMessage: 'Finish this application later.',
  },
  saveInProgress: {
    messages: {
      inProgress: 'Your application is in progress.',
      expired: 'Your saved application has expired.',
      saved: 'Your application has been saved.',
    },
  },
  ...options,
});

/**
 * Render a component with Redux Provider and Router context
 * Useful for testing components that use PageTemplate (which requires Redux/Router)
 *
 * @param {React.ReactElement} component - Component to render
 * @param {Object} options - Rendering options
 * @param {Object} options.initialState - Initial Redux state
 * @param {Object} options.store - Custom store (overrides initialState)
 * @param {string} options.initialRoute - Initial route path
 * @param {Object} options.route - Mock route object for form wizard pages
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
