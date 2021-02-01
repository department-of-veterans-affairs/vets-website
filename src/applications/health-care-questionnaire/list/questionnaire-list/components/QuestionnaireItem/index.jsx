import React from 'react';

import {
  getAppointTypeFromAppointment,
  getClinicFromAppointment,
} from '../../../../questionnaire/utils';

const index = props => {
  const { data, DueDate, Actions } = props;
  const { appointment } = data;
  const appointmentType = getAppointTypeFromAppointment(appointment, {
    titleCase: true,
  });

  const clinic = getClinicFromAppointment(appointment);
  return (
    <li data-request-id={appointment.id} className="card">
      <span className="usa-label">New</span>
      <header data-testid="appointment-type-header">
        {appointmentType} questionnaire
      </header>
      <p className="appointment-location">
        for your appointment at {clinic.friendlyName},{' '}
        {clinic.facility.displayName}
      </p>
      <section className="due-details">{DueDate && <DueDate />}</section>

      {Actions && <Actions />}
    </li>
  );
};

export default index;
