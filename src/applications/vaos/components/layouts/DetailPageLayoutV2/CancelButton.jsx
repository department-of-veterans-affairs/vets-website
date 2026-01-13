import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import React from 'react';
import { useDispatch } from 'react-redux';
import { startAppointmentCancel } from '../../../appointment-list/redux/actions';
import { GA_PREFIX, APPOINTMENT_STATUS } from '../../../utils/constants';

export default function CancelButton({ appointment, setCancelStateFunction }) {
  const dispatch = useDispatch();
  const { status, isCancellable, isPastAppointment } = appointment;

  let event = `${GA_PREFIX}-cancel-booked-clicked`;
  if (APPOINTMENT_STATUS.proposed === status)
    event = `${GA_PREFIX}-cancel-request-clicked`;

  const button = (
    <VaButton
      text={`Cancel ${
        APPOINTMENT_STATUS.booked === status ? 'appointment' : 'request'
      }`}
      secondary
      onClick={() => {
        recordEvent({
          event,
        });
        setCancelStateFunction(true);
        dispatch(startAppointmentCancel(appointment));
      }}
      data-testid="cancel-button"
    />
  );

  if (!!isCancellable && !isPastAppointment) return button;

  if (APPOINTMENT_STATUS.proposed === status) return button;

  return null;
}
