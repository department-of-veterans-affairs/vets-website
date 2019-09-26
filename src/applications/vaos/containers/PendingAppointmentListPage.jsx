import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { focusElement } from 'platform/utilities/ui';
import { fetchPendingAppointments } from '../actions/appointments';
import PendingAppointmentListItem from '../components/PendingAppointmentListItem';
import { FETCH_STATUS } from '../utils/constants';
import Breadcrumbs from '../components/Breadcrumbs';

export class PendingAppointmentListPage extends React.Component {
  componentDidMount() {
    this.props.fetchPendingAppointments();
    focusElement('h1');
  }
  render() {
    const { appointments, status } = this.props;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
          <Link to="appointments/pending">Pending appointments</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <Link to="appointments">
              <i className="fas fa-angle-left" /> Back
            </Link>
            <h1 className="vads-u-margin-bottom--4 vads-u-margin-top--1">
              Pending appointments
            </h1>
            {status === FETCH_STATUS.loading && (
              <LoadingIndicator message="Loading pending appointments" />
            )}
            {status === FETCH_STATUS.succeeded && (
              <ul className="usa-unstyled-list">
                {appointments.map(appt => (
                  <PendingAppointmentListItem
                    key={appt.appointmentRequestId}
                    appointment={appt}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appointments: state.appointments.pending,
    status: state.appointments.pendingStatus,
  };
}

const mapDispatchToProps = {
  fetchPendingAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingAppointmentListPage);
