import React from 'react';

import {
  getAppointTypeFromAppointment,
  getClinicFromAppointment,
} from '../../../../questionnaire/utils';
import { getAppointmentStatus, isAppointmentCancelled } from '../../../utils';

import Status from '../Shared/Labels/Status';

const index = props => {
  const { data, DueDate, Actions, extraText } = props;
  const { appointment } = data;
  const appointmentType = getAppointTypeFromAppointment(appointment, {
    titleCase: true,
  });
  const appointmentStatus = getAppointmentStatus(appointment);
  const isCancelled = isAppointmentCancelled(appointmentStatus);

  const clinic = getClinicFromAppointment(appointment);
  return (
    <li data-request-id={appointment.id} className="card">
      <Status data={data} />
      <header data-testid="appointment-type-header">
        {appointmentType} questionnaire
      </header>
      <p className="appointment-location" data-testid="appointment-location">
        for your {isCancelled ? 'canceled or rescheduled ' : ''}
        appointment at {clinic.friendlyName}, {clinic.facility.displayName}
        {extraText && `. ${extraText}`}
      </p>
      <section className="due-details">{DueDate && <DueDate />}</section>

      {Actions && <Actions />}
    </li>
  );
};

export default index;
