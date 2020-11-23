import React from 'react';
import moment from 'moment';

const index = props => {
  const { data, DueDate, Actions } = props;
  const { appointment } = data;
  return (
    <li data-request-id={appointment.id} className="card">
      <header>Primary care questionnaire</header>
      <section className="due-details">
        <DueDate />
      </section>
      <section className="details">
        <p>Appointment details:</p>
        <p>{appointment.facilityName}</p>
        <time dateTime={appointment.appointmentTime}>
          {moment(appointment.appointmentTime).format('MMMM D, YYYY')}
        </time>
      </section>
      <Actions />
    </li>
  );
};

export default index;
