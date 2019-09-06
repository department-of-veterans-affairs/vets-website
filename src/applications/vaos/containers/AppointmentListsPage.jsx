import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import get from 'platform/utilities/data/get';
import {
  fetchConfirmedAppointments,
  fetchPendingAppointments,
} from '../actions/appointments';

class AppointmentListsPage extends Component {
  componentDidMount() {
    this.props.fetchConfirmedAppointments();
    this.props.fetchPendingAppointments();
  }

  render() {
    const {
      confirmed,
      confirmedLoading,
      pending,
      pendingLoading,
    } = this.props.appointments;

    const loading = confirmedLoading || pendingLoading;

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
            <div>
              <h1>Your Appointments</h1>
              {loading ? (
                <div className="vads-u-margin-y--8">
                  <LoadingIndicator
                    setFocus
                    message="Loading your appointments..."
                  />
                </div>
              ) : (
                <ul className="usa-unstyled-list">
                  <li className="vads-u-border-top--1px vads-u-border-color--gray-lighter">
                    <Link
                      to="appointments/confirmed"
                      className="vads-u-text-decoration--none vads-u-color--base vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center"
                    >
                      <div className="vads-u-flex--auto vads-u-margin-right--2 vads-u-display--none medium-screen:vads-u-display--block">
                        <i className="vaos-option-list__icon fas fa-calendar-check vads-u-background-color--green-lightest vads-u-color--base" />
                      </div>
                      <div className="vads-u-flex--1">
                        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-font-size--lg">
                          Confirmed appointments
                        </h2>
                        {!loading && (
                          <div>
                            You have{' '}
                            <span className="vaos-appt-list__badge vads-u-background-color--green-lightest">
                              {get('length', confirmed, 0)}
                            </span>{' '}
                            confirmed appointments
                          </div>
                        )}
                      </div>
                      <div className="vads-u-flex--auto vads-u-margin-left--2">
                        <i className="vads-u-color--primary vads-u-font-size--xl fas fa-angle-right" />
                      </div>
                    </Link>
                  </li>
                  <li className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
                    <Link
                      to="appointments/pending"
                      className="vads-u-text-decoration--none vads-u-color--base vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center"
                    >
                      <div className="vads-u-flex--auto vads-u-margin-right--2 vads-u-display--none medium-screen:vads-u-display--block">
                        <i className="vaos-option-list__icon fas fa-list-alt vads-u-background-color--gibill-accent vads-u-color--base" />
                      </div>
                      <div className="vads-u-flex--1">
                        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-font-size--lg">
                          Pending appointments
                        </h2>
                        {!loading && (
                          <div>
                            You have{' '}
                            <span className="vaos-appt-list__badge vads-u-background-color--gibill-accent">
                              {get('length', pending, 0)}
                            </span>{' '}
                            pending appointments
                          </div>
                        )}{' '}
                      </div>
                      <div className="vads-u-flex--auto vads-u-margin-left--2">
                        <i className="vads-u-color--primary vads-u-font-size--xl fas fa-angle-right" />
                      </div>
                    </Link>
                  </li>
                  <li className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
                    <Link
                      to="appointments/history"
                      className="vads-u-text-decoration--none vads-u-color--base vads-u-padding-y--3 vads-u-display--flex vads-u-align-items--center"
                    >
                      <div className="vads-u-flex--auto vads-u-margin-right--2 vads-u-display--none medium-screen:vads-u-display--block">
                        <i className="vaos-option-list__icon fas fa-history vads-u-background-color--cool-blue-lightest vads-u-color--base" />
                      </div>
                      <div className="vads-u-flex--1">
                        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--0p5 vads-u-font-size--lg">
                          Appointment history
                        </h2>
                        View previous appointments
                      </div>
                      <div className="vads-u-flex--auto vads-u-margin-left--2">
                        <i className="vads-u-color--primary vads-u-font-size--xl fas fa-angle-right" />
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AppointmentListsPage.propTypes = {
  fetchConfirmedAppointments: PropTypes.func.isRequired,
  fetchPendingAppointments: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    appointments: state.appointments,
  };
}

export default connect(
  mapStateToProps,
  {
    fetchConfirmedAppointments,
    fetchPendingAppointments,
  },
)(AppointmentListsPage);
