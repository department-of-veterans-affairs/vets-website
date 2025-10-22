import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReferralLayout from './components/ReferralLayout';
// eslint-disable-next-line import/no-restricted-paths
import { getUpcomingAppointmentListInfo } from '../appointment-list/redux/selectors';
import { setFormCurrentPage } from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import { fetchFutureAppointments } from '../appointment-list/redux/actions';
import {
  useGetDraftReferralAppointmentQuery,
  useGetReferralByIdQuery,
} from '../redux/api/vaosApi';
import { FETCH_STATUS } from '../utils/constants';
import DateAndTimeContent from './components/DateAndTimeContent';

export const ChooseDateAndTime = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { search } = location;
  const params = new URLSearchParams(search);
  const id = params.get('id');

  const {
    data: referral,
    error: referralError,
    isLoading: isReferralLoading,
  } = useGetReferralByIdQuery(id, {
    skip: !id,
  });

  const currentReferral = referral?.attributes;

  const {
    data: draftAppointmentInfo,
    isLoading: isDraftLoading,
    isError: isDraftError,
    isSuccess: isDraftSuccess,
    isUninitialized: isDraftUninitialized,
  } = useGetDraftReferralAppointmentQuery(
    {
      referralNumber: currentReferral?.referralNumber,
      referralConsultId: currentReferral?.referralConsultId,
    },
    {
      skip:
        !currentReferral?.referralNumber || !currentReferral?.referralConsultId,
    },
  );

  const { futureStatus, appointmentsByMonth } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(
    () => {
      if (draftAppointmentInfo?.attributes) {
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
        if (futureStatus === FETCH_STATUS.succeeded) {
          setLoading(false);
        }
      } else if (
        isDraftUninitialized ||
        futureStatus === FETCH_STATUS.notStarted
      ) {
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
      } else if (isDraftError || futureStatus === FETCH_STATUS.failed) {
        setLoading(false);
        setFailed(true);
      }
    },
    [
      dispatch,
      draftAppointmentInfo,
      futureStatus,
      isDraftError,
      isDraftSuccess,
      isDraftUninitialized,
    ],
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  // Handle referral loading and error states
  if (isReferralLoading) {
    return (
      <ReferralLayout
        loadingMessage="Loading your appointment information..."
        hasEyebrow
        heading="Schedule an appointment with your provider"
      />
    );
  }

  if (referralError || !currentReferral) {
    return (
      <ReferralLayout
        hasEyebrow
        heading="We're sorry. We've run into a problem"
      >
        <div>
          <p>
            We’re having trouble getting your appointment information. Please
            try again later or call your facility’s community care office.
          </p>
        </div>
      </ReferralLayout>
    );
  }

  if (loading || isDraftLoading) {
    return (
      <ReferralLayout
        data-testid="loading"
        loadingMessage="Loading available appointment times..."
        hasEyebrow
        heading="Schedule an appointment with your provider"
      />
    );
  }

  return (
    <ReferralLayout
      hasEyebrow
      apiFailure={failed}
      heading="Schedule an appointment with your provider"
    >
      <DateAndTimeContent
        draftAppointmentInfo={draftAppointmentInfo}
        currentReferral={currentReferral}
        appointmentsByMonth={appointmentsByMonth}
      />
    </ReferralLayout>
  );
};

export default ChooseDateAndTime;
