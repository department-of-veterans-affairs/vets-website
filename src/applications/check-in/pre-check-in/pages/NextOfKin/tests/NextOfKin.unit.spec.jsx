import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { I18nextProvider } from 'react-i18next';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import i18n from '../../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
import NextOfKin from '..';

import { createMockRouter } from '../../../../tests/unit/mocks/router';

describe('pre-check-in', () => {
  describe('Next of kin page', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
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
            data: { demographicsUpToDate: 'yes' },
          },
          context: {
            token: 'token',
          },
        },
        ...scheduledDowntimeState,
      };
      store = mockStore(initState);
    });
    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <NextOfKin router={createMockRouter()} />
          </I18nextProvider>
        </Provider>,
      );
    });
  });
});
