import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Confirmation from '../index';

describe('pre-check-in', () => {
  describe('Confirmation page', () => {
    describe('redux store without friendly name', () => {
      let store;
      beforeEach(() => {
        const initState = {
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
              },
            },
          },
        };
        const middleware = [];
        const mockStore = configureStore(middleware);
        store = mockStore(initState);
      });
      it('renders page with clinic name', () => {
        const screen = render(
          <Provider store={store}>
            <Confirmation />
          </Provider>,
        );
        expect(screen.getAllByText('LOM ACC CLINIC TEST')).to.have.lengthOf(1);
      });
    });
    describe('redux store with friendly name', () => {
      let store;
      beforeEach(() => {
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
            veteranData: { demographics: {} },
            form: {
              pages: [],
              data: {
                demographicsUpToDate: 'yes',
                nextOfKinUpToDate: 'yes',
              },
            },
          },
        };
        const middleware = [];
        const mockStore = configureStore(middleware);
        store = mockStore(initState);
      });
      it('renders page - no updates', () => {
        const screen = render(
          <Provider store={store}>
            <Confirmation />
          </Provider>,
        );
        expect(screen.getByTestId('confirmation-wrapper')).to.exist;
        expect(screen.queryByTestId('confirmation-update-alert')).to.be.null;
      });
      it('renders page with clinic friendly name', () => {
        const screen = render(
          <Provider store={store}>
            <Confirmation />
          </Provider>,
        );
        expect(screen.getAllByText('TEST CLINIC')).to.have.lengthOf(3);
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
