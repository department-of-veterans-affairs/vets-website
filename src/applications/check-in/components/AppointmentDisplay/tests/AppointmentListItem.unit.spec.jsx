import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import sinon from 'sinon';
import i18n from '../../../utils/i18n/i18n';
import AppointmentListItem from '../AppointmentListItem';

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
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: '2021-11-16T21:39:36',
    doctorName: '',
    clinicStopCodeName: '',
    kind: 'phone',
  },
];
const mockRouter = {
  location: {
    basename: '/health-care/appointment-check-in',
  },
};

describe('AppointmentListItem', () => {
  describe('pre-check-in and day-of', () => {
    describe('In person appointment context', () => {
      it('Renders appointment details', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              router={mockRouter}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.getByTestId('appointment-time')).to.have.text(
          '9:39 p.m.',
        );
        expect(
          screen.getByTestId('appointment-type-and-provider'),
        ).to.have.text('Primary care with Dr. Green');
        expect(
          screen.getByTestId('appointment-kind-and-location'),
        ).to.have.text(
          'In person at LOMA LINDA VA CLINIC  Clinic: TEST CLINIC',
        );
      });
      it('Displays appointment instructions for pre-check-in in-person appointment on confirmation page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              router={mockRouter}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.exist;
        expect(screen.queryByTestId('in-person-msg-confirmation')).to.exist;
      });
      it('Does not display appointment instructions for pre-check-in in-person appointment on intro page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              router={mockRouter}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.not.exist;
        expect(screen.queryByTestId('in-person-msg-confirmation')).to.not.exist;
      });
    });
    describe('Phone appointment context', () => {
      it('Renders appointment details with no stopCodeName or provider', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[1]}
              router={mockRouter}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.getByTestId('appointment-time')).to.have.text(
          '9:39 p.m.',
        );
        expect(
          screen.getByTestId('appointment-type-and-provider'),
        ).to.have.text('VA Appointment');
        expect(
          screen.getByTestId('appointment-kind-and-location'),
        ).to.have.text('Phone');
      });
      it('Displays appointment instructions for pre-check-in phone appointment confirmation page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[1]}
              router={mockRouter}
              page="confirmation"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.exist;
        expect(screen.queryByTestId('phone-msg-confirmation')).to.exist;
      });
    });
    describe('Details link', () => {
      it("Doesn't show if not on correct page", () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              goToDetails={() => {}}
              router={mockRouter}
              page="intro"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('details-link')).to.not.exist;
      });
      it('Does show if on a correct page', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              goToDetails={() => {}}
              router={mockRouter}
              page="details"
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('details-link')).to.exist;
      });
      it('Fires go to details function', () => {
        const goToDetails = sinon.spy();
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              goToDetails={goToDetails}
              router={mockRouter}
              page="details"
            />
          </I18nextProvider>,
        );
        fireEvent.click(screen.getByTestId('details-link'));
        expect(goToDetails.calledOnce).to.be.true;
      });
    });
  });
});
