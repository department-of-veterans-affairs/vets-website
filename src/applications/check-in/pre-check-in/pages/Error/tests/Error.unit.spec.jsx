import React from 'react';
import { add, sub } from 'date-fns';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { within } from '@testing-library/dom';
import MockDate from 'mockdate';

import CheckInProvider from '../../../../tests/unit/utils/CheckInProvider';
import { singleAppointment } from '../../../../tests/unit/mocks/mock-appointments';
import Error from '../index';

describe('check-in', () => {
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
        expect(component.getByText('Sorry, we can’t complete pre-check-in.')).to
          .exist;
        const dateMessage = component.getByTestId('date-message');
        expect(dateMessage).to.exist;
        expect(dateMessage).to.contain.text(
          'You can pre-check in online until 01/02/2022.',
        );
      });
    });
    describe('max-validation error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'max-validation' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(
          component.getByText(
            'We’re sorry. We couldn’t match your information to our records.',
          ),
        ).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone on the day of your appointment.',
          ),
        ).to.exist;
      });
    });
    describe('uuid-not-found error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'uuid-not-found' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByText('This link has expired')).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone on the day of your appointment.',
          ),
        ).to.exist;
      });
    });
    describe('pre-check-in-past-appointment error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'pre-check-in-past-appointment' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available.'),
        ).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'We’re sorry. Pre-check-in is no longer available for your appointment time. Ask a staff member for help to check in.',
          ),
        ).to.exist;
      });
    });
    describe('session-error error', () => {
      it('renders correct message', () => {
        const component = render(
          <CheckInProvider store={{ error: 'session-error' }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByText('Sorry, we can’t complete pre-check-in.')).to
          .exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone on the day of your appointment.',
          ),
        ).to.exist;
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
        expect(component.getByText('Sorry, we can’t complete pre-check-in.')).to
          .exist;
        const dateMessage = component.getByTestId('date-message');
        expect(dateMessage).to.exist;
        expect(dateMessage).to.contain.text(
          'You can pre-check in online until 01/02/2022.',
        );
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
        expect(
          component.getByText('Sorry, pre-check-in is no longer available.'),
        ).to.exist;
        expect(component.queryByTestId('how-to-link')).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'You can still check-in with your phone once you arrive at your appointment.',
          ),
        ).to.exist;
      });
      it('renders correct error message when phone pre-checkin is expired', () => {
        const phoneAppointments = JSON.parse(JSON.stringify(appointments));
        phoneAppointments[0].kind = 'phone';

        const component = render(
          <CheckInProvider
            store={{
              error: 'pre-check-in-expired',
              appointments: phoneAppointments,
            }}
          >
            <Error />
          </CheckInProvider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available.'),
        ).to.exist;
        const expiredMessage = component.getByTestId('error-message');
        expect(component.queryByTestId('how-to-link')).to.not.exist;
        expect(expiredMessage).to.exist;
        expect(
          within(expiredMessage).getByText(
            'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
          ),
        ).to.exist;
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
        expect(
          component.getByText('Sorry, pre-check-in is no longer available.'),
        ).to.exist;
        expect(component.queryByTestId('how-to-link')).to.not.exist;
        const canceledMessage = component.getByTestId('error-message');
        expect(canceledMessage).to.exist;
        expect(
          within(canceledMessage).getByText(
            'Your appointment at 2:56 p.m. on January 03, 2022 is cancelled.',
          ),
        ).to.exist;
        expect(
          within(canceledMessage).getByText(
            'Or talk to a staff member if you’re at a VA facility.',
          ),
        ).to.exist;
      });
      it('renders correct error message for a canceled phone appointment', () => {
        const phoneAppointments = JSON.parse(JSON.stringify(appointments));
        phoneAppointments[0].kind = 'phone';
        const component = render(
          <CheckInProvider
            store={{
              error: 'appointment-canceled',
              appointments: phoneAppointments,
            }}
          >
            <Error />
          </CheckInProvider>,
        );
        expect(
          component.getByText('Sorry, pre-check-in is no longer available.'),
        ).to.exist;
        expect(component.queryByTestId('how-to-link')).to.not.exist;
        const canceledMessage = component.getByTestId('error-message');
        expect(canceledMessage).to.exist;
        expect(
          within(canceledMessage).getByText(
            'Your appointment at 2:56 p.m. on January 03, 2022 is cancelled.',
          ),
        ).to.exist;
        expect(
          within(canceledMessage).queryByText(
            'Or talk to a staff member if you’re at a VA facility.',
          ),
        ).not.to.exist;
      });
    });

    describe('store with appointment more than 15 minutes past its start time', () => {
      const appointments = [
        {
          facility: 'LOMA LINDA VA CLINIC',
          clinicPhoneNumber: '5551234567',
          clinicFriendlyName: 'TEST CLINIC',
          clinicName: 'LOM ACC CLINIC TEST',
          appointmentIen: 'some-ien',
          startTime: sub(new Date(), { minutes: 16 }),
          eligibility: 'INELIGIBLE_TOO_LATE',
          checkInWindowStart: sub(new Date(), { minutes: 16 }),
          checkInWindowEnd: sub(new Date(), { minutes: 16 }),
          checkedInTime: '',
        },
      ];
      it('renders properly when appointment started more than 15 minutes ago', () => {
        const component = render(
          <CheckInProvider store={{ appointments }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.queryByTestId('error-message')).to.exist;
        expect(component.queryByTestId('how-to-link')).to.not.exist;
      });
    });
    describe('empty redux store', () => {
      it('renders error page', () => {
        const component = render(
          <CheckInProvider store={{ appointments: [], formPages: [] }}>
            <Error />
          </CheckInProvider>,
        );
        expect(component.getByText('Sorry, we can’t complete pre-check-in.')).to
          .exist;
        expect(component.getByTestId('error-message')).to.exist;
      });
    });
  });
});
