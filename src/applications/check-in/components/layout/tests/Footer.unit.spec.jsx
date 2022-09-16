import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Footer from '../Footer';

describe('check-in', () => {
  describe('Footer', () => {
    let store;
    const initState = {
      checkInData: {
        app: 'PreCheckIn',
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
      },
    };
    const middleware = [];
    const mockStore = configureStore(middleware);
    const mockRouter = {
      params: {
        token: 'token-123',
      },
      location: {
        pathname: '/third-page',
      },
    };
    beforeEach(() => {
      store = mockStore(initState);
    });
    it('check in button passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Footer router={mockRouter} />
        </Provider>,
      );
    });
  });
});
