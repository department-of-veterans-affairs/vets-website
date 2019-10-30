import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { focusElement } from 'platform/utilities/ui';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmedAppointmentListItem from '../components/ConfirmedAppointmentListItem';
import AppointmentRequestListItem from '../components/AppointmentRequestListItem';
import { fetchFutureAppointments } from '../actions/appointments';
import { getAppointmentType } from '../utils/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';

export class AppointmentListsPage extends Component {
  componentDidMount() {
    focusElement('.vads-l-col--12 > h1');
    this.props.fetchFutureAppointments();
  }

  render() {
    const { future, futureStatus } = this.props.appointments;

    let content;

    if (futureStatus === FETCH_STATUS.loading) {
      content = (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator setFocus message="Loading your appointments..." />
        </div>
      );
    } else {
      content = future?.map((appt, index) => {
        const type = getAppointmentType(appt);
        if (type === APPOINTMENT_TYPES.request) {
          return <AppointmentRequestListItem appointment={appt} />;
        }

        return (
          <ConfirmedAppointmentListItem
            key={index}
            appointment={appt}
            type={type}
          />
        );
      });
    }

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs>
          <Link to="appointments">Your appointments</Link>
        </Breadcrumbs>
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <h1>VA Appointments</h1>
            <ul className="usa-unstyled-list">{content}</ul>
          </div>
        </div>
      </div>
    );
  }
}

AppointmentListsPage.propTypes = {
  fetchFutureAppointments: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    appointments: state.appointments,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchFutureAppointments,
  },
)(AppointmentListsPage);
