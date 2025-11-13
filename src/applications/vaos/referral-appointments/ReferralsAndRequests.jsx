import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import InfoAlert from '../components/InfoAlert';
import { setFormCurrentPage } from './redux/actions';
import ReferralLayout from './components/ReferralLayout';
import ReferralList from './components/ReferralList';
import {
  getRequestedAppointmentListInfo,
  selectFeatureCCDirectSchedulingChiropractic,
} from '../redux/selectors';
import RequestList from './components/RequestsList';
import { useGetPatientReferralsQuery, vaosApi } from '../redux/api/vaosApi';
import { FETCH_STATUS } from '../utils/constants';
import { filterReferrals } from './utils/referrals';

export default function ReferralsAndRequests() {
  const dispatch = useDispatch();
  const featureCCDirectSchedulingChiropractic = useSelector(state =>
    selectFeatureCCDirectSchedulingChiropractic(state),
  );

  const location = useLocation();
  useEffect(
    () => {
      dispatch(setFormCurrentPage('referralsAndRequests'));
      // Reset API state to ensure fresh data when visiting this page
      dispatch(vaosApi.util.resetApiState());
    },
    [location, dispatch],
  );

  const {
    pendingStatus,
    showScheduleButton,
    pendingAppointments,
  } = useSelector(
    state => getRequestedAppointmentListInfo(state),
    shallowEqual,
  );
  const appointmentIsLoading =
    pendingStatus === FETCH_STATUS.notStarted ||
    pendingStatus === FETCH_STATUS.loading;
  const appointmentError = pendingStatus === FETCH_STATUS.failed;

  const {
    data: referrals,
    error: referralError,
    isLoading,
  } = useGetPatientReferralsQuery();
  if (isLoading || appointmentIsLoading) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading-indicator">
        <va-loading-indicator message="Loading your referrals and appointment requests..." />
      </div>
    );
  }

  const filteredReferrals = filterReferrals(
    referrals || [],
    featureCCDirectSchedulingChiropractic,
  );

  if (referralError && appointmentError) {
    return (
      <ReferralLayout>
        <InfoAlert
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your referrals and appointment requests.
          Please try again later.
        </InfoAlert>
      </ReferralLayout>
    );
  }

  return (
    <ReferralLayout heading="Referrals and requests">
      <p>Find your requested appointments and community care referrals.</p>
      <h2 data-testid="referrals-heading">Community care referrals</h2>
      <p data-testid="referrals-text">
        Your care team approved these referrals. You may not find all your
        referrals listed. Only referrals that you can schedule online are shown
        here.
      </p>
      <p>
        <va-link
          href="https://www.va.gov/resources/how-to-get-community-care-referrals-and-schedule-appointments/"
          text="Find out more about community care referrals"
        />
      </p>
      <ReferralList
        referrals={filteredReferrals}
        referralsError={!!referralError}
      />
      <h2>Active requests</h2>
      <p className="vaos-hide-for-print">
        We’ll contact you to finish scheduling these appointments.
      </p>
      <RequestList
        appointments={pendingAppointments}
        showScheduleButton={showScheduleButton}
        requestsError={appointmentError}
      />
    </ReferralLayout>
  );
}
