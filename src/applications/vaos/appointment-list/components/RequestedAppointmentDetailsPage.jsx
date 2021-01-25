import React, { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import moment from 'moment';

import * as actions from '../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './cards/pending/ListBestTimeToCall';
import VAFacilityLocation from '../../components/VAFacilityLocation';

import {
  getPatientTelecom,
  isVideoAppointment,
  getVAAppointmentLocationId,
} from '../../services/appointment';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id ? id.replace('var', '') : id;
}

function RequestedAppointmentDetailsPage({
  appointmentDetails,
  appointmentDetailsStatus,
  facilityData,
  fetchRequestDetails,
  pendingStatus,
  requestMessages,
}) {
  const { id } = useParams();
  const history = useHistory();
  const appointment = appointmentDetails?.[id];

  useEffect(() => {
    const fetchedPending = pendingStatus === FETCH_STATUS.succeeded;

    if (!fetchedPending) {
      history.push('/requested');
    }

    if (!appointment) {
      fetchRequestDetails(id);
    }

    scrollAndFocus();
  }, []);

  if (
    appointmentDetailsStatus === FETCH_STATUS.notStarted ||
    appointmentDetailsStatus === FETCH_STATUS.loading
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointment request..." />
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  const isCC = appointment.vaos.isCommunityCare;
  const isExpressCare = appointment.vaos.isExpressCare;
  const isVideoRequest = isVideoAppointment(appointment);
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const firstMessage =
    requestMessages?.[parseFakeFHIRId(appointment.id)]?.[0]?.attributes
      ?.messageText;

  return (
    <div>
      <div className="vads-u-display--block vads-u-padding-y--2p5">
        ‹ <Link to="/requested">Manage appointments</Link>
      </div>

      <h1>Pending {typeOfCareText} appointment</h1>
      <div className="vvads-u-font-size--sm vads-u-font-weight--bold vads-u-font-family--sans">
        {isCC && 'Community Care'}
        {!isCC && !!isVideoRequest && 'VA Video Connect'}
        {!isCC && !isVideoRequest && 'VA Appointment'}
      </div>

      {isExpressCare && facility?.name}
      {!!facility &&
        !isCC &&
        !isExpressCare && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={parseFakeFHIRId(facilityId)}
            isV2
          />
        )}

      {!isExpressCare && (
        <>
          <h4 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred date and time
          </h4>
          <ul className="usa-unstyled-list">
            {appointment.requestedPeriod.map((option, optionIndex) => (
              <li key={`${appointment.id}-option-${optionIndex}`}>
                {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
                {option.start.includes('00:00:00')
                  ? TIME_TEXT.AM
                  : TIME_TEXT.PM}
              </li>
            ))}
          </ul>
        </>
      )}
      {isExpressCare && (
        <>
          <h4 className="vads-u-margin-top--2 vaos-appts__block-label">
            Reason for appointment
          </h4>
          <div>{appointment.reason}</div>
        </>
      )}

      {!isExpressCare && (
        <>
          <h4 className="vads-u-margin-top--2 vaos-appts__block-label">
            {appointment.reason}
          </h4>
          <div>{firstMessage}</div>
        </>
      )}

      <h4 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
        Your contact details
      </h4>
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
    </div>
  );
}

function mapStateToProps(state) {
  const {
    appointmentDetails,
    appointmentDetailsStatus,
    facilityData,
    pendingStatus,
    requestMessages,
  } = state.appointments;

  return {
    appointmentDetails,
    appointmentDetailsStatus,
    facilityData,
    requestMessages,
    pendingStatus,
  };
}

const mapDispatchToProps = {
  fetchRequestDetails: actions.fetchRequestDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentDetailsPage);
