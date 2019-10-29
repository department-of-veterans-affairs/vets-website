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
    const scheduleButton = (
      <Link to="new-appointment">
        <button
          type="button"
          className="usa-button vads-u-margin-x--0 vads-u-margin-bottom--1p5"
          name="newAppointment"
        >
          Schedule an appointment
        </button>
      </Link>
    );

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
          <Link to="appointments/confirmed">Confirmed appointments</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <div>
              <Link to="appointments">
                <i className="fas fa-angle-left" /> Back
              </Link>
              <h1 className="vads-u-margin-bottom--4">
                Confirmed appointments
              </h1>
              {status === FETCH_STATUS.loading && (
                <LoadingIndicator message="Loading confirmed appointments" />
              )}
              {status === FETCH_STATUS.succeeded &&
                appointments.length === 0 && (
                  <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
                    <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
                      You don't have any confirmed appointments at this time.
                    </h2>
                    <p>
                      You can schedule an appointment now, or you can call your{' '}
                      <a
                        href="/find-locations"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        VA Medical center
                      </a>{' '}
                      to schedule an appointment.
                    </p>
                    <p>
                      You may have confirmed appointments.{' '}
                      <Link to="appointments/pending">
                        Go here to manage your pending appointments
                      </Link>
                      .
                    </p>
                    {scheduleButton}
                  </div>
                )}
              {status === FETCH_STATUS.succeeded &&
                appointments.length > 0 && (
                  <div className="vads-l-row vads-u-justify-content--flex-end">
                    <div>{scheduleButton}</div>
                    <div className="vads-l-row vads-u-display--block vads-u-justify-content--flex-start">
                      <ul className="usa-unstyled-list">
                        {appointments.map(appt => (
                          <ConfirmedAppointmentListItem
                            key={getAppointmentId(appt)}
                            appointment={appt}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
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
