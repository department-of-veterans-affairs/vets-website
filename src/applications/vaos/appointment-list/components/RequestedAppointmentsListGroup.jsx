import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import classNames from 'classnames';
import {
  fetchPendingAppointments,
  startNewAppointmentFlow,
} from '../redux/actions';
import { getRequestedAppointmentListInfo } from '../redux/selectors';
import {
  APPOINTMENT_STATUS,
  FETCH_STATUS,
  GA_PREFIX,
} from '../../utils/constants';
import NoAppointments from './NoAppointments';
import InfoAlert from '../../components/InfoAlert';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { selectFeatureStatusImprovement } from '../../redux/selectors';
import RequestAppointmentLayout from './AppointmentsPage/RequestAppointmentLayout';
import BackendAppointmentServiceAlert from './BackendAppointmentServiceAlert';

export default function RequestedAppointmentsListGroup({ hasTypeChanged }) {
  const {
    pendingAppointments,
    pendingStatus,
    showScheduleButton,
  } = useSelector(
    state => getRequestedAppointmentListInfo(state),
    shallowEqual,
  );

  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  const dispatch = useDispatch();

  useEffect(
    () => {
      if (pendingStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchPendingAppointments());
      } else if (hasTypeChanged && pendingStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && pendingStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [pendingStatus, hasTypeChanged, dispatch],
  );

  if (
    pendingStatus === FETCH_STATUS.loading ||
    pendingStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          set-focus={hasTypeChanged}
          message="Loading your appointment requests..."
        />
      </div>
    );
  }

  if (pendingStatus === FETCH_STATUS.failed) {
    return (
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        We’re having trouble getting your appointment requests. Please try again
        later.
      </InfoAlert>
    );
  }

  // Group appointments by status
  let appointmentsByStatus = pendingAppointments.reduce(
    (previousValue, currentValue) => {
      const groupByKey = currentValue.status;
      const temp = previousValue;

      // previousValue is initialize to an object
      // Return the array of appointments if the status key exists or
      // create a new status key with new array.
      temp[groupByKey] = previousValue[groupByKey] || [];
      temp[groupByKey].push(currentValue);
      return temp;
    },
    {},
  );

  // Next, get an array of [key, value] pairs. Sort the array in decending order
  // so that pending appointments are displayed 1st
  appointmentsByStatus = Object.entries(appointmentsByStatus).sort((a, b) => {
    if (a[0].toLowerCase() < b[0].toLowerCase()) return 1;
    if (a[0].toLowerCase() > b[0].toLowerCase()) return -1;
    return 0;
  });
  let paragraphText =
    'Appointments that you request will show here until staff review and schedule them.';
  if (featureStatusImprovement) {
    paragraphText =
      'Your appointment requests that haven’t been scheduled yet.';
  }

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {hasTypeChanged && 'Showing requested appointments'}
      </div>
      <>
        <BackendAppointmentServiceAlert />

        {!appointmentsByStatus.flat().includes(APPOINTMENT_STATUS.proposed) && (
          <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
            <NoAppointments
              showAdditionalRequestDescription
              description="appointment requests"
              showScheduleButton={showScheduleButton}
              startNewAppointmentFlow={() => {
                recordEvent({
                  event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
                });
                startNewAppointmentFlow();
              }}
              level={2}
            />
          </div>
        )}
        {appointmentsByStatus.flat().includes(APPOINTMENT_STATUS.proposed) && (
          <p className="vaos-hide-for-print xsmall-screen:vads-u-margin-bottom--1 small-screen:vads-u-margin-bottom--2">
            {paragraphText}
          </p>
        )}
        {appointmentsByStatus.map(statusBucket => {
          return (
            <React.Fragment key={statusBucket[0]}>
              {statusBucket[0] === APPOINTMENT_STATUS.cancelled && (
                <>
                  <h2>Canceled requests</h2>
                  <p className="vaos-hide-for-print">
                    These appointment requests have been canceled.
                  </p>
                </>
              )}
              {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
              <ul
                className={classNames(
                  'vads-u-padding-left--0 vads-u-margin-top--0',
                )}
                data-cy="requested-appointment-list"
              >
                {statusBucket[1].map((appt, index) => {
                  return (
                    <RequestAppointmentLayout key={index} appointment={appt} />
                  );
                })}
              </ul>
            </React.Fragment>
          );
        })}
      </>
    </>
  );
}

RequestedAppointmentsListGroup.propTypes = {
  hasTypeChanged: PropTypes.bool,
};
