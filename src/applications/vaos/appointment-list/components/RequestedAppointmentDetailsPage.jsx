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
import { selectFirstRequestMessage } from '../redux/selectors';

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
  appointment,
  appointmentDetailsStatus,
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

  if (appointmentDetailsStatus === FETCH_STATUS.loading) {
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

  return (
    <div>
      <div className="vads-u-display--block vads-u-padding-y--2p5">
        ‹ <Link to="/requested">Manage appointments</Link>
      </div>

      <h1>Pending {typeOfCareText} appointment</h1>
      <span className="vads-u-display--block vads-u-font-weight--bold">
        {isCC && 'Community Care'}
        {!isCC && !!isVideoRequest && 'VA Video Connect'}
        {!isCC && !isVideoRequest && 'VA Appointment'}
        {isExpressCare && 'Express Care'}
        {isExpressCare && facility?.name}
      </span>

      {!!facility &&
        !isCC &&
        !isExpressCare && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={parseFakeFHIRId(facilityId)}
            isHomepageRefresh
          />
        )}

      {!isExpressCare && (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred date and time
          </h2>
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
          <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
            Reason for appointment
          </h2>
          <div>{appointment.reason}</div>
        </>
      )}
      {!isExpressCare && (
        <>
          <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
            {appointment.reason}
          </h2>
          <div>{message}</div>
        </>
      )}
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
  };
}
const mapDispatchToProps = {
  fetchRequestDetails: actions.fetchRequestDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentDetailsPage);
