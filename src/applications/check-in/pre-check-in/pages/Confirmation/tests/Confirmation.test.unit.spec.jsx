import React from 'react';
import TestRenderer from 'react-test-renderer';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { createMockRouter } from '../../../../tests/unit/mocks/router';
import Confirmation from '../index';
import PreCheckinConfirmation from '../../../../components/PreCheckinConfirmation';

describe('pre-check-in', () => {
  describe('Confirmation page', () => {
    describe('redux store without friendly name', () => {
      let initState;
      let store;
      beforeEach(() => {
        initState = {
          checkInData: {
            appointments: [
              {
                facility: 'LOMA LINDA VA CLINIC',
                clinicPhoneNumber: '5551234567',
                clinicFriendlyName: '',
                clinicName: 'LOM ACC CLINIC TEST',
                appointmentIen: 'some-ien',
                startTime: '2021-11-30T17:12:10.694Z',
                eligibility: 'ELIGIBLE',
                facilityId: 'some-facility',
                checkInWindowStart: '2021-11-30T17:12:10.694Z',
                checkInWindowEnd: '2021-11-30T17:12:10.694Z',
                checkedInTime: '',
              },
            ],
            veteranData: { demographics: {} },
            form: {
              pages: [],
              data: {
                demographicsUpToDate: 'yes',
                nextOfKinUpToDate: 'yes',
                emergencyContactUpToDate: 'yes',
              },
            },
            context: {
              token: 'token',
            },
          },
        };
        const middleware = [];
        const mockStore = configureStore(middleware);
        store = mockStore(initState);
      });
      it('passes the correct props to the pre-checkin confirmation component', () => {
        const testRenderer = TestRenderer.create(
          <Provider store={store}>
            <Confirmation router={createMockRouter()} />
          </Provider>,
        );
        const testInstance = testRenderer.root;
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.formData,
        ).to.equal(initState.checkInData.form.data);
        expect(
          testInstance.findByType(PreCheckinConfirmation).props.appointments,
        ).to.equal(initState.checkInData.appointments);
      });
    });
    describe('redux store with friendly name', () => {
      let initState;
      let store;
      beforeEach(() => {
        initState = {
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
            veteranData: { demographics: {} },
            form: {
              pages: [],
              data: {
                demographicsUpToDate: 'yes',
                nextOfKinUpToDate: 'yes',
                emergencyContactUpToDate: 'no',
              },
            },
            context: {
              token: 'token',
            },
          },
        };
        const middleware = [];
        const mockStore = configureStore(middleware);
        store = mockStore(initState);
      });
      it('page passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <Confirmation />
          </Provider>,
        );
      });
    });
  });
});
