import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { format as formatDate } from 'date-fns';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

import AppointmentBlock from '../AppointmentBlock';

const appointments = [
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: '2021-11-16T21:39:36',
    doctorName: 'Dr. Green',
    clinicStopCodeName: 'Primary care',
    kind: 'clinic',
  },
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: '',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien2',
    startTime: '2021-11-16T23:00:00',
    kind: 'clinic',
  },
];

describe('AppointmentBlock', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('pre-check-in context', () => {
    describe('In person appointment context', () => {
      it('Renders appointment day for multiple appointments', () => {
        const screen = render(
          <CheckInProvider store={{ app: 'preCheckIn' }}>
            <AppointmentBlock appointments={appointments} page="intro" />
          </CheckInProvider>,
        );
        expect(screen.getAllByTestId('appointment-list-item').length).to.equal(
          2,
        );
      });
      it('Renders appointment day and facility for single appointment', () => {
        const updateAppointments = [...appointments];
        const screen = render(
          <CheckInProvider store={{ app: 'preCheckIn' }}>
            <AppointmentBlock
              appointments={[updateAppointments.shift()]}
              page="intro"
            />
          </CheckInProvider>,
        );

        expect(screen.getAllByTestId('appointment-list-item').length).to.equal(
          1,
        );
      });
    });
  });
  describe('day-of context', () => {
    describe('In person appointment context', () => {
      it('Renders appointment date', () => {
        const today = formatDate(new Date(), 'MMMM dd, yyyy');
        const screen = render(
          <CheckInProvider store={{ app: 'dayOf' }}>
            <AppointmentBlock appointments={appointments} page="details" />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('date-text')).to.have.text(
          `Here are your appointments for today: ${today}.`,
        );
      });
    });
  });
});
