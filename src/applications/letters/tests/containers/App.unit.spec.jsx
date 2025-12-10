import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { App } from '../../containers/App';

const mockStore = configureStore([]);

describe('<App />', () => {
  it('renders without crashing', () => {
    const store = mockStore({
      user: {},
      letters: {},
      // ...add more if needed...
    });

    render(
      <Provider store={store}>
        <App letterTitle="Test Letter" letterType="test_letter" />
      </Provider>,
    );
  });
});
