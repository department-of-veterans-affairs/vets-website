import React from 'react';
import moment from 'moment';

import { getAppointmentTypeFromClinic } from '../../../../questionnaire/utils';

const index = props => {
  const { data, DueDate, Actions } = props;
  const { appointment } = data;
  const { clinic } = appointment;
  const appointmentType = getAppointmentTypeFromClinic(clinic, {
    titleCase: true,
  });
  return (
    <li data-request-id={appointment.id} className="card">
      <header data-testid="appointment-type-header">
        {appointmentType} questionnaire
      </header>
      <section className="due-details">{DueDate && <DueDate />}</section>
      <section className="details">
        <p>Appointment details:</p>
        <p data-testid="facility-name">{appointment.facilityName}</p>
        <time
          data-testid="appointment-time"
          dateTime={appointment.appointmentTime}
        >
          {moment(appointment.appointmentTime).format('MMMM D, YYYY')}
        </time>
      </section>
      {Actions && <Actions />}
    </li>
  );
};

export default index;
