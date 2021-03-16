import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import moment from '../../lib/moment-tz';

import { APPOINTMENT_TYPES, FETCH_STATUS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import * as actions from '../redux/actions';
import AppointmentDateTime from './cards/confirmed/AppointmentDateTime';
import { getVARFacilityId } from '../../services/appointment';
import AddToCalendar from '../../components/AddToCalendar';
import FacilityAddress from '../../components/FacilityAddress';
import { formatFacilityAddress } from '../../services/location';
import PageLayout from './AppointmentsPage/PageLayout';
import ErrorMessage from '../../components/ErrorMessage';
import { selectAppointmentById } from '../redux/selectors';
import FullWidthLayout from '../../components/FullWidthLayout';
import Breadcrumbs from '../../components/Breadcrumbs';

function CommunityCareAppointmentDetailsPage({
  appointment,
  appointmentDetailsStatus,
  fetchConfirmedAppointmentDetails,
}) {
  const { id } = useParams();
  const appointmentDate = moment.parseZone(appointment?.start);

  useEffect(() => {
    fetchConfirmedAppointmentDetails(id, 'cc');
  }, []);

  useEffect(
    () => {
      if (appointment && appointmentDate) {
        document.title = `Community care appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}`;
        scrollAndFocus();
      }
    },
    [appointment, appointmentDate],
  );

  useEffect(
    () => {
      if (
        appointmentDetailsStatus === FETCH_STATUS.failed ||
        (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
      ) {
        scrollAndFocus();
      }
    },
    [appointmentDetailsStatus],
  );

  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <ErrorMessage level={1} />
      </FullWidthLayout>
    );
  }

  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <LoadingIndicator setFocus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const header = 'Community care';
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );
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
        {!!appointment.comment && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              Special instructions
            </h2>
            <div>{appointment.comment}</div>
          </div>
        )}
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
    appointment: selectAppointmentById(state, ownProps.match.params.id, [
      APPOINTMENT_TYPES.ccAppointment,
    ]),
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
