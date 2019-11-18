import React from 'react';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import { FETCH_STATUS } from '../utils/constants';
import { getStagingId } from '../utils/appointment';

export default class CancelAppointmentModal extends React.Component {
  render() {
    const {
      showCancelModal,
      appointmentToCancel,
      cancelAppointmentStatus,
      onClose,
      onConfirm,
    } = this.props;

    if (!showCancelModal) {
      return null;
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
          If you want to reschedule, you will have to cancel this one and create
          a new appointment.
          <p className="vads-u-margin-top--2">
            <LoadingButton
              isLoading={cancelAppointmentStatus === FETCH_STATUS.loading}
              onClick={onConfirm}
            >
              Yes, cancel
            </LoadingButton>
            <button
              onClick={onClose}
              disabled={cancelAppointmentStatus === FETCH_STATUS.loading}
            >
              No, take me back
            </button>
          </p>
        </Modal>
      );
    }

    if (cancelAppointmentStatus === FETCH_STATUS.succeeded) {
      return (
        <Modal
          id="cancelAppt"
          status="success"
          visible
          onClose={onClose}
          title="You have canceled your appointment"
        >
          Your provider has been notified of your cancellation
          <p className="vads-u-margin-top--2">
            <button onClick={this.props.onClose}>Continue</button>
          </p>
        </Modal>
      );
    }

    if (
      !!appointmentToCancel.appointmentRequestId &&
      cancelAppointmentStatus === FETCH_STATUS.failed
    ) {
      return (
        <Modal
          id="cancelAppt"
          status="error"
          visible
          onClose={onClose}
          title="We could not cancel this appointment"
        >
          Something went wrong when we tried to cancel your request.
          <h4>What you can do</h4>
          It may have just been a blip and you can try again.
          <p>
            <button onClick={onConfirm} className="va-button-link">
              Try to cancel again
            </button>
          </p>
          <p>
            But you should probably{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`/find-locations/facility/vha_${getStagingId(
                appointmentToCancel.facility?.facilityCode,
              )}`}
            >
              contact the facility by phone
            </a>
            .
          </p>
        </Modal>
      );
    }

    if (cancelAppointmentStatus === FETCH_STATUS.failed) {
      return (
        <Modal
          id="cancelAppt"
          status="error"
          visible
          onClose={onClose}
          title="We could not cancel this appointment"
        >
          Something went wrong when we tried to cancel your appointment.
          <h4>What you can do</h4>
          It may have just been a blip and you can try again.
          <p>
            <button onClick={onConfirm} className="va-button-link">
              Try to cancel again
            </button>
          </p>
          <p>But you should probably contact the clinic by phone.</p>
          <p>
            {appointmentToCancel.clinicFriendlyName ||
              appointmentToCancel.vdsAppointments[0].clinic.name}
            <br />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`/find-locations/facility/vha_${getStagingId(
                appointmentToCancel.facilityId,
              )}`}
            >
              View facility contact information
            </a>
          </p>
        </Modal>
      );
    }

    return null;
  }
}
