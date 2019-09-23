import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { focusElement } from 'platform/utilities/ui';
import { fetchConfirmedAppointments } from '../actions/appointments';
import ConfirmedAppointmentListItem from '../components/ConfirmedAppointmentListItem';
import { FETCH_STATUS } from '../utils/constants';
import Breadcrumbs from '../components/Breadcrumbs';
import { getAppointmentId } from '../utils/appointment';

export class ConfirmedAppointmentListPage extends React.Component {
  componentDidMount() {
    this.props.fetchConfirmedAppointments();
    focusElement('h1');
  }
  render() {
    const { appointments, status } = this.props;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
          <Link to="appointments/confirmed">Confirmed appointments</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <div>
              <h1 className="vads-u-margin-bottom--4">
                Confirmed appointments
              </h1>
              {status === FETCH_STATUS.loading && (
                <LoadingIndicator message="Loading confirmed appointments" />
              )}
              {status === FETCH_STATUS.succeeded && (
                <ul className="usa-unstyled-list">
                  {appointments.map(appt => (
                    <ConfirmedAppointmentListItem
                      key={getAppointmentId(appt)}
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
    appointments: state.appointments.confirmed,
    status: state.appointments.confirmedStatus,
  };
}

const mapDispatchToProps = {
  fetchConfirmedAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmedAppointmentListPage);
