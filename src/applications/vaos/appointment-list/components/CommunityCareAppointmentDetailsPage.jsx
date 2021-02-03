import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import moment from '../../lib/moment-tz';

import { FETCH_STATUS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import * as actions from '../redux/actions';
import AppointmentDateTime from './cards/confirmed/AppointmentDateTime';
import { getVARFacilityId } from '../../services/appointment';
import AppointmentInstructions from './cards/confirmed/AppointmentInstructions';
import AddToCalendar from '../../components/AddToCalendar';
import { selectFeatureCancel } from '../../redux/selectors';
import FacilityAddress from '../../components/FacilityAddress';

function CommunityCareAppointmentDetailsPage({
  appointmentDetails,
  appointmentDetailsStatus,
  fetchConfirmedAppointmentDetails,
  confirmedStatus,
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

  const header = 'Community Care';
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );

  // NOTE: A header can be added to a comment by prepending a header ending with a colon.
  const prefix = 'Special Instructions: ';
  const instructions = appointment.comment
    ? prefix.concat(appointment.comment)
    : prefix;
  const practitionerName = appointment.participant?.find(res =>
    res.actor.reference.startsWith('Practitioner'),
  )?.actor.display;

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

      <div className="vads-u-font-size--sm vads-u-font-family--sans">
        <span>
          <strong>{header}</strong>
        </span>
      </div>

      {!!practitionerName ||
        (location.name && (
          <>
            {practitionerName || location.name}
            <br />
          </>
        ))}
      <FacilityAddress
        facility={location}
        showDirectionsLink={!!location.address}
        isHomepageRefresh
        isCommunityCare
      />

      <div className="vads-u-margin-top--3 vaos-appts__block-label">
        <AppointmentInstructions
          instructions={instructions}
          isHomepageRefresh
        />
      </div>

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
          startDateTime={moment.parseZone(appointment.start)}
        />
      </div>

      <div className="vads-u-margin-top--2 vaos-appts__block-label">
        <i aria-hidden="true" className="fas fa-print vads-u-margin-right--1" />
        <a href="#">Print</a>
      </div>

      <div className="vads-u-margin-top--2 vaos-appts__block-label vads-u-background-color--primary-alt-lightest vads-u-padding--2p5">
        Contact this provider if you need to reschedule or cancel your
        appointment.
      </div>

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
)(CommunityCareAppointmentDetailsPage);
