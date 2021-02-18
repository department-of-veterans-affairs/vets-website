import React, { useEffect } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import * as actions from '../redux/actions';
import { APPOINTMENT_STATUS, FETCH_STATUS } from '../../utils/constants';
import { sentenceCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './cards/pending/ListBestTimeToCall';

import { getPatientTelecom } from '../../services/appointment';

function ExpressCareDetailsPage({
  appointment,
  appointmentDetailsStatus,
  fetchExpressCareDetails,
}) {
  const { id } = useParams();

  useEffect(() => {
    if (!appointment || appointment.id !== id) {
      fetchExpressCareDetails(id);
    }
  }, []);

  useEffect(
    () => {
      if (appointmentDetailsStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus();
      }
    },
    [appointmentDetailsStatus],
  );

  if (
    appointmentDetailsStatus === FETCH_STATUS.notStarted ||
    appointmentDetailsStatus === FETCH_STATUS.loading
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator
          setFocus
          message="Loading your Express Care request..."
        />
      </div>
    );
  }

  if (!appointment) {
    return <Redirect to="/" />;
  }

  const appointmentDate = moment.parseZone(appointment.start);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  return (
    <div>
      <div className="vads-u-display--block vads-u-padding-y--2p5">
        ‹ <Link to="/">Manage appointments</Link>
      </div>

      <h1>{appointmentDate.format('dddd, MMMM D, YYYY')}</h1>
      <h2 className="vads-u-font-size--lg">
        {sentenceCase(appointment.reason)}
      </h2>

      {canceled && (
        <AlertBox
          status="error"
          className="vads-u-display--block vads-u-margin-bottom--2"
          backgroundOnly
          headline="This screening has been canceled"
        />
      )}

      {!canceled && (
        <>
          <h3 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
            Express Care request
          </h3>
          {appointment.status === APPOINTMENT_STATUS.proposed && (
            <span>
              A VA health care provider will contact you today about your
              request.
            </span>
          )}
          {appointment.status === APPOINTMENT_STATUS.pending && (
            <span>A VA health care provider will contact you today.</span>
          )}
          {appointment.status === APPOINTMENT_STATUS.booked && (
            <span>
              We’ve completed your screening. Thank you for using Express Care.
            </span>
          )}
        </>
      )}

      {!!appointment.comment && (
        <>
          <h3 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
            You shared these details about your concern
          </h3>

          {appointment.comment}
        </>
      )}

      <h3 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
        Your contact details
      </h3>
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
      <Link to="/">
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
    pendingStatus,
  } = state.appointments;
  return {
    appointment: currentAppointment,
    appointmentDetailsStatus,
    pendingStatus,
  };
}
const mapDispatchToProps = {
  fetchExpressCareDetails: actions.fetchExpressCareDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareDetailsPage);
