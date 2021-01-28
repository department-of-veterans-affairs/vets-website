import React from 'react';
import moment from 'moment';

import { getAppointTypeFromAppointment } from '../../../../questionnaire/utils';

const index = props => {
  const { data, DueDate, Actions } = props;
  const { appointment } = data;
  const appointmentType = getAppointTypeFromAppointment(appointment, {
    titleCase: true,
  });
  const facilityName =
    appointment.attributes.vdsAppointments[0].clinic.facility.displayName;
  const appointmentTime =
    appointment.attributes.vdsAppointments[0].appointmentTime;
  return (
    <li data-request-id={appointment.id} className="card">
      <header data-testid="appointment-type-header">
        {appointmentType} questionnaire
      </header>
      <section className="due-details">{DueDate && <DueDate />}</section>
      <section className="details">
        <p>Appointment details:</p>
        <p data-testid="facility-name">{facilityName}</p>
        <time data-testid="appointment-time" dateTime={appointmentTime}>
          {moment(appointmentTime).format('MMMM D, YYYY')}
        </time>
      </section>
      {Actions && <Actions />}
    </li>
  );
};

export default index;
