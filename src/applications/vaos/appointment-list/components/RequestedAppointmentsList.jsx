import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import {
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import { selectPendingAppointments } from '../redux/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants';
import { getVAAppointmentLocationId } from '../../services/appointment';
import RequestListItem from './AppointmentsPageV2/RequestListItem';
import NoAppointments from './NoAppointments';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

function RequestedAppointmentsList({
  showScheduleButton,
  isCernerOnlyPatient,
  pendingAppointments,
  pendingStatus,
  facilityData,
  fetchPendingAppointments,
  startNewAppointmentFlow,
  hasTypeChanged,
}) {
  useEffect(
    () => {
      if (pendingStatus === FETCH_STATUS.notStarted) {
        fetchPendingAppointments();
      } else if (hasTypeChanged && pendingStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && pendingStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [fetchPendingAppointments, pendingStatus, hasTypeChanged],
  );

  if (
    pendingStatus === FETCH_STATUS.loading ||
    pendingStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator
          setFocus={hasTypeChanged}
          message="Loading your appointment requests..."
        />
      </div>
    );
  }

  if (pendingStatus === FETCH_STATUS.failed) {
    return (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your appointment requests. Please try again
        later.
      </AlertBox>
    );
  }

  return (
    <>
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing requested appointments'}
      </div>
      {pendingAppointments?.length > 0 && (
        <ul className="vads-u-padding-left--0">
          {pendingAppointments.map((appt, index) => (
            <RequestListItem
              key={index}
              appointment={appt}
              facility={facilityData[getVAAppointmentLocationId(appt)]}
            />
          ))}
        </ul>
      )}
      {pendingAppointments?.length === 0 && (
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
      )}
    </>
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
    pendingStatus: state.appointments.pendingStatus,
    pendingAppointments: selectPendingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

const mapDispatchToProps = {
  fetchPendingAppointments: actions.fetchPendingAppointments,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentsList);
