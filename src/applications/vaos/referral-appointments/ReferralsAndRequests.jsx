import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  fetchPendingAppointments,
  startNewAppointmentFlow,
} from '../appointment-list/redux/actions';
import { getRequestedAppointmentListInfo } from '../appointment-list/redux/selectors';
import {
  APPOINTMENT_STATUS,
  FETCH_STATUS,
  GA_PREFIX,
} from '../utils/constants';
import NoAppointments from '../appointment-list/components/NoAppointments';
import InfoAlert from '../components/InfoAlert';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import RequestAppointmentLayout from '../appointment-list/components/AppointmentsPage/RequestAppointmentLayout';
import BackendAppointmentServiceAlert from '../appointment-list/components/BackendAppointmentServiceAlert';
import { setFormCurrentPage } from './redux/actions';
import ReferralLayout from './components/ReferralLayout';
import { createReferrals } from './utils/referrals';
import ReferralList from './components/ReferralList';

export default function ReferralsAndRequests() {
  const {
    pendingAppointments,
    pendingStatus,
    showScheduleButton,
  } = useSelector(
    state => getRequestedAppointmentListInfo(state),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(
    () => {
      dispatch(setFormCurrentPage('referralsAndRequests'));
    },
    [location, dispatch],
  );

  // TODO add referral fetch
  const pendingReferrals = createReferrals(3, '2024-09-09');

  useEffect(
    () => {
      if (pendingStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchPendingAppointments());
      } else if (pendingStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (pendingStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [pendingStatus, dispatch],
  );

  if (
    pendingStatus === FETCH_STATUS.loading ||
    pendingStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator message="Loading your appointment requests..." />
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

  return (
    <ReferralLayout>
      <BackendAppointmentServiceAlert />
      <h1>Referrals and requests</h1>
      <p>Find your requested appointments and community care referrals.</p>
      <ReferralList referrals={pendingReferrals} />
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
      {appointmentsByStatus.map(statusBucket => {
        return (
          <React.Fragment key={statusBucket[0]}>
            {statusBucket[0] === APPOINTMENT_STATUS.cancelled && (
              <>
                <h2>Canceled requests</h2>
                <p
                  className="vaos-hide-for-print"
                  data-testid="appointments-cancelled-text"
                >
                  These are requested appointments that you or staff have asked
                  to be canceled. If you still want this appointment, contact
                  your facility or start scheduling.
                </p>
              </>
            )}
            {statusBucket[0] === APPOINTMENT_STATUS.proposed && (
              <>
                <h2>Active requests</h2>
                <p className="vaos-hide-for-print">
                  We'll contact you to finish scheduling these appointments.
                </p>
              </>
            )}
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              className="vads-u-padding-left--0 vads-u-margin-top--0"
              data-cy="requested-appointment-list"
            >
              {statusBucket[1].map((appt, index) => {
                return (
                  <RequestAppointmentLayout
                    key={index}
                    index={index}
                    appointment={appt}
                  />
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}
    </ReferralLayout>
  );
}
