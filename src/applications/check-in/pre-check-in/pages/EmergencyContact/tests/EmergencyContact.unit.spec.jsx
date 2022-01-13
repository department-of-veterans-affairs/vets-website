import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import EmergencyContact from '../index';

import { createMockRouter } from '../../../../tests/unit/mocks/router';

describe('pre-check-in', () => {
  describe('Emergency Contact page', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          veteranData: {
            demographics: {
              emergencyContact: {
                name: 'VETERAN,JONAH',
                relationship: 'BROTHER',
                phone: '1112223333',
                workPhone: '4445556666',
                address: {
                  street1: '123 Main St',
                  street2: 'Ste 234',
                  street3: '',
                  city: 'Los Angeles',
                  county: 'Los Angeles',
                  state: 'CA',
                  zip: '90089',
                  zip4: '',
                  country: 'USA',
                },
              },
            },
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            data: { demographicsUpToDate: 'yes', nextOfKinUpToDate: 'no' },
          },
          context: {
            token: 'token',
          },
        },
      };
      store = mockStore(initState);
    });
    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <EmergencyContact router={createMockRouter()} />
        </Provider>,
      );
    });
  });
});
