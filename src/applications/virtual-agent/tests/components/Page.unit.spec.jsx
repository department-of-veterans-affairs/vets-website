import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // You might need to install this package
import Page from '../../components/Page';

const mockStore = configureStore([]);

describe('Page', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      // Your initial state here
    });
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Page />
      </Provider>,
    );

    expect(getByTestId('page')).toBeInTheDocument(); // Assumes your Page component has a data-testid="page"
  });
});
