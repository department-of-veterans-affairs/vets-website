import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import sinon from 'sinon';
import i18n from '../../../utils/i18n/i18n';
import AppointmentListItemVaos from '../AppointmentListItemVaos';

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
    doctorName: 'Dr. Green',
    clinicStopCodeName: 'Primary care',
    kind: 'phone',
  },
];
describe('AppointmentListItemVaos', () => {
  describe('pre-check-in and day-of', () => {
    describe('In person appointment context', () => {
      it('Renders appointment details', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItemVaos appointment={appointments[0]} />
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
    });
    describe('Phone appointment context', () => {
      it('Renders appointment details', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItemVaos appointment={appointments[1]} />
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
        ).to.have.text('Phone');
      });
    });
    describe('Details link', () => {
      it("Doesn't show if false", () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItemVaos
              appointment={appointments[0]}
              showDetailsLink={false}
              goToDetails={() => {}}
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('details-link')).to.not.exist;
      });
      it('Does show if true', () => {
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItemVaos
              appointment={appointments[0]}
              goToDetails={() => {}}
              showDetailsLink
            />
          </I18nextProvider>,
        );
        expect(screen.queryByTestId('details-link')).to.exist;
      });
      it('Fires go to details function', () => {
        const goToDetails = sinon.spy();
        const screen = render(
          <I18nextProvider i18n={i18n}>
            <AppointmentListItemVaos
              appointment={appointments[0]}
              goToDetails={goToDetails}
              showDetailsLink
            />
          </I18nextProvider>,
        );
        fireEvent.click(screen.getByTestId('details-link'));
        expect(goToDetails.calledOnce).to.be.true;
      });
    });
  });
});
