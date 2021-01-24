import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectPendingAppointments } from '../redux/selectors';
import * as actions from '../redux/actions';

function RequestedAppointmentDetailsPage({
  appointmentDetails,
  fetchRequestDetails,
}) {
  const { id } = useParams();
  useEffect(() => {
    if (!appointmentDetails[id]) {
      fetchRequestDetails(id);
    }
  }, []);

  return (
    <div>
      <h1>Pending details</h1>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    pendingStatus: state.appointments.pendingStatus,
    pendingAppointments: selectPendingAppointments(state),
  };
}

const mapDispatchToProps = {
  fetchRequestDetails: actions.fetchRequestDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentDetailsPage);
