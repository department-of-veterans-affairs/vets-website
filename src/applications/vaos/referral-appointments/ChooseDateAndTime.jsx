import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';
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
  } = useGetReferralByIdQuery(id);

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
        !currentReferral?.referralNumber ||
        !currentReferral?.referralConsultId ||
        isReferralLoading ||
        referral?.attributes?.hasAppointments,
    },
  );

  const { futureStatus, appointmentsByMonth } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );

  // Need future appointments to check for conflicts when selecting a date and time
  useEffect(
    () => {
      // Fetch future appointments once referral is loaded and draft query starts
      if (
        !isReferralLoading &&
        !isDraftUninitialized &&
        futureStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(fetchFutureAppointments({ includeRequests: false }));
      }
    },
    [dispatch, isReferralLoading, isDraftUninitialized, futureStatus],
  );

  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  const isLoading =
    isReferralLoading ||
    isDraftLoading ||
    (isDraftSuccess &&
      futureStatus !== FETCH_STATUS.succeeded &&
      futureStatus !== FETCH_STATUS.failed);

  const hasFailed =
    isDraftError ||
    futureStatus === FETCH_STATUS.failed ||
    referralError ||
    !currentReferral;

  if (referral?.attributes?.hasAppointments) {
    return <Redirect to="/referrals-requests" />;
  }

  if (isLoading) {
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
      apiFailure={hasFailed}
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
