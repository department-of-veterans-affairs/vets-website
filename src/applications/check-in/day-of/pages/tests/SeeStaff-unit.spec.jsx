import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import SeeStaff from '../SeeStaff';

describe('check in', () => {
  describe('SeeStaff', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          seeStaffMessage: 'message test',
        },
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
      };
      store = mockStore(initState);
    });
    it('has a header', () => {
      const component = render(
        <Provider store={store}>
          <SeeStaff />
        </Provider>,
      );

      expect(component.getByText('message test')).to.exist;
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <SeeStaff />
        </Provider>,
      );
    });
  });
});
