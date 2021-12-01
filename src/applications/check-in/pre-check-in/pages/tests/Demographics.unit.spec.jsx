import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Demographics from '../Demographics';

describe('pre-check-in', () => {
  describe('Demographics page', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        preCheckInData: {
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
        },
      };
      store = mockStore(initState);
    });
    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Demographics router={{ push: () => {} }} />
        </Provider>,
      );
    });
  });
});
