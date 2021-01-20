import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import {
  selectFeatureCancel,
  selectFeatureRequests,
  selectFeaturePastAppointments,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import {
  selectFutureAppointments,
  selectExpressCareAvailability,
  selectFutureStatus,
} from '../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
} from '../../utils/constants';
import NoAppointments from './NoAppointments';

function FutureAppointmentsList({
  showPastAppointments,
  showScheduleButton,
  isCernerOnlyPatient,
  future,
  futureStatus,
  expressCare,
  fetchFutureAppointments,
  startNewAppointmentFlow,
}) {
  useEffect(
    () => {
      if (!expressCare.enabled && futureStatus === FETCH_STATUS.notStarted) {
        fetchFutureAppointments();
      }
    },
    [expressCare.enabled, fetchFutureAppointments, futureStatus],
  );

  let content;

  if (futureStatus === FETCH_STATUS.loading) {
    content = (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your upcoming appointments..." />
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
          {future.map((appt, _index) => {
            switch (appt.vaos?.appointmentType) {
              case APPOINTMENT_TYPES.vaAppointment:
              case APPOINTMENT_TYPES.ccAppointment:
                return null;
              case APPOINTMENT_TYPES.request:
              case APPOINTMENT_TYPES.ccRequest: {
                return null;
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
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
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
            startNewAppointmentFlow();
          }}
        />
      </div>
    );
  }

  const header = !expressCare.hasRequests && (
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

FutureAppointmentsList.propTypes = {
  cancelAppointment: PropTypes.func,
  isCernerOnlyPatient: PropTypes.bool,
  fetchRequestMessages: PropTypes.func,
  fetchFutureAppointments: PropTypes.func,
  showCancelButton: PropTypes.bool,
  showPastAppointments: PropTypes.bool,
  showScheduleButton: PropTypes.bool,
  showExpressCare: PropTypes.bool,
  startNewAppointmentFlow: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    requestMessages: state.appointments.requestMessages,
    facilityData: state.appointments.facilityData,
    futureStatus: selectFutureStatus(state),
    future: selectFutureAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showCancelButton: selectFeatureCancel(state),
    showPastAppointments: selectFeaturePastAppointments(state),
    showScheduleButton: selectFeatureRequests(state),
    expressCare: selectExpressCareAvailability(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment: actions.cancelAppointment,
  fetchFutureAppointments: actions.fetchFutureAppointments,
  fetchRequestMessages: actions.fetchRequestMessages,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FutureAppointmentsList);
