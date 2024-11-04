import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { TravelReimbursement } from '../layout/DetailPageLayout';

describe('VAOS Component: TravelReimbursement', () => {
  it('should display travel reimbursement section with file claim link', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = true;
    const screen = render(
      <TravelReimbursement
        appointmentDate={appointment.start}
        claimData={claimData}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
      />,
    );

    expect(screen.getByText(/Days left to file: 10/i));
    expect(screen.getByTestId('file-claim-link')).to.exist;
  });
  it('should display travel reimbursement section with how to file a claim link', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 0;
    const isPastAppointment = true;
    const screen = render(
      <TravelReimbursement
        appointmentDate={appointment.start}
        claimData={claimData}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
      />,
    );

    expect(screen.getByText(/Days left to file: 0/i));
    expect(screen.getByTestId('how-to-file-claim-link')).to.exist;
  });
  it('should display travel reimbursement section with link to view claim status', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      id: '1234',
    };
    const daysRemainingToFileClaim = 0;
    const isPastAppointment = true;
    const screen = render(
      <TravelReimbursement
        appointmentDate={appointment.start}
        claimData={claimData}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
      />,
    );

    expect(
      screen.getByText(
        /You've already filed a claim for this facility and date./i,
      ),
    );
    expect(screen.getByTestId('view-claim-link')).to.exist;
    expect(screen.getByTestId('view-claim-link')).to.have.attribute(
      'href',
      '/appointments/claims/1234',
    );
  });
  it('should not display travel reimbursement section if appointment is not past', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim for this appointment',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = false;
    const screen = render(
      <TravelReimbursement
        appointmentDate={appointment.start}
        claimData={claimData}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
      />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
  it('should not display travel reimbursement section if claim data is not present', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = null;
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = true;
    const screen = render(
      <TravelReimbursement
        appointmentDate={appointment.start}
        claimData={claimData}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
      />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
  it('should not display travel reimbursement section if claim data message is not expected', async () => {
    const appointment = {
      start: '2021-09-01T10:00:00Z',
    };
    const claimData = {
      message: 'No claim',
    };
    const daysRemainingToFileClaim = 10;
    const isPastAppointment = true;
    const screen = render(
      <TravelReimbursement
        appointmentDate={appointment.start}
        claimData={claimData}
        daysRemainingToFileClaim={daysRemainingToFileClaim}
        isPastAppointment={isPastAppointment}
      />,
    );
    expect(screen.queryByText(/Travel reimbursement/i)).to.not.exist;
  });
});
