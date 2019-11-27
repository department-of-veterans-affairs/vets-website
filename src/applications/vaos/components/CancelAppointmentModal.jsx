import React from 'react';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import { getAppointmentType } from '../utils/appointment';

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
          If you want to reschedule this appointment, you'll need to first
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

    if (cancelAppointmentStatus === FETCH_STATUS.succeeded) {
      return (
        <Modal
          id="cancelAppt"
          status="success"
          visible
          onClose={onClose}
          title="Your appointment has been canceled"
        >
          We've let your provider know you canceled this appointment.
          <p className="vads-u-margin-top--2">
            <button onClick={this.props.onClose}>Continue</button>
          </p>
        </Modal>
      );
    }

    if (cancelAppointmentStatus === FETCH_STATUS.failed) {
      const appointmentType = getAppointmentType(appointmentToCancel);
      return (
        <Modal
          id="cancelAppt"
          status="error"
          visible
          onClose={onClose}
          title="We couldn’t cancel your appointment"
        >
          We’re sorry. Something went wrong when we tried to cancel this
          appointment.
          <h4>You can:</h4>
          <ul>
            <li>
              Try to{' '}
              <button onClick={onConfirm} className="va-button-link">
                cancel this appointment again
              </button>
              , <strong>or</strong>
            </li>
            {(appointmentType === APPOINTMENT_TYPES.request ||
              appointmentType === APPOINTMENT_TYPES.ccRequest) && (
              <li>
                Call the medical center to cancel
                <br />
                {appointmentToCancel.facility.name}
                <br />
                {!!facility?.phone?.main && (
                  <a href={`tel:${facility.phone.main.replace(/-/g, '')}`}>
                    {facility.phone.main}
                  </a>
                )}
              </li>
            )}
            {appointmentType === APPOINTMENT_TYPES.vaAppointment && (
              <li>
                Call the medical center to cancel
                <br />
                {appointmentToCancel.clinicFriendlyName ||
                  appointmentToCancel.vdsAppointments[0].clinic.name}
                <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/find-locations"
                >
                  Find facility contact information
                </a>
              </li>
            )}
          </ul>
        </Modal>
      );
    }

    return null;
  }
}
