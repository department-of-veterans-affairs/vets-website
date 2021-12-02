import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import NextOfKin from '../';

describe('pre-check-in', () => {
  describe('Next of kin page', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        preCheckInData: {
          veteranData: {
            demographics: {
              nextOfKin1: {
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
            currentPage: 'third-page',
            data: { demographicsUpToDate: 'yes' },
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
          <NextOfKin router={{ push: () => {} }} />
        </Provider>,
      );
    });
  });
});
