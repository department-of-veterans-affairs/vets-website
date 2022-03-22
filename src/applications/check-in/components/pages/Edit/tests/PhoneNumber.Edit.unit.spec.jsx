import React from 'react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import PhoneNumber from '../PhoneNumber';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('PhoneNumber', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            context: {
              token: '',
              editing: {
                value: '',
              },
            },
            form: {},
          },
        };
        store = mockStore(initState);
      });

      it('passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <PhoneNumber />
          </Provider>,
        );
      });
    });
  });
});
