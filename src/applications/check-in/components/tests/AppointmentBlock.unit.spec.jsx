import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import AppointmentBlock from '../AppointmentBlock';

const appointments = [
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: '2021-11-16T21:39:36',
  },
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: '',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: '2021-11-16T23:00:00',
  },
];
describe('pre-check-in', () => {
  describe('AppointmentBlock', () => {
    it('Renders appointment day and facility for multiple appointments', () => {
      const screen = render(<AppointmentBlock appointments={appointments} />);
      expect(screen.getByTestId('appointment-day-location')).to.have.text(
        'Your appointments are on November 16, 2021 at LOMA LINDA VA CLINIC.',
      );
      expect(screen.getByTestId('appointment-list-item-0')).to.exist;
      expect(screen.getByTestId('appointment-list-item-1')).to.exist;
    });
    it('Renders appointment day and facility for single appointment', () => {
      const updateAppointments = [...appointments];
      const screen = render(
        <AppointmentBlock appointments={[updateAppointments.shift()]} />,
      );
      expect(screen.getByTestId('appointment-day-location')).to.have.text(
        'Your appointment is on November 16, 2021 at LOMA LINDA VA CLINIC.',
      );
      expect(screen.getByTestId('appointment-list-item-0')).to.exist;
      expect(screen.queryByTestId('appointment-list-item-1')).to.not.exist;
    });
    it('Renders appointment time and clinic', () => {
      const screen = render(<AppointmentBlock appointments={appointments} />);
      expect(
        screen
          .getByTestId('appointment-list-item-0')
          .querySelector('[data-testid="appointment-time"]'),
      ).to.have.text('9:39 p.m.');
      expect(
        screen
          .getByTestId('appointment-list-item-0')
          .querySelector('[data-testid="appointment-clinic"]'),
      ).to.have.text('TEST CLINIC');
    });
    it('Renders clinicName if no clinicFriendlyName', () => {
      const screen = render(<AppointmentBlock appointments={appointments} />);
      expect(
        screen
          .getByTestId('appointment-list-item-1')
          .querySelector('[data-testid="appointment-clinic"]'),
      ).to.have.text('LOM ACC CLINIC TEST');
    });
    it('check in button passes axeCheck', () => {
      axeCheck(<AppointmentBlock appointments={appointments} />);
    });
  });
});
