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
      <h3 data-testid="appointment-type-header">
        {appointmentType} questionnaire
      </h3>
      <dl className="vads-u-margin-bottom--0p5">
        <dt data-testid="appointment-status">
          For your {isCancelled ? 'canceled or rescheduled ' : ''}
          appointment at
        </dt>
        <dd data-testid="appointment-location">
          {clinicName}, {facilityName}
          {extraText && `. ${extraText}`}
        </dd>
        {DueDate && <DueDate />}
      </dl>
      {Actions && <Actions />}
    </li>
  );
};

export default index;
