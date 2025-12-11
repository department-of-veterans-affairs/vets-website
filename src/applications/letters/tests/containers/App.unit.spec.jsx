import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import { App } from '../../containers/App';

const mockStore = configureStore([]);

describe('<App />', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders without crashing', () => {
    const store = mockStore({
      user: {},
      letters: {},
    });
    const props = {
      featureFlagsLoading: true,
      user: {
        login: {},
        profile: {
          services: [],
          verified: true,
        },
      },
    };
    render(
      <Provider store={store}>
        <App {...props} />
      </Provider>,
    );
  });
});
