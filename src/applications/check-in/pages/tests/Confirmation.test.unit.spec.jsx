import React from 'react';

import { Provider } from 'react-redux';
// import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

// import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import Confirmation from '../Confirmation';

// Skipping until the component library is fixed
describe('check-in', () => {
  describe('Confirmation component', () => {
    it.skip('passes axeCheck', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: { selectedAppointment: {} },
          appointments: [{}],
        },
      };
      const store = mockStore(initState);
      axeCheck(
        <Provider store={store}>
          <Confirmation />
        </Provider>,
      );
    });
  });
});
