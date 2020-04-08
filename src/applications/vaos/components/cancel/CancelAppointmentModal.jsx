import React from 'react';

import CancelVideoAppointmentModal from './CancelVideoAppointmentModal';
import CancelCommunityCareAppointmentModal from './CancelCommunityCareAppointmentModal';
import CancelAppointmentFailedModal from './CancelAppointmentFailedModal';
import CancelAppointmentSucceededModal from './CancelAppointmentSucceededModal';
import CancelAppointmentConfirmationModal from './CancelAppointmentConfirmationModal';
import CancelCernerAppointmentModal from './CancelCernerAppointmentModal';

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
      cernerFacilities,
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

    const isCerner = cernerFacilities?.some(facilityId =>
      this.props.appointmentToCancel.facilityId?.startsWith(facilityId),
    );

    if (isCerner) {
      return (
        <CancelCernerAppointmentModal
          onClose={onClose}
          status={cancelAppointmentStatus}
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
        <CancelAppointmentConfirmationModal
          onClose={onClose}
          onConfirm={onConfirm}
          status={cancelAppointmentStatus}
        />
      );
    }

    return null;
  }
}
