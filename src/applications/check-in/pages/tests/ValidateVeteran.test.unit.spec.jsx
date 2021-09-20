/* eslint-disable no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

// import { axeCheck } from 'platform/forms-system/test/config/helpers';

import ValidateVeteran from '../ValidateVeteran';

describe('check in', () => {
  describe('ValidateVeteran', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {},
          appointments: [
            {
              clinicPhone: '555-867-5309',
              appointmentTime: '2021-07-06 12:58:39 UTC',
              facilityName: 'Acme VA',
              clinicName: 'Green Team Clinic1',
            },
          ],
        },
      };
      store = mockStore(initState);
    });
    it('has a header', () => {
      // const component = render(
      //   <Provider store={store}>
      //     <ValidateVeteran />
      //   </Provider>,
      // );
      // expect(component.getByText('Do you need to update any information?')).to
      //   .exist;
    });
  });
});
