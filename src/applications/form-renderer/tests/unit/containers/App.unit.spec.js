import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { applyMiddleware, combineReducers, createStore } from 'redux';

import { mockFetch } from 'platform/testing/unit/helpers';
import App from '../../../containers/App';
import formLoadReducer from '../../../reducers/form-load';
import { formConfig1, normalizedForm } from '../../../_config/formConfig';

const renderApp = store => {
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

describe('<App /> component', () => {
  const mockStore = configureStore([thunk]);

  it('renders error message if error', () => {
    const store = mockStore({
      formLoad: {
        isLoading: false,
        isError: true,
        isSuccess: false,
        error: 'Bad URL',
      },
    });
    const { getByText } = renderApp(store);
    expect(getByText(/Error:.*Bad URL/)).to.exist;
  });

  it('renders loading message if loading', () => {
    const store = mockStore({
      formLoad: {
        isLoading: true,
        isError: false,
        isSuccess: false,
        formId: '123-abc',
      },
    });
    const { getByText } = renderApp(store);
    expect(getByText(/Loading.*123-abc/)).to.exist;
  });
});

describe('<App /> integration', () => {
  const rootReducer = combineReducers({
    formLoad: formLoadReducer.formLoad,
  });

  beforeEach(() => {
    // Mocking fetch to get us past fetchMethod in fetchFormConfig
    const response = { json: () => [formConfig1, normalizedForm] };
    mockFetch(response);
  });

  it('renders error message if no form id in url', async () => {
    const store = createStore(rootReducer, applyMiddleware(thunk));
    window.history.pushState({}, '', `/digital-form`);
    const { getByText } = renderApp(store);
    await waitFor(() => {
      expect(getByText(/Error.*Bad URL - No form id/)).to.exist;
    });
  });

  it('renders loading message if form id present in url', async () => {
    const store = createStore(rootReducer, applyMiddleware(thunk));
    window.history.pushState({}, '', `/digital-form/some-form-id`);
    const { getByText } = renderApp(store);
    await waitFor(() => {
      expect(getByText(/Loading.*some-form-id/)).to.exist;
    });
  });

  it('renders not-found error message if form id in url does not map to real form', async () => {
    const store = createStore(rootReducer, applyMiddleware(thunk));

    window.history.pushState({}, '', `/digital-form/bad-form-id`);
    const { getByText } = renderApp(store);
    await waitFor(() => {
      expect(getByText(/Error.*config not found/)).to.exist;
    });
  });
});
