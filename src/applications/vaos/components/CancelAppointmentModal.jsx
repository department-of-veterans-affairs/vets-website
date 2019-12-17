import React from 'react';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import { getAppointmentType, isVideoVisit } from '../utils/appointment';
import {
  formatPhoneNumber,
  formatPhoneNumberForHref,
} from '../utils/formatters';

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

    const isVideo = isVideoVisit(appointmentToCancel);
    const isCC =
      getAppointmentType(appointmentToCancel) ===
      APPOINTMENT_TYPES.ccAppointment;

    if (isVideo || isCC) {
      const facilityName = isVideo
        ? facility?.name
        : appointmentToCancel.providerPractice;

      const phone = isVideo
        ? facility?.phone?.main
        : appointmentToCancel.providerPhone;

      return (
        <Modal
          id="cancelAppt"
          status="warning"
          visible
          onClose={onClose}
          title="You have to call your provider to cancel this appointment"
        >
          <p>
            {isVideo ? 'VA Video Connect' : 'Community Care'} appointments can’t
            be canceled online. Please call the below VA facility to cancel your
            appointment.
          </p>
          {phone && (
            <p>
              {facilityName}
              <br />
              <a href={`tel:${formatPhoneNumberForHref(phone)}`}>
                {formatPhoneNumber(phone)}
              </a>
            </p>
          )}

          <div className="vads-u-margin-top--2">
            <button className="usa-button" onClick={onClose}>
              OK
            </button>
          </div>
        </Modal>
      );
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
                  <a href={`tel:${facility.phone.main.replace(/\D/g, '')}`}>
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
