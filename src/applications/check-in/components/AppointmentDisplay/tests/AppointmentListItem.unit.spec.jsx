import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';

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
  {
    facility: 'LOMA LINDA VA CLINIC',
    clinicPhoneNumber: '5551234567',
    clinicFriendlyName: 'TEST CLINIC',
    clinicName: 'LOM ACC CLINIC TEST',
    appointmentIen: 'some-ien',
    startTime: '2021-11-16T21:39:36',
    doctorName: 'Dr. Green',
    clinicStopCodeName: 'Primary care',
    kind: 'vvc',
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
    kind: 'cvt',
  },
];
const mockRouter = {
  currentPage: '/health-care/appointment-check-in',
};

describe('AppointmentListItem', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('pre-check-in', () => {
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
        ).to.have.text('VA appointment with Dr. Green');
        expect(screen.getByTestId('appointment-info-clinic')).to.exist;
      });
      it('Displays appointment instructions for pre-check-in in-person appointment on confirmation page', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              page="confirmation"
              goToDetails={() => {}}
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
      it('Displays the correct aria label for the details link', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[0]}
              page="details"
              goToDetails={() => {}}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('details-link')).to.have.attribute(
          'aria-label',
          'Details for in person VA appointment with Dr. Green on Tuesday, November 16, 2021 at 9:39 p.m.',
        );
      });
    });
    describe('Phone appointment context', () => {
      it('Renders appointment details with no provider', () => {
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
        ).to.have.text('VA appointment');
        expect(screen.getByTestId('appointment-info-phone')).to.exist;
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
      it('Displays the correct aria label for the details link', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[1]}
              page="confirmation"
              goToDetails={() => {}}
            />
          </CheckInProvider>,
        );
        expect(screen.getByTestId('details-link')).to.have.attribute(
          'aria-label',
          'Details for Phone VA appointment on Tuesday, November 16, 2021 at 9:39 p.m.',
        );
      });
    });
    describe('VVC appointment context', () => {
      it('Displays the correct content for pre-check-in VVC appointment on confirmation page', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[2]}
              page="confirmation"
              goToDetails={() => {}}
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.exist;
        expect(screen.queryByTestId('appointment-info-vvc')).to.exist;
        expect(screen.queryByTestId('video-vvc-confirmation')).to.exist;
        expect(screen.getByTestId('details-link')).to.have.attribute(
          'aria-label',
          'Details for video appointment with Dr. Green on Tuesday, November 16, 2021 at 9:39 p.m.',
        );
      });
    });
    describe('CVT appointment context', () => {
      it('Displays the correct content for pre-check-in CVT appointment on confirmation page', () => {
        const screen = render(
          <CheckInProvider router={mockRouter}>
            <AppointmentListItem
              app="preCheckIn"
              appointment={appointments[3]}
              page="confirmation"
              goToDetails={() => {}}
            />
          </CheckInProvider>,
        );
        expect(screen.queryByTestId('appointment-message')).to.exist;
        expect(screen.queryByTestId('appointment-info-cvt')).to.exist;
        expect(screen.queryByTestId('video-cvt-confirmation')).to.exist;
        expect(screen.getByTestId('details-link')).to.have.attribute(
          'aria-label',
          'Details for video appointment at LOMA LINDA VA CLINIC with Dr. Green on Tuesday, November 16, 2021 at 9:39 p.m.',
        );
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
