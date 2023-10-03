import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import UpcomingAppointmentsListItem from '../UpcomingAppointmentsListItem';
import CheckInProvider from '../../tests/unit/utils/CheckInProvider';

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
    basename: 'https://localhost:3001/health-care/appointment-check-in',
  },
  currentPage: '/health-care/appointment-check-in',
};

describe('unified check-in experience', () => {
  describe('UpcomingAppointmentsListItem', () => {
    const goToDetails = sinon.spy();
    it('should render an appointment list item with all the details provided', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[0]}
            goToDetails={goToDetails}
            dayKey
            router={mockRouter}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('day-label')).to.have.text('Tue 16');

      expect(screen.getByTestId('appointment-time')).to.have.text('9:39 p.m.');

      expect(screen.getByTestId('appointment-type-and-provider')).to.have.text(
        'Primary care with Dr. Green',
      );

      expect(screen.getByTestId('appointment-kind-and-location')).to.have.text(
        'In person at LOMA LINDA VA CLINIC',
      );

      fireEvent.click(screen.getByTestId('details-link'));
      expect(goToDetails.calledOnce).to.be.true;
    });
    it('should not render a day label if none is provided', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[0]}
            goToDetails={goToDetails}
            dayKey=""
            router={mockRouter}
          />
        </CheckInProvider>,
      );
      expect(screen.queryByTestId('day-label')).to.not.exist;
    });
    it('should indicate that it is a phone appointment', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[1]}
            goToDetails={goToDetails}
            dayKey=""
            router={mockRouter}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-kind-and-location')).to.have.text(
        'Phone',
      );
    });
    it('should render details properly with no stopCodeName or provider', () => {
      const screen = render(
        <CheckInProvider>
          <UpcomingAppointmentsListItem
            appointment={appointments[1]}
            goToDetails={goToDetails}
            dayKey=""
            router={mockRouter}
          />
        </CheckInProvider>,
      );
      expect(screen.getByTestId('appointment-type-and-provider')).to.have.text(
        'VA Appointment',
      );
    });
  });
});
