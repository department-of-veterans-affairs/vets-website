import React from 'react';
import { connect } from 'react-redux';

import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import {
  confirmCancelAppointment,
  cancelAppointmentContinue,
  cancelAppointmentAbort,
} from '../actions/appointments';
import { FETCH_STATUS } from '../utils/constants';
import { getStagingId } from '../utils/appointment';

export class CancelAppointment extends React.Component {
  closeModal = () => {
    if (this.props.cancelAppointmentStatus !== FETCH_STATUS.succeeded) {
      this.props.cancelAppointmentAbort();
    }

    this.props.cancelAppointmentContinue();
  };

  render() {
    const {
      showCancelModal,
      appointmentToCancel,
      cancelAppointmentStatus,
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
          onClose={this.closeModal}
          title="Do you want to cancel your appointment?"
        >
          If you want to reschedule, you will have to cancel this one and create
          a new appointment.
          <p className="vads-u-margin-top--2">
            <LoadingButton
              isLoading={cancelAppointmentStatus === FETCH_STATUS.loading}
              onClick={this.props.confirmCancelAppointment}
            >
              Yes, cancel
            </LoadingButton>
            <button
              onClick={this.props.cancelAppointmentAbort}
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
          onClose={this.closeModal}
          title="You have canceled your appointment"
        >
          Your provider has been notified of your cancellation
          <p className="vads-u-margin-top--2">
            <button onClick={this.props.cancelAppointmentContinue}>
              Continue
            </button>
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
          onClose={this.closeModal}
          title="We could not cancel this appointment"
        >
          Something went wrong when we tried to cancel your appointment.
          <h4>What you can do</h4>
          It may have just been a blip and you can try again.
          <p>
            <button
              onClick={this.props.confirmCancelAppointment}
              className="va-button-link"
            >
              Try to cancel again
            </button>
          </p>
          <p>But you should probably contact the clinic by phone.</p>
          <p>
            {appointmentToCancel.clinicFriendlyName ||
              appointmentToCancel.vdsAppointments[0].clinic.name}
            <br />
            <a
              targe="_blank"
              rel="noopener nofollow"
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

function mapStateToProps(state) {
  const {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
  } = state.appointments;

  return {
    appointmentToCancel,
    showCancelModal,
    cancelAppointmentStatus,
  };
}

const mapDispatchToProps = {
  confirmCancelAppointment,
  cancelAppointmentContinue,
  cancelAppointmentAbort,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CancelAppointment);
