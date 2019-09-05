import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { focusElement } from 'platform/utilities/ui';
import { fetchPendingAppointments } from '../actions/appointments';
import PendingAppointment from '../components/PendingAppointment';

export class PendingAppointmentsPage extends React.Component {
  componentDidMount() {
    this.props.fetchPendingAppointments();
    focusElement('h1');
  }
  render() {
    const { appointments, loading } = this.props;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <div>
              <h1 className="vads-u-margin-bottom--4">Pending appointments</h1>
              {loading && (
                <LoadingIndicator message="Loading pending appointments" />
              )}
              {!loading && (
                <ul className="usa-unstyled-list">
                  {appointments.map(appt => (
                    <PendingAppointment
                      key={appt.appointmentRequestId}
                      appointment={appt}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appointments: state.appointments.pending,
    loading: state.appointments.pendingLoading,
  };
}

const mapDispatchToProps = {
  fetchPendingAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingAppointmentsPage);
