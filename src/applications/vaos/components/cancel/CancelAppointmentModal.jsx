import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import CancelVideoAppointmentModal from './CancelVideoAppointmentModal';
import CancelCommunityCareAppointmentModal from './CancelCommunityCareAppointmentModal';
import CancelAppointmentFailedModal from './CancelAppointmentFailedModal';
import CancelAppointmentSucceededModal from './CancelAppointmentSucceededModal';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../../utils/constants';
import { isVideoVisit, getAppointmentType } from '../../utils/appointment';

export default class CancelAppointmentModal extends React.Component {
  render() {
    const {
      showCancelModal,
      appointmentToCancel,
      cancelAppointmentStatus,
      onClose,
      onConfirm,
      facility,
    } = this.props;

    if (!showCancelModal) {
      return null;
    }

    if (isVideoVisit(appointmentToCancel)) {
      return (
        <CancelVideoAppointmentModal onClose={onClose} facility={facility} />
      );
    }

    if (
      getAppointmentType(appointmentToCancel) ===
      APPOINTMENT_TYPES.ccAppointment
    ) {
      return (
        <CancelCommunityCareAppointmentModal
          onClose={onClose}
          appointment={appointmentToCancel}
        />
      );
    }

    if (cancelAppointmentStatus === FETCH_STATUS.failed) {
      return (
        <CancelAppointmentFailedModal
          appointment={appointmentToCancel}
          facility={facility}
          onClose={onClose}
        />
      );
    }

    if (cancelAppointmentStatus === FETCH_STATUS.succeeded) {
      return <CancelAppointmentSucceededModal onClose={onClose} />;
    }

    if (
      cancelAppointmentStatus === FETCH_STATUS.notStarted ||
      cancelAppointmentStatus === FETCH_STATUS.loading
    ) {
      return (
        <Modal
          id="cancelAppt"
          status="warning"
          visible
          onClose={onClose}
          title="Do you want to cancel your appointment?"
        >
          If you want to reschedule this appointment, you’ll need to first
          cancel this one and then create a new appointment.
          <p className="vads-u-margin-top--2">
            <LoadingButton
              isLoading={cancelAppointmentStatus === FETCH_STATUS.loading}
              onClick={onConfirm}
            >
              Yes, cancel this appointment
            </LoadingButton>
            <button
              className="usa-button-secondary"
              onClick={onClose}
              disabled={cancelAppointmentStatus === FETCH_STATUS.loading}
            >
              No, take me back
            </button>
          </p>
        </Modal>
      );
    }

    return null;
  }
}
