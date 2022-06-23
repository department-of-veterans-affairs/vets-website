import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n/i18n';
import AppointmentBlockWithIcons from '../AppointmentBlockWithIcons';

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
    describe('In person appointment context', () => {
      it('Renders appointment type label', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.getAllByTestId('appointment-type-label')[0]).to.have.text(
          'In person',
        );
      });
      it('Renders insurance message with appointment on confirmation page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.getAllByTestId('appointment-message')[0]).to.have.text(
          'Please bring your insurance cards with you to your appointment.',
        );
      });
      it('Does not render insurance message with appointment on intro page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.not.exist;
      });
      it('Renders appointment day for multiple appointments', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.getByTestId('appointment-day-location')).to.have.text(
          'Your appointments are on November 16, 2021.',
        );
        expect(screen.getByTestId('appointment-list-item-0')).to.exist;
        expect(screen.getByTestId('appointment-list-item-1')).to.exist;
      });
      it('Renders appointment day and facility for single appointment', () => {
        const updateAppointments = [...appointments];
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={[updateAppointments.shift()]}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.getByTestId('appointment-day-location')).to.have.text(
          'Your appointment is on November 16, 2021.',
        );
        expect(screen.getByTestId('appointment-list-item-0')).to.exist;
        expect(screen.queryByTestId('appointment-list-item-1')).to.not.exist;
      });
      it('Renders appointment facility, time, and clinic', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(
          screen
            .getByTestId('appointment-list-item-0')
            .querySelector('[data-testid="facility-name"]'),
        ).to.have.text('LOMA LINDA VA CLINIC');
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
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(
          screen
            .getByTestId('appointment-list-item-1')
            .querySelector('[data-testid="appointment-clinic"]'),
        ).to.have.text('LOM ACC CLINIC TEST');
      });
      it('passes axeCheck', () => {
        axeCheck(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={appointments}
              page="intro"
            />
          </I18nextProvider>,
        );
      });
    });
    describe('Phone appointment context', () => {
      const phoneAppointments = JSON.parse(JSON.stringify(appointments));
      phoneAppointments[0].kind = 'phone';
      phoneAppointments[1].kind = 'phone';
      it('Renders appointment type label', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={phoneAppointments}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.getAllByTestId('appointment-type-label')[0]).to.have.text(
          'Phone call',
        );
      });
      it('Renders appointment time with no clinic for phone appointments', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={phoneAppointments}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.getByTestId('appointment-day-location')).to.have.text(
          'Your appointments are on November 16, 2021.',
        );
      });
      it('Renders phone message with appointment on confirmation page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={phoneAppointments}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.getAllByTestId('appointment-message')[0]).to.have.text(
          'Your provider will call you. You may need to wait about 15 minutes for their call. Thanks for your patience.',
        );
      });
      it('Renders phone message with appointment on intro page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={phoneAppointments}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.getAllByTestId('appointment-message')[0]).to.have.text(
          'Your provider will call you. ',
        );
      });
      it('Does not render facility name', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={phoneAppointments}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('facility-name')).to.not.exist;
      });
      it('passes axeCheck', () => {
        axeCheck(
          <I18nextProvider i18n={i18n}>
            <AppointmentBlockWithIcons
              appointments={phoneAppointments}
              page="confirmation"
            />
          </I18nextProvider>,
        );
      });
    });
  });
});
