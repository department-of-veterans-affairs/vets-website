import React, { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import * as actions from '../redux/actions';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  FETCH_STATUS,
} from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './cards/pending/ListBestTimeToCall';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import CancelAppointmentModal from './cancel/CancelAppointmentModal';

import {
  getPatientTelecom,
  isVideoAppointment,
  getVAAppointmentLocationId,
  getPractitionerLocationDisplay,
} from '../../services/appointment';
import { selectFirstRequestMessage, getCancelInfo } from '../redux/selectors';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

function RequestedAppointmentDetailsPage({
  appointment,
  appointmentDetailsStatus,
  cancelAppointment,
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  facilityData,
  fetchRequestDetails,
  pendingStatus,
  message,
}) {
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (pendingStatus !== FETCH_STATUS.succeeded) {
      history.push('/requested');
    }

    if (!appointment || appointment.id !== id) {
      fetchRequestDetails(id);
    }

    scrollAndFocus();
  }, []);

  useEffect(
    () => {
      if (
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
  );

  if (appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointment request..." />
      </div>
    );
  }

  if (!appointment || appointment.id !== id) {
    return null;
  }

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isCC = appointment.vaos.isCommunityCare;
  const isVideoRequest = isVideoAppointment(appointment);
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const isCCRequest =
    appointment.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const practitionerName = getPractitionerLocationDisplay(appointment);

  return (
    <div>
      <div className="vads-u-display--block vads-u-padding-y--2p5">
        ‹ <Link to="/requested">Manage appointments</Link>
      </div>

      <h1>
        {canceled ? 'Canceled' : 'Pending'} {typeOfCareText} appointment
      </h1>
      <AlertBox
        status={canceled ? 'error' : 'info'}
        className="vads-u-display--block vads-u-margin-bottom--2"
        backgroundOnly
      >
        {canceled && 'This request has been canceled'}
        {!canceled && (
          <>
            Your appointment request has been submitted. We will review your
            request and contact you to schedule the first available appointment.
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--link-default vads-u-margin-top--2">
              <i
                aria-hidden="true"
                className="fas fa-times vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-right--1"
              />

              <button
                aria-label="Cancel request"
                className="vaos-appts__cancel-btn va-button-link vads-u-flex--0"
                onClick={() => cancelAppointment(appointment)}
              >
                Cancel Request
              </button>
            </div>
          </>
        )}
      </AlertBox>
      <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
        {isCC && !isCCRequest && 'Community Care'}
        {!isCC && !!isVideoRequest && 'VA Video Connect'}
        {!isCC && !isVideoRequest && 'VA Appointment'}
      </h2>

      {!!facility &&
        !isCC && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
            isHomepageRefresh
          />
        )}

      {isCC &&
        isCCRequest &&
        practitionerName && (
          <>
            <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
              Preferred community care provider
            </h2>
            <span>{practitionerName}</span>
          </>
        )}

      <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
        Preferred date and time
      </h2>
      <ul className="usa-unstyled-list">
        {appointment.requestedPeriod.map((option, optionIndex) => (
          <li key={`${appointment.id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {option.start.includes('00:00:00') ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <>
        <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
          {appointment.reason}
        </h2>
        <div>{message}</div>
      </>
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
        Your contact details
      </h2>
      <div>
        {getPatientTelecom(appointment, 'email')}
        <br />
        {getPatientTelecom(appointment, 'phone')}
        <br />
        <span className="vads-u-font-style--italic">
          <ListBestTimeToCall
            timesToCall={appointment.legacyVAR?.bestTimeToCall}
          />
        </span>
      </div>
      <Link to="/requested">
        <button className="usa-button vads-u-margin-top--2">
          « Go back to appointments
        </button>
      </Link>
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </div>
  );
}
function mapStateToProps(state) {
  const {
    currentAppointment,
    appointmentDetailsStatus,
    facilityData,
    pendingStatus,
  } = state.appointments;

  return {
    appointment: currentAppointment,
    appointmentDetailsStatus,
    facilityData,
    message: selectFirstRequestMessage(state),
    pendingStatus,
    cancelInfo: getCancelInfo(state),
  };
}
const mapDispatchToProps = {
  cancelAppointment: actions.cancelAppointment,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
  fetchRequestDetails: actions.fetchRequestDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentDetailsPage);
