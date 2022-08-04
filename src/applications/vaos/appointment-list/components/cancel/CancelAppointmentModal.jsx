import React from 'react';

import CancelVideoAppointmentModal from './CancelVideoAppointmentModal';
import CancelAppointmentFailedModal from './CancelAppointmentFailedModal';
import CancelAppointmentSucceededModal from './CancelAppointmentSucceededModal';
import CancelAppointmentConfirmationModal from './CancelAppointmentConfirmationModal';

import {
  FETCH_STATUS,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
} from '../../../utils/constants';

export default function CancelAppointmentModal(props) {
  const {
    showCancelModal,
    appointmentToCancel,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    onClose,
    onConfirm,
    facility,
    isCerner,
  } = props;

  if (!showCancelModal) {
    return null;
  }

  if (
    appointmentToCancel.vaos?.isVideo &&
    appointmentToCancel.status === APPOINTMENT_STATUS.booked
  ) {
    return (
      <CancelVideoAppointmentModal onClose={onClose} facility={facility} />
    );
  }

  if (cancelAppointmentStatus === FETCH_STATUS.failed) {
    return (
      <CancelAppointmentFailedModal
        isConfirmed={appointmentToCancel.status === APPOINTMENT_STATUS.booked}
        appointment={appointmentToCancel}
        status={cancelAppointmentStatus}
        isBadRequest={cancelAppointmentStatusVaos400}
        facility={facility}
        onClose={onClose}
      />
    );
  }

  if (cancelAppointmentStatus === FETCH_STATUS.succeeded) {
    return (
      <CancelAppointmentSucceededModal
        isConfirmed={appointmentToCancel.status === APPOINTMENT_STATUS.booked}
        onClose={onClose}
      />
    );
  }

  if (
    cancelAppointmentStatus === FETCH_STATUS.notStarted ||
    cancelAppointmentStatus === FETCH_STATUS.loading
  ) {
    return (
      <CancelAppointmentConfirmationModal
        isConfirmed={appointmentToCancel.status === APPOINTMENT_STATUS.booked}
        onClose={onClose}
        onConfirm={onConfirm}
        status={cancelAppointmentStatus}
      />
    );
  }

  return null;
}
