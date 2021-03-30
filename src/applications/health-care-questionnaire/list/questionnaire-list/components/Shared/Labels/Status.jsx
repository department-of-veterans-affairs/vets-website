import React from 'react';

import { isAppointmentCancelled } from '../../../../utils';

import {
  appointmentSelector,
  questionnaireResponseSelector,
} from '../../../../../shared/utils/selectors';

export default function Status(props) {
  const { appointment, questionnaire } = props.data;
  const questionnaireStatus = questionnaireResponseSelector.getStatus(
    questionnaire[0].questionnaireResponse,
  );
  const appointmentStatus = appointmentSelector.getStatus(appointment);
  const isCancelled = isAppointmentCancelled(appointmentStatus);

  if (isCancelled) {
    return (
      <span data-testid="status-label" className="usa-label">
        canceled
      </span>
    );
  } else if (questionnaireStatus === 'in-progress') {
    return (
      <span data-testid="status-label" className="usa-label">
        in-progress
      </span>
    );
  } else if (questionnaireStatus === 'completed') {
    return <></>;
  } else {
    return (
      <span data-testid="status-label" className="usa-label">
        not started
      </span>
    );
  }
}
