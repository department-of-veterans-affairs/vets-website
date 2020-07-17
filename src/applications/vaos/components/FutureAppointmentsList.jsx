import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';
import { getRealFacilityId } from '../utils/appointment';
import recordEvent from 'platform/monitoring/record-event';
import {
  cancelAppointment,
  fetchFutureAppointments,
  fetchRequestMessages,
  startNewAppointmentFlow,
} from '../actions/appointments';
import {
  vaosCancel,
  vaosRequests,
  vaosPastAppts,
  isWelcomeModalDismissed,
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { FETCH_STATUS, GA_PREFIX, APPOINTMENT_TYPES } from '../utils/constants';
import { getVAAppointmentLocationId } from '../services/appointment';
import ConfirmedAppointmentListItem from './ConfirmedAppointmentListItem';
import AppointmentRequestListItem from './AppointmentRequestListItem';
import NoAppointments from './NoAppointments';

export class FutureAppointmentsList extends React.Component {
  componentDidMount() {
    if (this.props.appointments.futureStatus === FETCH_STATUS.notStarted) {
      this.props.fetchFutureAppointments();
    }
  }

  render() {
    const {
      appointments,
      showPastAppointments,
      showCancelButton,
      showScheduleButton,
      isCernerOnlyPatient,
    } = this.props;

    const {
      future,
      futureStatus,
      facilityData,
      requestMessages,
    } = appointments;

    let content;

    if (futureStatus === FETCH_STATUS.loading) {
      content = (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator message="Loading your appointments..." />
        </div>
      );
    } else if (futureStatus === FETCH_STATUS.succeeded && future?.length > 0) {
      content = (
        <>
          {!showPastAppointments && (
            <>
              <p>
                To view past appointments you’ve made,{' '}
                <a
                  href={`https://${
                    !environment.isProduction() ? 'mhv-syst' : 'www'
                  }.myhealth.va.gov/mhv-portal-web/appointments`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    recordEvent({
                      event: 'vaos-past-appointments-legacy-link-clicked',
                    })
                  }
                >
                  go to My HealtheVet
                </a>
                .
              </p>
            </>
          )}
          <ul className="usa-unstyled-list" id="appointments-list">
            {future.map((appt, index) => {
              const facilityId = getRealFacilityId(
                getVAAppointmentLocationId(appt),
              );

              switch (appt.vaos?.appointmentType) {
                case APPOINTMENT_TYPES.vaAppointment:
                case APPOINTMENT_TYPES.ccAppointment:
                  return (
                    <ConfirmedAppointmentListItem
                      key={index}
                      index={index}
                      appointment={appt}
                      facility={facilityData[facilityId]}
                      showCancelButton={showCancelButton}
                      cancelAppointment={this.props.cancelAppointment}
                    />
                  );
                case APPOINTMENT_TYPES.request:
                case APPOINTMENT_TYPES.ccRequest: {
                  return (
                    <AppointmentRequestListItem
                      key={index}
                      index={index}
                      appointment={appt}
                      facility={facilityData[facilityId]}
                      facilityId={facilityId}
                      showCancelButton={showCancelButton}
                      cancelAppointment={this.props.cancelAppointment}
                      fetchMessages={this.props.fetchRequestMessages}
                      messages={requestMessages}
                    />
                  );
                }
                default:
                  return null;
              }
            })}
          </ul>
        </>
      );
    } else if (futureStatus === FETCH_STATUS.failed) {
      content = (
        <AlertBox
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your upcoming appointments. Please try
          again later.
        </AlertBox>
      );
    } else {
      content = (
        <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <NoAppointments
            showScheduleButton={showScheduleButton}
            isCernerOnlyPatient={isCernerOnlyPatient}
            startNewAppointmentFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              this.props.startNewAppointmentFlow();
            }}
          />
        </div>
      );
    }

    const header = (
      <h2 className="vads-u-margin-bottom--4 vads-u-font-size--h3">
        Upcoming appointments
      </h2>
    );

    if (!showPastAppointments) {
      return (
        <>
          {header}
          {content}
        </>
      );
    }

    return (
      <div role="tabpanel" aria-labelledby="tabupcoming" id="tabpanelupcoming">
        {header}
        {content}
      </div>
    );
  }
}

FutureAppointmentsList.propTypes = {
  appointments: PropTypes.object,
  cancelAppointment: PropTypes.func,
  isCernerOnlyPatient: PropTypes.bool,
  isWelcomeModalDismissed: PropTypes.bool,
  fetchRequestMessages: PropTypes.func,
  fetchFutureAppointments: PropTypes.func,
  showCancelButton: PropTypes.bool,
  showPastAppointments: PropTypes.bool,
  showScheduleButton: PropTypes.bool,
  startNewAppointmentFlow: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    appointments: state.appointments,
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    isWelcomeModalDismissed: isWelcomeModalDismissed(state),
    showCancelButton: vaosCancel(state),
    showPastAppointments: vaosPastAppts(state),
    showScheduleButton: vaosRequests(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment,
  fetchFutureAppointments,
  fetchRequestMessages,
  startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FutureAppointmentsList);
