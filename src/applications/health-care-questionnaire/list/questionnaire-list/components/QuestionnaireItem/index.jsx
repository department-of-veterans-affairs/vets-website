import React from 'react';

import { isAppointmentCancelled } from '../../../utils';
import {
  appointmentSelector,
  locationSelector,
  organizationSelector,
} from '../../../../shared/utils/selectors';

import Status from '../Shared/Labels/Status';

const index = props => {
  const { data, DueDate, Actions, extraText } = props;
  const { appointment, organization, location } = data;

  const appointmentStatus = appointmentSelector.getStatus(appointment);
  const appointmentType = locationSelector.getType(location, {
    titleCase: true,
  });
  const isCancelled = isAppointmentCancelled(appointmentStatus);

  const facilityName = organizationSelector.getName(organization);
  const clinicName = locationSelector.getName(location);
  return (
    <li data-request-id={appointment.id} className="card">
      <Status data={data} />
      <header data-testid="appointment-type-header">
        {appointmentType} questionnaire
      </header>
      <p className="appointment-location" data-testid="appointment-location">
        for your {isCancelled ? 'canceled or rescheduled ' : ''}
        appointment at {clinicName}, {facilityName}
        {extraText && `. ${extraText}`}
      </p>
      <section className="due-details">{DueDate && <DueDate />}</section>

      {Actions && <Actions />}
    </li>
  );
};

export default index;
