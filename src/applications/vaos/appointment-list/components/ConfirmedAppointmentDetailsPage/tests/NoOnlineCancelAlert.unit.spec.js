import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { APPOINTMENT_STATUS } from '../../../../utils/constants';
import NoOnlineCancelAlert from '../NoOnlineCancelAlert';
import { Facility } from '../../../../tests/mocks/unit-test-helpers';

describe('No Online Cancel Modal', () => {
  const appointmentData = {
    vaos: {
      isPastAppointment: false,
    },
    status: APPOINTMENT_STATUS.booked,
  };

  const facilityData = new Facility();
  it('should not render alert when the appointment has past', async () => {
    // Given it is a past appointment
    const appointment = {
      ...appointmentData,
      vaos: {
        isPastAppointment: true,
      },
    };
    // When the page is rendered
    const screen = render(<NoOnlineCancelAlert appointment={appointment} />);
    // It will not show alert message
    expect(screen.baseElement).to.not.contain('.usa-alert-text');
  });
  it('should not render alert when status is cancelled', async () => {
    // Given it is a cancelled appointment
    const appointment = {
      ...appointmentData,
      status: APPOINTMENT_STATUS.cancelled,
    };
    // When the page is rendered
    const screen = render(<NoOnlineCancelAlert appointment={appointment} />);
    // It will not display alert message
    expect(screen.baseElement).to.not.contain('.usa-alert-text');
  });
  it('should render alert message to contact comp and pension office', async () => {
    // Given the appointment status is booked and is a comp and pension
    const appointment = {
      ...appointmentData,
      vaos: {
        isCompAndPenAppointment: true,
      },
    };
    // When the page is rendered
    const screen = render(
      <NoOnlineCancelAlert appointment={appointment} facility={facilityData} />,
    );
    expect(screen.baseElement).to.contain('.usa-alert-text');
    // Then it will display the alert box
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Need to make changes?/,
      }),
    );
    // And the message to contact comp and pension office to cancel appointment
    expect(screen.baseElement).to.contain.text(
      'Contact the Cheyenne VA Medical Center compensation and pension',
    );
    // with associated phone number
    expect(screen.findAllByTestId('facility-telephone')).to.exist;
  });
  it('should render alert message to contact facility to cancel', async () => {
    // Given the appointment status is booked but is not a comp and pension
    const appointment = {
      ...appointmentData,
      vaos: {
        isCompAndPenAppointment: false,
      },
    };
    // When the page is rendered
    const screen = render(
      <NoOnlineCancelAlert appointment={appointment} facility={facilityData} />,
    );
    // Then it will display the alert box
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Need to make changes?/,
      }),
    );
    // And the message to contact facility to cancel appointment
    expect(screen.baseElement).to.contain.text(
      'Contact this facility if you need to reschedule or cancel',
    );
    // With the associated phone number
    expect(screen.baseElement).to.contain('va-telephone');
    expect(screen.findAllByTestId('facility-telephone')).to.exist;
  });
  it('should render alert message to contact the facility where patient scheduled it ', async () => {
    // Given the appointment status is booked but is not a comp and pension
    const appointment = {
      ...appointmentData,
      vaos: {
        isCompAndPenAppointment: false,
      },
    };
    // When the page is rendered with missing facility data
    const screen = render(
      <NoOnlineCancelAlert appointment={appointment} facility={null} />,
    );

    // Then it will display the alert box
    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /Need to make changes?/,
      }),
    );
    // And the message to contact facility to cancel appointment
    expect(screen.baseElement).to.contain.text(
      'contact the VA facility where you scheduled it.',
    );
    // With no associated phone number
    expect(screen.queryByTestId('facility-telephone')).to.be.null;
  });
});
