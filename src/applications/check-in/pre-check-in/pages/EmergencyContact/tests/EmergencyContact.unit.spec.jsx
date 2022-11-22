import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from '@department-of-veterans-affairs/platform-forms-systems/test/config/helpers';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
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
        ...scheduledDowntimeState,
      };
      store = mockStore(initState);
    });
    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <EmergencyContact router={createMockRouter()} />
          </I18nextProvider>
        </Provider>,
      );
    });
  });
});
