import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import {
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import {
  selectFutureStatus,
  selectPendingAppointments,
} from '../redux/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants';
import { getVAAppointmentLocationId } from '../../services/appointment';
import RequestListItem from './AppointmentsPage/RequestListItem';
import NoAppointments from './NoAppointments';

function RequestedAppointmentsList({
  showScheduleButton,
  isCernerOnlyPatient,
  pendingAppointments,
  futureStatus,
  facilityData,
  fetchFutureAppointments,
  startNewAppointmentFlow,
}) {
  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        fetchFutureAppointments();
      }
    },
    [fetchFutureAppointments, futureStatus],
  );

  if (futureStatus === FETCH_STATUS.loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointment requests..." />
      </div>
    );
  } else if (
    futureStatus === FETCH_STATUS.succeeded &&
    pendingAppointments?.length > 0
  ) {
    return (
      <ul className="vads-u-padding-left--0">
        {pendingAppointments.map((appt, index) => (
          <RequestListItem
            key={index}
            appointment={appt}
            facility={facilityData[getVAAppointmentLocationId(appt)]}
          />
        ))}
      </ul>
    );
  } else if (futureStatus === FETCH_STATUS.failed) {
    return (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your upcoming appointments. Please try
        again later.
      </AlertBox>
    );
  }

  return (
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

RequestedAppointmentsList.propTypes = {
  isCernerOnlyPatient: PropTypes.bool,
  fetchFutureAppointments: PropTypes.func,
  showScheduleButton: PropTypes.bool,
  startNewAppointmentFlow: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    facilityData: state.appointments.facilityData,
    futureStatus: selectFutureStatus(state),
    pendingAppointments: selectPendingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

const mapDispatchToProps = {
  fetchFutureAppointments: actions.fetchFutureAppointments,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentsList);
