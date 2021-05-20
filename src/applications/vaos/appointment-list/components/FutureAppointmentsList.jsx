import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import {
  selectFeatureCancel,
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import {
  selectFutureAppointments,
  selectFutureStatus,
} from '../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
} from '../../utils/constants';
import { getVAAppointmentLocationId } from '../../services/appointment';
import ConfirmedAppointmentListItem from './cards/confirmed/ConfirmedAppointmentListItem';
import AppointmentRequestListItem from './cards/pending/AppointmentRequestListItem';
import NoAppointments from './NoAppointments';

function FutureAppointmentsList({
  showCancelButton,
  showScheduleButton,
  isCernerOnlyPatient,
  future,
  futureStatus,
  facilityData,
  requestMessages,
  startAppointmentCancel,
  fetchRequestMessages,
  startNewAppointmentFlow,
}) {
  let content;

  if (futureStatus === FETCH_STATUS.loading) {
    content = (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your upcoming appointments..." />
      </div>
    );
  } else if (futureStatus === FETCH_STATUS.succeeded && future?.length > 0) {
    content = (
      // eslint-disable-next-line jsx-a11y/no-redundant-roles
      <ul role="list" className="usa-unstyled-list" id="appointments-list">
        {future.map((appt, index) => {
          const facilityId = getVAAppointmentLocationId(appt);

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
                  cancelAppointment={startAppointmentCancel}
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
                  cancelAppointment={startAppointmentCancel}
                  fetchMessages={fetchRequestMessages}
                  messages={requestMessages}
                />
              );
            }
            default:
              return null;
          }
        })}
      </ul>
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

  return (
    <div role="tabpanel" aria-labelledby="tabupcoming" id="tabpanelupcoming">
      {content}
    </div>
  );
}

FutureAppointmentsList.propTypes = {
  startAppointmentCancel: PropTypes.func,
  isCernerOnlyPatient: PropTypes.bool,
  fetchRequestMessages: PropTypes.func,
  fetchFutureAppointments: PropTypes.func,
  showCancelButton: PropTypes.bool,
  showScheduleButton: PropTypes.bool,
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
    showScheduleButton: selectFeatureRequests(state),
  };
}

const mapDispatchToProps = {
  startAppointmentCancel: actions.startAppointmentCancel,
  fetchFutureAppointments: actions.fetchFutureAppointments,
  fetchRequestMessages: actions.fetchRequestMessages,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FutureAppointmentsList);
