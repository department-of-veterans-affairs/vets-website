import React from 'react';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import FacilityAddress from './FacilityAddress';
import { FETCH_STATUS } from '../utils/constants';

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

    if (cancelAppointmentStatus === FETCH_STATUS.succeeded) {
      return (
        <Modal
          id="cancelAppt"
          status="success"
          visible
          onClose={onClose}
          title="Your appointment has been canceled"
        >
          We’ve let your provider know you canceled this appointment.
          <p className="vads-u-margin-top--2">
            <button onClick={this.props.onClose}>Continue</button>
          </p>
        </Modal>
      );
    }

    if (cancelAppointmentStatus === FETCH_STATUS.failed) {
      const clinicName =
        appointmentToCancel.clinicFriendlyName ||
        appointmentToCancel.vdsAppointments?.[0]?.clinic.name;

      return (
        <Modal
          id="cancelAppt"
          status="error"
          visible
          onClose={onClose}
          title="We couldn’t cancel your appointment"
        >
          <p>
            Something went wrong when we tried to cancel this appointment.
            Please contact your medical center to cancel:
          </p>
          <p>
            {clinicName ? (
              <>
                {clinicName}
                <br />
              </>
            ) : null}
            {facility ? (
              <>
                <strong>{facility.name}</strong>
                <br />
              </>
            ) : null}
            {!!facility && <FacilityAddress facility={facility} />}
            {!facility && (
              <>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="/find-locations"
                >
                  Find facility contact information
                </a>
              </>
            )}
          </p>
        </Modal>
      );
    }

    return null;
  }
}
