import React from 'react';
import { add } from 'date-fns';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';

import { setupI18n, teardownI18n } from '../../../../utils/i18n/i18n';
import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import { singleAppointment } from '../../../../tests/unit/mocks/mock-appointments';
import Error from '../index';

describe('check-in', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Pre-check-in Error page', () => {
    afterEach(() => {
      MockDate.reset();
    });
    describe('redux store with appointments but pre-check-in-post-error', () => {
      it('renders appointments date', () => {
        MockDate.set('2022-01-01T14:00:00.000-05:00');
        const component = render(
          <CheckInProvider
            store={{
              error: 'pre-check-in-post-error',
              appointments: singleAppointment,
            }}
          >
            <Error />
          </CheckInProvider>,
        );
        const dateMessage = component.getByTestId('date-message');
        expect(dateMessage).to.exist;
      });
    });
    describe('max-validation error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'max-validation' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
        expect(component.getByTestId('max-validation')).to.exist;
      });
    });
    describe('uuid-not-found error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'uuid-not-found' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
        expect(component.getByTestId('uuid-not-found')).to.exist;
      });
    });
    describe('session-error error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'session-error' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
        expect(component.getByTestId('session-error')).to.exist;
      });
    });
    describe('redux store with appointments but error-completing-pre-check-in', () => {
      it('renders appointments date', () => {
        MockDate.set('2022-01-01T14:00:00.000-05:00');
        const component = render(
          <CheckInProvider
            store={{
              error: 'error-completing-pre-check-in',
              appointments: singleAppointment,
            }}
          >
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
        expect(component.getByTestId('error-completing-pre-check-in')).to.exist;
        expect(component.getByTestId('date-message')).to.exist;
      });
    });
    describe('store with expired appointment (between midnight and 15 min after appt start time)', () => {
      const appointments = [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: new Date(),
          eligibility: 'ELIGIBLE',
          checkInWindowStart: new Date(),
          checkInWindowEnd: add(new Date(), { minutes: 14.9 }),
          checkedInTime: '',
        },
      ];

      it('renders correct error message and how-to link when in person pre-checkin is expired', () => {
        const component = render(
          <CheckInProvider
            store={{ error: 'pre-check-in-expired', appointments }}
          >
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
        expect(component.getByTestId('pre-check-in-expired')).to.exist;
        expect(component.queryByTestId('how-to-link')).to.exist;
      });
    });

    describe('store with canceled appointment', () => {
      const appointments = [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: '2022-01-03T14:56:04.788',
          eligibility: 'ELIGIBLE',
          checkInWindowStart: '2022-01-03T14:56:04.788Z',
          checkInWindowEnd: '2022-01-03T14:56:04.788Z',
          checkedInTime: '',
          status: 'CANCELLED BY CLINIC',
        },
      ];

      it('renders correct error message and no how-to link for an in-person canceled appointment', () => {
        const component = render(
          <CheckInProvider
            store={{ error: 'appointment-canceled', appointments }}
          >
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByTestId('error-message')).to.exist;
        expect(component.getByTestId('appointment-canceled')).to.exist;
      });
    });
  });
});
