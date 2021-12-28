import React from 'react';
import configureStore from 'redux-mock-store';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';

import { render, waitFor } from '@testing-library/react';

import withToken from '../withToken';

describe('check-in', () => {
  const checkInUuidKey = 'health.care.check-in.current.uuid';

  afterEach(() => {
    global.window.sessionStorage.removeItem(checkInUuidKey);
  });

  describe('withToken', () => {
    it('shows the provided component if the data is in the store', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: 'token',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
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

    it('redirects to the landing page if the context is unavailable and session data is available', async () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {},
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
        },
      };
      const store = mockStore(initState);

      const push = sinon.spy();
      const mockRouter = {
        push,
      };

      global.window.sessionStorage.setItem(
        checkInUuidKey,
        '{"token":"test-uuid"}',
      );

      const Test = withToken(() => <span data-testid="data">magic</span>);
      render(
        <Provider store={store}>
          <Test router={mockRouter} />
        </Provider>,
      );

      await waitFor(() => {
        expect(push.called).to.be.true;
        expect(push.lastCall.args[0]).to.deep.equal({
          pathname: '',
          search: '?id=test-uuid',
        });
      });
    });

    it('shows nothing if the data is not in the store and not in session', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {},
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
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
