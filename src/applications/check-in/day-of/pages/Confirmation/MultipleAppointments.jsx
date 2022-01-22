import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import { VaAlert } from 'web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../../../components/BackToHome';
import BackToAppointments from '../../../components/BackToAppointments';
import Footer from '../../../components/Footer';
import AppointmentLocation from '../../../components/AppointmentDisplay/AppointmentLocation';
import TravelPayReimbursementLink from '../../../components/TravelPayReimbursementLink';

const MultipleAppointments = props => {
  const { appointments, selectedAppointment, triggerRefresh } = props;

  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);
  const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
  return (
    <div
      className="vads-l-grid-container vads-u-padding-y--5"
      data-testid="multiple-appointments-confirm"
    >
      <VaAlert
        status="success"
        onVa-component-did-load={() => {
          focusElement('h1');
        }}
      >
        <h1
          tabIndex="-1"
          aria-label="Thank you for checking in. "
          slot="headline"
        >
          You’re checked in for your {appointmentTime} appointment
        </h1>
        <p>
          We’ll come get you from the{' '}
          <AppointmentLocation appointment={appointment} bold /> waiting room
          when it’s time for your appointment to start.
        </p>
      </VaAlert>
      <TravelPayReimbursementLink />
      <BackToAppointments
        appointments={appointments}
        triggerRefresh={triggerRefresh}
      />
      <Footer isPreCheckIn={false} />
      <BackToHome isPreCheckIn={false} />
    </div>
  );
};

MultipleAppointments.propTypes = {
  appointments: PropTypes.array,
  selectedAppointment: PropTypes.object,
  triggerRefresh: PropTypes.func,
};

export default MultipleAppointments;
