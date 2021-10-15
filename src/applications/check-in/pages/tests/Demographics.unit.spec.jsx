import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import Demographics from '../Demographics';

describe('check in', () => {
  describe('Demographics', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
        },
      };
      store = mockStore(initState);
    });
    it('renders', () => {
      const component = render(
        <Provider store={store}>
          <Demographics />
        </Provider>,
      );

      expect(component.getByText('Is your contact information correct?')).to
        .exist;
    });

    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Demographics />
        </Provider>,
      );
    });
  });
});
