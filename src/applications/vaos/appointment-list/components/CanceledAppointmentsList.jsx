import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import {
  fetchFutureAppointments,
  startNewAppointmentFlow,
} from '../redux/actions';
import { getCanceledAppointmentListInfo } from '../redux/selectors';
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

export default function CanceledAppointmentsList({ hasTypeChanged }) {
  const {
    appointmentsByMonth,
    facilityData,
    futureStatus,
    isCernerOnlyPatient,
    showScheduleButton,
  } = useSelector(state => getCanceledAppointmentListInfo(state), shallowEqual);

  const dispatch = useDispatch();
  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchFutureAppointments({ includeRequests: true }));
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [fetchFutureAppointments, futureStatus, hasTypeChanged],
  );

  if (
    futureStatus === FETCH_STATUS.notStarted ||
    futureStatus === FETCH_STATUS.loading
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator
          setFocus={hasTypeChanged}
          message="Loading your canceled appointments..."
        />
      </div>
    );
  }

  if (futureStatus === FETCH_STATUS.failed) {
    return (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your canceled appointments. Please try
        again later.
      </AlertBox>
    );
  }

  return (
    <>
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing canceled appointments and requests'}
      </div>
      {appointmentsByMonth?.map((monthBucket, monthIndex) => {
        const monthDate = moment(monthBucket[0].start);
        return (
          <React.Fragment key={monthIndex}>
            <h3
              id={`appointment_list_${monthDate.format('YYYY-MM')}`}
              data-cy="canceled-appointment-list-header"
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
              data-cy="canceled-appointment-list"
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
        <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <NoAppointments
            showScheduleButton={showScheduleButton}
            isCernerOnlyPatient={isCernerOnlyPatient}
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
