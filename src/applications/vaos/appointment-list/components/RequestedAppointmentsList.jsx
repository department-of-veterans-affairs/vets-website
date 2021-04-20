import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { useQuery } from 'react-query';
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
import {
  getAppointmentRequests,
  getVAAppointmentLocationId,
  sortByCreatedDateDescending,
} from '../../services/appointment';
import RequestListItem from './AppointmentsPageV2/RequestListItem';
import NoAppointments from './NoAppointments';
import { getLocations } from '../../services/location';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

function RequestedAppointmentsList({
  showScheduleButton,
  isCernerOnlyPatient,
  startNewAppointmentFlow,
  hasTypeChanged,
}) {
  const { data: pendingAppointments, status: pendingStatus } = useQuery(
    ['requests', 'current'],
    () =>
      getAppointmentRequests({
        startDate: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }),
    {
      select: pending =>
        pending
          .filter(a => !a.vaos.isExpressCare)
          .sort(sortByCreatedDateDescending),
    },
  );
  const facilityIds = new Set(
    pendingAppointments
      ?.filter(appt => appt.vaos && !appt.vaos.isCommunityCare)
      .map(getVAAppointmentLocationId),
  );
  const { data: facilityData } = useQuery(
    ['facilities', facilityIds],
    () => getLocations(Array.from(facilityIds)),
    {
      enabled: !!pendingAppointments && facilityIds.length > 0,
    },
  );

  useEffect(
    () => {
      if (hasTypeChanged && pendingStatus === 'success') {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && pendingStatus === 'error') {
        scrollAndFocus('h3');
      }
    },
    [pendingStatus, hasTypeChanged],
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
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul
          role="list"
          className="vads-u-padding-left--0"
          data-cy="requested-appointment-list"
        >
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
