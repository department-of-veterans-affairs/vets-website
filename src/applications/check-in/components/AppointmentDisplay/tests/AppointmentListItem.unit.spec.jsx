import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';

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
  currentPage: '/health-care/appointment-check-in',
};

describe('AppointmentListItem', () => {
  describe('pre-check-in and day-of', () => {
    describe('In person appointment context', () => {
      it('Renders appointment details', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              page="intro"
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('appointment-time')).to.have.text(
          '9:39 p.m. ',
        );
        expect(
          screen.getByTestId('appointment-type-and-provider'),
        ).to.have.text('Primary care with Dr. Green');
        expect(
          screen.getByTestId('appointment-kind-and-location'),
        ).to.have.text('In person at LOMA LINDA VA CLINIC Clinic: TEST CLINIC');
      });
      it('Displays appointment instructions for pre-check-in in-person appointment on confirmation page', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              page="confirmation"
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.exist;
        expect(screen.queryByTestId('in-person-msg-confirmation')).to.exist;
      });
      it('Does not display appointment instructions for pre-check-in in-person appointment on intro page', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              page="intro"
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.not.exist;
        expect(screen.queryByTestId('in-person-msg-confirmation')).to.not.exist;
      });
    });
    describe('Phone appointment context', () => {
      it('Renders appointment details with no stopCodeName or provider', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[1]}
              page="intro"
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('appointment-time')).to.have.text(
          '9:39 p.m. ',
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
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[1]}
              page="confirmation"
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.exist;
        expect(screen.queryByTestId('phone-msg-confirmation')).to.exist;
      });
    });
    describe('Details link', () => {
      it("Doesn't show if not on correct page", () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              goToDetails={() => {}}
              page="intro"
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('details-link')).to.not.exist;
      });
      it('Does show if on a correct page', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              goToDetails={() => {}}
              page="details"
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('details-link')).to.exist;
      });
      it('Fires go to details function', () => {
        const goToDetails = sinon.spy();
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              goToDetails={goToDetails}
              page="details"
            />
          </CheckInProvider>,
        );
        fireEvent.click(screen.getByTestId('details-link'));
        expect(goToDetails.calledOnce).to.be.true;
      });
    });
  });
});
