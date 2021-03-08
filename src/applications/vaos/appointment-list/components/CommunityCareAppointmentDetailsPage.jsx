import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import moment from '../../lib/moment-tz';

import { FETCH_STATUS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import * as actions from '../redux/actions';
import AppointmentDateTime from './cards/confirmed/AppointmentDateTime';
import { getVARFacilityId } from '../../services/appointment';
import AppointmentInstructions from './cards/confirmed/AppointmentInstructions';
import AddToCalendar from '../../components/AddToCalendar';
import FacilityAddress from '../../components/FacilityAddress';
import { formatFacilityAddress } from '../../services/location';
import PageLayout from './AppointmentsPage/PageLayout';
import ErrorMessage from '../../components/ErrorMessage';
import { selectConfirmedAppointmentById } from '../redux/selectors';
import FullWidthLayout from '../../components/FullWidthLayout';
import Breadcrumbs from '../../components/Breadcrumbs';

function CommunityCareAppointmentDetailsPage({
  appointment,
  appointmentDetailsStatus,
  fetchConfirmedAppointmentDetails,
}) {
  const { id } = useParams();

  useEffect(() => {
    if (!appointment) {
      fetchConfirmedAppointmentDetails(id, 'cc');
    }

    scrollAndFocus();
  }, []);

  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <ErrorMessage />
      </FullWidthLayout>
    );
  }

  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <LoadingIndicator message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const header = 'Community care';
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );

  // NOTE: A header can be added to a comment by prepending the comment with header text ending with a colon.
  const prefix = 'Special instructions: ';
  const instructions = appointment.comment
    ? prefix.concat(appointment.comment)
    : prefix;
  const practitionerName = appointment.participant?.find(res =>
    res.actor.reference.startsWith('Practitioner'),
  )?.actor.display;

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/cc/${id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={getVARFacilityId(appointment)}
        />
      </h1>

      <h2 className="vads-u-font-size--sm vads-u-font-family--sans">
        <span>
          <strong>{header}</strong>
        </span>
      </h2>

      {(!!practitionerName || !!location.name) && (
        <>
          {practitionerName || location.name}
          <br />
        </>
      )}
      <FacilityAddress
        facility={location}
        showDirectionsLink={!!location.address}
        isHomepageRefresh
      />

      <div className="vads-u-margin-top--3 vaos-appts__block-label">
        <AppointmentInstructions
          instructions={instructions}
          isHomepageRefresh
        />
      </div>

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
        <i
          aria-hidden="true"
          className="far fa-calendar vads-u-margin-right--1"
        />
        <AddToCalendar
          summary={header}
          description={appointment.comment}
          location={formatFacilityAddress(location)}
          duration={appointment.minutesDuration}
          startDateTime={moment.parseZone(appointment.start)}
        />
      </div>

      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <i aria-hidden="true" className="fas fa-print vads-u-margin-right--1" />
        <button className="va-button-link" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <div className="vads-u-margin-top--2 vaos-appts__block-label vads-u-background-color--primary-alt-lightest vads-u-padding--2p5">
        Contact this provider if you need to reschedule or cancel your
        appointment.
      </div>

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
        <Link to="/" className="usa-button vads-u-margin-top--2" role="button">
          « Go back to appointments
        </Link>
      </div>
    </PageLayout>
  );
}

function mapStateToProps(state, ownProps) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;
  return {
    appointment: selectConfirmedAppointmentById(
      state,
      ownProps.match.params.id,
    ),
    appointmentDetailsStatus,
    facilityData,
  };
}

const mapDispatchToProps = {
  fetchConfirmedAppointmentDetails: actions.fetchConfirmedAppointmentDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCareAppointmentDetailsPage);
