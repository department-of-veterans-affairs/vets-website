import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import AppointmentBlock from '../AppointmentBlock';
import i18n from '../../utils/i18n/i18n';

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
    appointmentIen: 'some-ien2',
    startTime: '2021-11-16T23:00:00',
  },
];
describe('pre-check-in', () => {
  describe('AppointmentBlock', () => {
    it('Renders appointment day and facility for multiple appointments', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <AppointmentBlock appointments={appointments} />
        </I18nextProvider>,
      );
      expect(screen.getByTestId('appointment-day-location')).to.have.text(
        'Your appointments are on November 16, 2021 at LOMA LINDA VA CLINIC.',
      );
      expect(screen.getAllByTestId('appointment-list-item').length).to.equal(2);
    });
    it('Renders appointment day and facility for single appointment', () => {
      const updateAppointments = [...appointments];
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <AppointmentBlock appointments={[updateAppointments.shift()]} />
        </I18nextProvider>,
      );
      expect(screen.getByTestId('appointment-day-location')).to.have.text(
        'Your appointment is on November 16, 2021 at LOMA LINDA VA CLINIC.',
      );
      expect(screen.getAllByTestId('appointment-list-item').length).to.equal(1);
    });
    it('Renders appointment time and clinic', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <AppointmentBlock appointments={appointments} />
        </I18nextProvider>,
      );
      expect(
        screen
          .getAllByTestId('appointment-list-item')[0]
          .querySelector('[data-testid="appointment-time"]'),
      ).to.have.text('9:39 p.m.');
      expect(
        screen
          .getAllByTestId('appointment-list-item')[0]
          .querySelector('[data-testid="appointment-clinic"]'),
      ).to.have.text('TEST CLINIC');
    });
    it('Renders clinicName if no clinicFriendlyName', () => {
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <AppointmentBlock appointments={appointments} />
        </I18nextProvider>,
      );
      expect(
        screen
          .getAllByTestId('appointment-list-item')[1]
          .querySelector('[data-testid="appointment-clinic"]'),
      ).to.have.text('LOM ACC CLINIC TEST');
    });

    it('should render the appointment location when available', () => {
      const locationAppointments = [...appointments];
      locationAppointments[0].clinicLocation = 'Test location';
      const screen = render(
        <I18nextProvider i18n={i18n}>
          <AppointmentBlock appointments={locationAppointments} />
        </I18nextProvider>,
      );
      expect(
        screen
          .getAllByTestId('appointment-list-item')[0]
          .querySelector('[data-testid="clinic-location"]'),
      ).to.have.text('Test location');
      expect(
        screen
          .getAllByTestId('appointment-list-item')[1]
          .querySelector('[data-testid="clinic-location"]'),
      ).to.not.exist;
    });

    it('check in button passes axeCheck', () => {
      axeCheck(<AppointmentBlock appointments={appointments} />);
    });
  });
});
