import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import Breadcrumbs from '../components/Breadcrumbs';
import ConfirmedAppointmentListItem from '../components/ConfirmedAppointmentListItem';
import AppointmentRequestListItem from '../components/AppointmentRequestListItem';
import {
  fetchFutureAppointments,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
  fetchRequestMessages,
} from '../actions/appointments';
import { getAppointmentType, getRealFacilityId } from '../utils/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES, GA_PREFIX } from '../utils/constants';
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import { getCancelInfo, vaosCancel, vaosRequests } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';

const pageTitle = 'VA appointments';

export class AppointmentsPage extends Component {
  componentDidMount() {
    scrollAndFocus();
    this.props.fetchFutureAppointments();
    document.title = `${pageTitle} | Veterans Affairs`;
  }

  recordStartEvent() {
    recordEvent({
      event: `${GA_PREFIX}-schedule-new-appointment-started`,
    });
  }

  render() {
    const {
      appointments,
      cancelInfo,
      showCancelButton,
      showScheduleButton,
    } = this.props;
    const {
      future,
      futureStatus,
      facilityData,
      requestMessages,
      systemClinicToFacilityMap,
    } = appointments;

    let content;

    const loading = futureStatus === FETCH_STATUS.loading;
    const hasAppointments =
      futureStatus === FETCH_STATUS.succeeded && future?.length > 0;

    if (loading) {
      content = (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator setFocus message="Loading your appointments..." />
        </div>
      );
    } else if (hasAppointments) {
      content = (
        <ul className="usa-unstyled-list" id="appointments-list">
          {future.map((appt, index) => {
            const type = getAppointmentType(appt);

            switch (type) {
              case APPOINTMENT_TYPES.ccRequest:
              case APPOINTMENT_TYPES.request:
                return (
                  <AppointmentRequestListItem
                    key={index}
                    index={index}
                    appointment={appt}
                    type={type}
                    facility={
                      facilityData[
                        getRealFacilityId(appt.facility?.facilityCode)
                      ]
                    }
                    showCancelButton={showCancelButton}
                    cancelAppointment={this.props.cancelAppointment}
                    fetchMessages={this.props.fetchRequestMessages}
                    messages={requestMessages}
                  />
                );
              case APPOINTMENT_TYPES.ccAppointment:
              case APPOINTMENT_TYPES.vaAppointment:
                return (
                  <ConfirmedAppointmentListItem
                    key={index}
                    index={index}
                    appointment={appt}
                    type={type}
                    facility={
                      systemClinicToFacilityMap[
                        `${appt.facilityId}_${appt.clinicId}`
                      ]
                    }
                    showCancelButton={showCancelButton}
                    cancelAppointment={this.props.cancelAppointment}
                  />
                );
              default:
                return null;
            }
          })}
        </ul>
      );
    } else if (futureStatus === FETCH_STATUS.failed) {
      content = (
        <AlertBox
          status="error"
          headline="We're sorry. We've run into a problem"
        >
          We're having trouble getting your upcoming appointments. Please try
          again later.
        </AlertBox>
      );
    } else {
      content = (
        <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
            You don’t have any appointments.
          </h2>
          {showScheduleButton && (
            <>
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
              <Link to="new-appointment">
                <button
                  type="button"
                  className="usa-button vads-u-margin-x--0 vads-u-margin-bottom--1p5"
                  name="newAppointment"
                >
                  Schedule an appointment
                </button>
              </Link>
            </>
          )}
          {!showScheduleButton && (
            <>
              <p>
                To schedule an appointment, you can call your{' '}
                <a
                  href="/find-locations"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VA Medical center
                </a>
                .
              </p>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
            <h1 className="vads-u-flex--1">{pageTitle}</h1>
            {showScheduleButton && (
              <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
                <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
                  Create a new appointment
                </h2>
                <p className="vads-u-margin-top--1">
                  Schedule an appointment at a VA medical center, clinic, or
                  Community Care facility.
                </p>
                <Link to="/new-appointment" onClick={this.recordStartEvent}>
                  <button
                    id="new-appointment"
                    className="usa-button vads-u-margin--0 vads-u-font-weight--bold vads-u-font-size--md"
                  >
                    Schedule an appointment
                  </button>
                </Link>
              </div>
            )}
            <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2">
              Upcoming appointments
            </h2>
            {content}
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
    showCancelButton: vaosCancel(state),
    showScheduleButton: vaosRequests(state),
  };
}

const mapDispatchToProps = {
  fetchFutureAppointments,
  fetchRequestMessages,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
