import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { AppointmentTasks } from '../layout/DetailPageLayout';

describe('VAOS Component: AppointmentTasks', () => {
  it('should display Appointment tasks section with file claim link', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = true;
    const screen = render(
      <AppointmentTasks
        appointmentDate={appointment.start}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
        claimData={claimData}
      />,
    );

    expect(screen.getByText(/Appointment tasks/i)).to.exist;
    expect(screen.getByTestId('file-claim-link')).to.have.attribute(
      'href',
      '/appointments/claims/?date=2021-09-01T10:00:00Z',
    );
    expect(screen.getByText(/Days left to file: 10/i)).to.exist;
  });
  it('should not display Appointment tasks section if not a past appointment', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = false;
    const screen = render(
      <AppointmentTasks
        appointmentDate={appointment.start}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
        claimData={claimData}
      />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display Appointment tasks section if no appointment start date', async () => {
    const appointment = {
      start: null,
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = false;
    const screen = render(
      <AppointmentTasks
        appointmentDate={appointment.start}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
        claimData={claimData}
      />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if no claim data', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = null;
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = true;
    const screen = render(
      <AppointmentTasks
        appointmentDate={appointment.start}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
        claimData={claimData}
      />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if no claim message does not match', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'Not the expected message',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = true;
    const screen = render(
      <AppointmentTasks
        appointmentDate={appointment.start}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
        claimData={claimData}
      />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
  it('should not display file claim link if days remaining are less than 1', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 0;
    const isPastAppointment = true;
    const screen = render(
      <AppointmentTasks
        appointmentDate={appointment.start}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
        claimData={claimData}
      />,
    );

    expect(screen.queryByText(/Appointment tasks/i)).to.not.exist;
  });
});
