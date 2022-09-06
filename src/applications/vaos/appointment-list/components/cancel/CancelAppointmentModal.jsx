import React, { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';
import CancelAppointmentFailedModal from './CancelAppointmentFailedModal';
import CancelAppointmentSucceededModal from './CancelAppointmentSucceededModal';
import CancelAppointmentConfirmationModal from './CancelAppointmentConfirmationModal';
import {
  closeCancelAppointment,
  confirmCancelAppointment,
} from '../../redux/actions';
import { FETCH_STATUS, APPOINTMENT_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';

export default function CancelAppointmentModal() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { cancelInfo } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );

  const {
    showCancelModal,
    appointmentToCancel,
    cancelAppointmentStatus,
    cancelAppointmentStatusVaos400,
    facility,
  } = cancelInfo;

  const onConfirm = () => dispatch(confirmCancelAppointment());
  const onClose = () => dispatch(closeCancelAppointment());

  useEffect(
    () => {
      if (
        !showCancelModal &&
        cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [showCancelModal, cancelAppointmentStatus],
  );

  if (!showCancelModal) {
    return null;
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
        onConfirm={onConfirm}
        onClose={onClose}
        status={cancelAppointmentStatus}
      />
    );
  }

  return null;
}
