import React from 'react';
import format from 'date-fns/format';

import { VaAlert } from 'web-components/react-bindings';
import { focusElement } from 'platform/utilities/ui';

import BackToHome from '../../components/BackToHome';
import BackToAppointments from '../../components/BackToAppointments';
import Footer from '../../components/Footer';
import AppointmentLocation from '../../components/AppointmentDisplay/AppointmentLocation';

export default function MultipleAppointments({
  appointments,
  selectedAppointment,
}) {
  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);
  const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
  return (
    <div className="vads-l-grid-container vads-u-padding-y--5">
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
      <BackToAppointments appointments={appointments} />
      <Footer />
      <BackToHome />
    </div>
  );
}
