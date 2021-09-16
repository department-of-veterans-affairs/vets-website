import React from 'react';
import configureStore from 'redux-mock-store';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';

import { render } from '@testing-library/react';

import withToken from '../withToken';

describe('check-in', () => {
  describe('withToken', () => {
    it('shows the provided component if the data is in the store', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: 'token',
          },
        },
      };
      const store = mockStore(initState);
      const Test = withToken(() => <span data-testid="data">magic</span>);
      const withRequired = render(
        <Provider store={store}>
          <Test />
        </Provider>,
      );
      expect(withRequired.getByTestId('data')).to.exist;
      expect(withRequired.getByTestId('data')).to.have.text('magic');
    });

    it('shows the returns nothing if the data is not in the store and not in session', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {},
        },
      };
      const store = mockStore(initState);
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };
      const Test = withToken(() => <span data-testid="data">magic</span>);
      const withRequired = render(
        <Provider store={store}>
          <Test router={mockRouter} />
        </Provider>,
      );
      expect(withRequired.queryAllByTestId('data')).to.be.empty;
    });
  });
});
