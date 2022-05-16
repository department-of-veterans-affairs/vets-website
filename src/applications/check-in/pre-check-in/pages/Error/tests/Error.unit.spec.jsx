import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { add, sub } from 'date-fns';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import Error from '../index';

describe('check-in', () => {
  describe('Pre-check-in Error page', () => {
    describe('redux store with appointments', () => {
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
                startTime: add(new Date(), { days: 6 }),
                eligibility: 'ELIGIBLE',
                facilityId: 'some-facility',
                checkInWindowStart: add(new Date(), { days: 6 }),
                checkInWindowEnd: add(new Date(), { days: 6 }),
                checkedInTime: '',
              },
            ],
            veteranData: {},
          },
        };
        store = mockStore(initState);
      });
      it('renders appointments date', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        const dateMessage = component.getByTestId('date-message');
        expect(dateMessage).to.exist;
        expect(dateMessage).to.contain.text(
          'You can pre-check in online until',
        );
      });
    });
    describe('store with expired appointment (between midnight and 15 min after appt start time)', () => {
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
                startTime: new Date(),
                eligibility: 'ELIGIBLE',
                facilityId: 'some-facility',
                checkInWindowStart: new Date(),
                checkInWindowEnd: add(new Date(), { minutes: 16 }),
                checkedInTime: '',
              },
            ],
            veteranData: {},
          },
        };
        store = mockStore(initState);
      });
      it('renders correct error message when pre-checkin is expired', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone once you arrive at your appointment.',
          ),
        ).to.exist;
      });
    });
    describe('store with appointment more than 15 minutes past its start time', () => {
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
                startTime: sub(new Date(), { minutes: 16 }),
                eligibility: 'INELIGIBLE_TOO_LATE',
                facilityId: 'some-facility',
                checkInWindowStart: sub(new Date(), { minutes: 16 }),
                checkInWindowEnd: sub(new Date(), { minutes: 16 }),
                checkedInTime: '',
              },
            ],
            veteranData: {},
          },
        };
        store = mockStore(initState);
      });
      it('renders no sub message when appointment started more than 15 minutes ago', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        expect(component.queryByTestId('error-message')).to.be.null;
      });
    });
    describe('empty redux store', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            appoinments: [],
            veteranData: {},
          },
        };
        store = mockStore(initState);
      });
      it('renders error page', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
      });
      it('correctly renders pre-check-in expiration date', () => {
        const component = render(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
      });

      it('Passes AxeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <Error />
          </Provider>,
        );
      });
    });
  });
});
