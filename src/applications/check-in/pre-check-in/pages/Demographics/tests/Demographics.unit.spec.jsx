import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Demographics from '../index';

import { createMockRouter } from '../../../../tests/unit/mocks/router';

describe('pre-check-in', () => {
  describe('Demographics page', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          appointments: [
            {
              facility: 'LOMA LINDA VA CLINIC',
              clinicPhoneNumber: '5551234567',
              clinicFriendlyName: 'TEST CLINIC',
              clinicName: 'LOM ACC CLINIC TEST',
              appointmentIen: 'some-ien',
              startTime: '2021-11-30T17:12:10.694Z',
              eligibility: 'ELIGIBLE',
              facilityId: 'some-facility',
              checkInWindowStart: '2021-11-30T17:12:10.694Z',
              checkInWindowEnd: '2021-11-30T17:12:10.694Z',
              checkedInTime: '',
            },
            {
              facility: 'LOMA LINDA VA CLINIC',
              clinicPhoneNumber: '5551234567',
              clinicFriendlyName: 'TEST CLINIC',
              clinicName: 'LOM ACC CLINIC TEST',
              appointmentIen: 'some-ien',
              startTime: '2021-11-30T17:12:10.694Z',
              eligibility: 'ELIGIBLE',
              facilityId: 'some-facility',
              checkInWindowStart: '2021-11-30T17:12:10.694Z',
              checkInWindowEnd: '2021-11-30T17:12:10.694Z',
              checkedInTime: '',
            },
            {
              facility: 'LOMA LINDA VA CLINIC',
              clinicPhoneNumber: '5551234567',
              clinicFriendlyName: 'TEST CLINIC',
              clinicName: 'LOM ACC CLINIC TEST',
              appointmentIen: 'some-other-ien',
              startTime: '2021-11-30T17:12:10.694Z',
              eligibility: 'ELIGIBLE',
              facilityId: 'some-facility',
              checkInWindowStart: '2021-11-30T17:12:10.694Z',
              checkInWindowEnd: '2021-11-30T17:12:10.694Z',
              checkedInTime: '',
            },
          ],
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
              mailingAddress: {
                street1: '123 Turtle Trail',
                street2: '',
                street3: '',
                city: 'Treetopper',
                state: 'Tennessee',
                zip: '101010',
              },
              homeAddress: {
                street1: '445 Fine Finch Fairway',
                street2: 'Apt 201',
                city: 'Fairfence',
                state: 'Florida',
                zip: '445545',
              },
              homePhone: '5552223333',
              mobilePhone: '5553334444',
              workPhone: '5554445555',
              emailAddress: 'kermit.frog@sesameenterprises.us',
            },
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
        },
      };
      store = mockStore(initState);
    });
    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Demographics router={createMockRouter()} />
        </Provider>,
      );
    });
  });
});
