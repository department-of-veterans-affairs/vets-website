import React from 'react';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FormRenderer from '../../../containers/FormRenderer';
import * as routes from '../../../routes';

const renderApp = (store, formId) => {
  return render(
    <Provider store={store}>
      <FormRenderer
        formId={formId}
        rootUrl="/root-url"
        trackingPrefix="tracking-prefix-"
      />
    </Provider>,
  );
};

describe('<FormRenderer /> component', () => {
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
      },
    });
    const { getByText } = renderApp(store, 'some-form-id');
    expect(getByText(/Loading.*some-form-id/)).to.exist;
  });

  it('does not render an error if formConfig is set', async () => {
    const store = mockStore({
      formLoad: {
        isLoading: false,
        isError: false,
        isSuccess: true,
        formConfig: {
          someKey: 'someVal',
        },
      },
    });
    // mock the injectReducer function
    store.injectReducer = () => {};

    // mock getRoutesFromFormConfig
    sinon.stub(routes, 'getRoutesFromFormConfig').returns({
      path: `/`,
      component: () => <div>Test Component</div>,
    });

    const { getByText } = renderApp(store, 'some-form-id');
    await waitFor(() => {
      expect(getByText(/Test Component/)).to.exist;
    });
  });
});
