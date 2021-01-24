import React, { useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import * as actions from '../redux/actions';
import { FETCH_STATUS } from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

function RequestedAppointmentDetailsPage({
  appointmentDetails,
  appointmentDetailsStatus,
  fetchRequestDetails,
  pendingStatus,
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

  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);

  return (
    <div>
      <div className="vads-u-display--block vads-u-padding-y--2p5">
        ‹ <Link to="/requested">Manage appointments</Link>
      </div>

      <h1>Pending {typeOfCareText} appointment</h1>
      <Link to="/requested">
        <button className="usa-button">« Go back to appointments</button>
      </Link>
    </div>
  );
}

function mapStateToProps(state) {
  const {
    appointmentDetails,
    appointmentDetailsStatus,
    pendingStatus,
  } = state.appointments;

  return {
    appointmentDetails,
    appointmentDetailsStatus,
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
