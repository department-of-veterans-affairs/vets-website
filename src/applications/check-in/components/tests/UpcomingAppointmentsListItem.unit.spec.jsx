import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import UpcomingAppointmentsListItem from '../UpcomingAppointmentsListItem';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';
import { setupI18n, teardownI18n } from '../../utils/i18n/i18n';

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
    doctorName: '',
    clinicStopCodeName: '',
    kind: 'cvt',
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
    kind: 'clinic',
    status: 'CANCELLED BY PATIENT',
  },
];

const mockRouter = {
  location: {
    basename: 'https://localhost:3001/health-care/appointment-check-in',
  },
  currentPage: '/health-care/appointment-check-in',
};

describe('unified check-in experience', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('UpcomingAppointmentsListItem', () => {
    const goToDetails = sinon.spy();
    it('should render an appointment list item with all the details provided', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[0]}
            goToDetails={goToDetails}
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );

      expect(screen.getByTestId('appointment-details')).to.exist;

      expect(screen.getByTestId('appointment-time')).to.have.text('9:39 p.m.');

      expect(screen.getByTestId('appointment-type-and-provider')).to.have.text(
        'Primary care with Dr. Green',
      );

      expect(screen.getByTestId('appointment-kind-and-location')).to.have.text(
        'In person at LOMA LINDA VA CLINIC Clinic: TEST CLINIC',
      );

      fireEvent.click(screen.getByTestId('details-link'));
      expect(goToDetails.calledOnce).to.be.true;
    });
    it('should indicate that it is a phone appointment', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[1]}
            goToDetails={goToDetails}
            dayKey=""
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-kind-and-location')).to.have.text(
        'Phone',
      );
    });
    it('should indicate that it is a cvt appointment', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[2]}
            goToDetails={goToDetails}
            dayKey=""
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-info-cvt')).to.exist;
    });
    it('should indicate that it is a vvc appointment', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[3]}
            goToDetails={goToDetails}
            dayKey=""
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-info-vvc')).to.exist;
    });
    it('should render details properly with no stopCodeName or provider', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[1]}
            goToDetails={goToDetails}
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-type-and-provider')).to.have.text(
        'VA appointment',
      );
    });
    it('should render details with strikethough if the appointment was cancelled', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[4]}
            goToDetails={goToDetails}
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-details-cancelled')).to.exist;
    });
    it('renders as a list item when more than one', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[0]}
            goToDetails={() => {}}
            router={mockRouter}
            count={5}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByRole('listitem')).to.exist;
    });
    it('does not render as a list item when only one', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[0]}
            goToDetails={() => {}}
            router={mockRouter}
            count={1}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByRole('listitem')).to.not.exist;
    });
  });
});
