import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { startCase } from 'lodash';

import { fetchAppointments } from '../../appointments/actions';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';

const IS_PRODUCTION = document.location.hostname === 'www.vets.gov';
const IS_STAGING = document.location.hostname === 'staging.vets.gov';

class AppointmentsWidget extends React.Component {
  componentDidMount() {
    if (!IS_PRODUCTION && !IS_STAGING) {
      if (!this.props.loading) {
        this.props.fetchAppointments();
      }
    }
  }

  render() {
    // do not show in production or in staging
    if (IS_PRODUCTION || IS_STAGING) {
      return null;
    }

    if (this.props.loading) {
      return <LoadingIndicator message="Loading your appointments..." />;
    }

    return (
      <div className="appointments-container">
        <h3>Appointments</h3>
        {this.props.appointments.data.map((a, ix) => (
          <div key={`${a.localId}-${ix}`} className="appointment-item">
            <h4>Upcoming Appointment</h4>
            <div className="appointment-info">
              <h4>{moment(a.startTime).format('MMMM D, YYYY [at] k:mma')}</h4>
              <p>{startCase(a.facilityName)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appointments: state.appointments,
});

const mapDispatchToProps = {
  fetchAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsWidget);
export { AppointmentsWidget };
