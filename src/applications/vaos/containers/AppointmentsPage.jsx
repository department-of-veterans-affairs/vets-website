import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { focusElement } from 'platform/utilities/ui';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmedAppointmentListItem from '../components/ConfirmedAppointmentListItem';
import AppointmentRequestListItem from '../components/AppointmentRequestListItem';
import {
  fetchFutureAppointments,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
} from '../actions/appointments';
import { getAppointmentType } from '../utils/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import { getCancelInfo } from '../utils/selectors';

export class AppointmentsPage extends Component {
  componentDidMount() {
    focusElement('.vads-l-col--12 > h1');
    this.props.fetchFutureAppointments();
  }

  render() {
    const { appointments, cancelInfo } = this.props;
    const { future, futureStatus } = appointments;

    let content;

    const loading = futureStatus === FETCH_STATUS.loading;
    const hasAppointments = FETCH_STATUS.succeeded && future?.length > 0;

    if (loading) {
      content = (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator setFocus message="Loading your appointments..." />
        </div>
      );
    } else if (hasAppointments) {
      content = future.map((appt, index) => {
        const type = getAppointmentType(appt);

        switch (type) {
          case APPOINTMENT_TYPES.request:
            return (
              <AppointmentRequestListItem
                key={index}
                appointment={appt}
                cancelAppointment={this.props.cancelAppointment}
              />
            );
          case APPOINTMENT_TYPES.ccAppointment:
          case APPOINTMENT_TYPES.vaAppointment:
            return (
              <ConfirmedAppointmentListItem
                key={index}
                appointment={appt}
                type={type}
                cancelAppointment={this.props.cancelAppointment}
              />
            );
          default:
            return null;
        }
      });
    } else {
      content = (
        <li className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
            You don’t have any appointments.
          </h2>
          <p>
            You can schedule an appointment now, or you can call your{' '}
            <a href="/find-locations" target="_blank" rel="noopener noreferrer">
              VA Medical center
            </a>{' '}
            to schedule an appointment.
          </p>
          <Link to="new-appointment">
            <button
              type="button"
              className="usa-button vads-u-margin-x--0 vads-u-margin-bottom--1p5"
              name="newAppointment"
            >
              Schedule an appointment
            </button>
          </Link>
        </li>
      );
    }

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
            <div className="vaos-appts__top">
              <h1 className="vads-u-flex--1">VA Appointments</h1>
              <Link to="/new-appointment">
                <button className="usa-button vads-u-margin--0">
                  <i className="fas fa-plus vads-u-display--inline-block vads-u-margin-right--1 vads-u-font-size--sm" />
                  New appointment
                </button>
              </Link>
            </div>
            <ul className="usa-unstyled-list">{content}</ul>
          </div>
        </div>
        <CancelAppointmentModal
          {...cancelInfo}
          onConfirm={this.props.confirmCancelAppointment}
          onClose={this.props.closeCancelAppointment}
        />
      </div>
    );
  }
}

AppointmentsPage.propTypes = {
  fetchFutureAppointments: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    appointments: state.appointments,
    cancelInfo: getCancelInfo(state),
  };
}

const mapDispatchToProps = {
  fetchFutureAppointments,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
