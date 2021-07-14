import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import InfoAlert from '../../components/InfoAlert';
import recordEvent from 'platform/monitoring/record-event';
import { getUpcomingAppointmentListInfo } from '../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
} from '../../utils/constants';
import { getVAAppointmentLocationId } from '../../services/appointment';
import AppointmentListItem from './AppointmentsPageV2/AppointmentListItem';
import NoAppointments from './NoAppointments';
import moment from 'moment';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import {
  fetchFutureAppointments,
  startNewAppointmentFlow,
} from '../redux/actions';

export default function UpcomingAppointmentsList() {
  const dispatch = useDispatch();
  const {
    showScheduleButton,
    appointmentsByMonth,
    futureStatus,
    facilityData,
    hasTypeChanged,
  } = useSelector(state => getUpcomingAppointmentListInfo(state), shallowEqual);

  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchFutureAppointments({ includeRequests: false }));
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [fetchFutureAppointments, futureStatus, hasTypeChanged],
  );

  if (
    futureStatus === FETCH_STATUS.loading ||
    futureStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator
          setFocus={hasTypeChanged}
          message="Loading your upcoming appointments..."
        />
      </div>
    );
  }

  if (futureStatus === FETCH_STATUS.failed) {
    return (
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        We’re having trouble getting your upcoming appointments. Please try
        again later.
      </InfoAlert>
    );
  }

  return (
    <>
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing upcoming appointments'}
      </div>
      {appointmentsByMonth.map((monthBucket, monthIndex) => {
        const monthDate = moment(monthBucket[0].start);
        return (
          <React.Fragment key={monthIndex}>
            <h3
              id={`appointment_list_${monthDate.format('YYYY-MM')}`}
              data-cy="upcoming-appointment-list-header"
            >
              <span className="sr-only">Appointments in </span>
              {monthDate.format('MMMM YYYY')}
            </h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              role="list"
              aria-labelledby={`appointment_list_${monthDate.format(
                'YYYY-MM',
              )}`}
              className="vads-u-padding-left--0"
              data-cy="upcoming-appointment-list"
            >
              {monthBucket.map((appt, index) => {
                const facilityId = getVAAppointmentLocationId(appt);

                if (
                  appt.vaos.appointmentType ===
                    APPOINTMENT_TYPES.vaAppointment ||
                  appt.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment
                ) {
                  return (
                    <AppointmentListItem
                      key={index}
                      appointment={appt}
                      facility={facilityData[facilityId]}
                    />
                  );
                }
                return null;
              })}
            </ul>
          </React.Fragment>
        );
      })}
      {!appointmentsByMonth?.length && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
          <NoAppointments
            description="upcoming appointments"
            showScheduleButton={showScheduleButton}
            startNewAppointmentFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              dispatch(startNewAppointmentFlow());
            }}
          />
        </div>
      )}
    </>
  );
}
