import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import AddToCalendar from '../../components/AddToCalendar';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import moment from '../../lib/moment-tz';
import {
  getVAAppointmentLocationId,
  getVARFacilityId,
  isVideoAppointment,
} from '../../services/appointment';
import { FETCH_STATUS, PURPOSE_TEXT } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import * as actions from '../redux/actions';
import { cancelAppointment } from '../redux/actions';
import AppointmentDateTime from './cards/confirmed/AppointmentDateTime';
import AppointmentInstructions from './cards/confirmed/AppointmentInstructions';
import { selectFeatureCancel } from '../../redux/selectors';

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id ? id.replace('var', '') : id;
}

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

function ConfirmedAppointmentDetailsPage({
  appointmentDetails,
  appointmentDetailsStatus,
  facilityData,
  fetchConfirmedAppointmentDetails,
  confirmedStatus,
  showCancelButton,
}) {
  const { id } = useParams();
  const history = useHistory();

  const appointment = appointmentDetails?.[id];

  useEffect(() => {
    const status = confirmedStatus === FETCH_STATUS.succeeded;

    if (!status) {
      history.push('/');
    }

    if (!appointment) {
      fetchConfirmedAppointmentDetails(id);
    }

    scrollAndFocus();
  }, []);

  if (appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointment request...!!!!" />
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];

  const isExpressCare = appointment?.vaos.isExpressCare;
  const isVideo = isVideoAppointment(appointment);
  const isInPersonVAAppointment = !isVideo;

  const header = 'VA Appointment';
  const showInstructions =
    isInPersonVAAppointment &&
    PURPOSE_TEXT.some(purpose =>
      appointment?.comment?.startsWith(purpose.short),
    );

  return (
    <div>
      <div className="vads-u-display--block vads-u-padding-y--2p5">
        ‹ <Link to="/">Manage appointments</Link>
      </div>

      <h1>
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={getVARFacilityId(appointment)}
        />
      </h1>

      {!!facility &&
        !isExpressCare && (
          <>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              {header}
            </h2>

            <VAFacilityLocation
              facility={facility}
              facilityName={facility?.name}
              facilityId={parseFakeFHIRId(facilityId)}
              isHomepageRefresh
              clinicFriendlyName={appointment.participant[0].actor.display}
            />

            {showInstructions &&
              isInPersonVAAppointment && (
                <div className="vads-u-margin-top--3 vaos-appts__block-label">
                  <AppointmentInstructions
                    instructions={appointment.comment}
                    isHomepageRefresh
                  />
                </div>
              )}

            <div className="vads-u-margin-top--3 vaos-appts__block-label">
              <i
                aria-hidden="true"
                className="far fa-calendar vads-u-margin-right--1"
              />
              <AddToCalendar
                summary={`${header}`}
                description={`instructionText`}
                location={location}
                duration={appointment.minutesDuration}
                startDateTime={appointment.start}
              />
            </div>

            <div className="vads-u-margin-top--2 vaos-appts__block-label">
              <i
                aria-hidden="true"
                className="fas fa-print vads-u-margin-right--1"
              />
              <a href="#">Print</a>
            </div>

            <div className="vads-u-margin-top--2 vaos-appts__block-label">
              <i
                aria-hidden="true"
                className="fas fa-clock vads-u-margin-right--1"
              />
              <a href="#">Reschedule</a>
            </div>

            {showCancelButton && (
              <div className="vads-u-margin-top--2 vaos-appts__block-label">
                <i
                  aria-hidden="true"
                  className="fas fa-times vads-u-margin-right--1 vads-u-font-size--lg"
                />
                <button
                  onClick={() => cancelAppointment(appointment)}
                  aria-label={`Cancel appointment on ${formatAppointmentDate(
                    moment.parseZone(appointment.start),
                  )}`}
                  className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
                >
                  Cancel appointment
                  <span className="sr-only">
                    {' '}
                    on{' '}
                    {formatAppointmentDate(moment.parseZone(appointment.start))}
                  </span>
                </button>
              </div>
            )}
          </>
        )}

      <div className="vads-u-margin-top--3 vaos-appts__block-label">
        <Link to="/" className="usa-button vads-u-margin-top--2" role="button">
          « Go back to appointments
        </Link>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const {
    appointmentDetails,
    appointmentDetailsStatus,
    facilityData,
    confirmedStatus,
    requestMessages,
  } = state.appointments;

  return {
    appointmentDetails,
    appointmentDetailsStatus,
    facilityData,
    confirmedStatus,
    requestMessages,
    showCancelButton: selectFeatureCancel(state),
  };
}

const mapDispatchToProps = {
  fetchConfirmedAppointmentDetails: actions.fetchConfirmedAppointmentDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmedAppointmentDetailsPage);
