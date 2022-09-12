import React from 'react';
import PropTypes from 'prop-types';
import InfoAlert from '../../../components/InfoAlert';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function RescheduleOrCancelAlert({ appointment }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment } = appointment.vaos;

  if (canceled || isPastAppointment) {
    return null;
  }

  return (
    <InfoAlert
      status="info"
      className="vads-u-display--block"
      headline="Need to make changes?"
      backgroundOnly
    >
      Contact this provider if you need to reschedule or cancel your
      appointment.
    </InfoAlert>
  );
}
RescheduleOrCancelAlert.propTypes = {
  appointment: PropTypes.object.isRequired,
};
