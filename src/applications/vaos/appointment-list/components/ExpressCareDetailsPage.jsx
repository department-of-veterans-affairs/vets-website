import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import {
  APPOINTMENT_STATUS,
  UNABLE_TO_REACH_VETERAN_DETCODE,
} from '../../utils/constants';
import { sentenceCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

import { getPatientTelecom } from '../../services/appointment';
import {
  selectExpressCareRequestById,
  getCancelInfo,
} from '../redux/selectors';
import PageLayout from './AppointmentsPage/PageLayout';
import * as actions from '../redux/actions';
import CancelAppointmentModal from './cancel/CancelAppointmentModal';
import Breadcrumbs from '../../components/Breadcrumbs';

function ExpressCareDetailsPage({
  appointment,
  cancelAppointment,
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
}) {
  const appointmentDate = moment.parseZone(appointment?.start);
  const canceled = appointment?.status === APPOINTMENT_STATUS.cancelled;

  useEffect(() => {
    scrollAndFocus();
    document.title = `Express Care request on ${appointmentDate.format(
      'dddd, MMMM D, YYYY',
    )}`;
  }, []);

  if (!appointment) {
    return <Redirect to="/" />;
  }

  const unableToReachVeteran =
    appointment.cancelationReason?.text === UNABLE_TO_REACH_VETERAN_DETCODE;

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/express-care/${appointment.id}`}>Request detail</Link>
      </Breadcrumbs>

      <h1>{appointmentDate.format('dddd, MMMM D, YYYY')}</h1>
      <h2 className="vads-u-font-size--lg">
        {sentenceCase(appointment.reason)}
      </h2>

      {canceled && (
        <AlertBox
          status="error"
          className="vads-u-display--block vads-u-margin-bottom--2"
          backgroundOnly
        >
          <h3 className="vaos-appts__block-label vads-u-margin-bottom--0">
            This screening has been canceled.
          </h3>
          {unableToReachVeteran && (
            <>
              We tried to call you, but couldn’t reach you by phone. If you
              still want to use Express Care, please submit another request
              tomorrow.
            </>
          )}
          {!unableToReachVeteran && (
            <>
              If you still want to use Express Care, please submit another
              request tomorrow.
            </>
          )}
          <p>
            <strong>Note:</strong> If your symptoms get worse, contact a VA
            urgent care clinic near you. If you need medical care right away,
            call 911 or go to the nearest emergency room. Please contact us
            first before going to any VA location. Contacting us first helps
            keep you safe.
          </p>
        </AlertBox>
      )}

      {!canceled && (
        <>
          <h3 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
            Express Care request
          </h3>
          {(appointment.status === APPOINTMENT_STATUS.proposed ||
            appointment.status === APPOINTMENT_STATUS.pending) && (
            <span>
              A VA health care provider will contact you today about your
              request.
            </span>
          )}
          {appointment.status === APPOINTMENT_STATUS.fulfilled && (
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
      </div>

      {appointment.status === APPOINTMENT_STATUS.proposed && (
        <p>
          <button
            className="va-button-link"
            onClick={() => cancelAppointment(appointment)}
          >
            Cancel Express Care request
          </button>
        </p>
      )}
      <Link to="/">
        <button className="usa-button vads-u-margin-top--2">
          « Go back to appointments
        </button>
      </Link>
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </PageLayout>
  );
}
function mapStateToProps(state, ownProps) {
  return {
    appointment: selectExpressCareRequestById(state, ownProps.match.params.id),
    cancelInfo: getCancelInfo(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment: actions.cancelAppointment,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareDetailsPage);
