import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import InfoAlert from '../components/InfoAlert';
import BackendAppointmentServiceAlert from '../appointment-list/components/BackendAppointmentServiceAlert';
import { setFormCurrentPage } from './redux/actions';
import ReferralLayout from './components/ReferralLayout';
import ReferralList from './components/ReferralList';
import { useGetReferralsAndRequests } from './hooks/useGetReferralsAndRequests';
import RequestsList from './components/RequestsList';

export default function ReferralsAndRequests() {
  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(
    () => {
      dispatch(setFormCurrentPage('referralsAndRequests'));
    },
    [location, dispatch],
  );

  const {
    loading,
    referrals,
    pendingAppointments,
    showScheduleButton,
    referralsError,
    requestsError,
  } = useGetReferralsAndRequests();

  if (loading) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading-indicator">
        <va-loading-indicator message="Loading your referrals and appointment requests..." />
      </div>
    );
  }
  if (referralsError && requestsError) {
    return (
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        We’re having trouble getting your referrals and appointment requests.
        Please try again later.
      </InfoAlert>
    );
  }

  return (
    <ReferralLayout>
      <BackendAppointmentServiceAlert />
      <h1>Referrals and requests</h1>
      <p>Find your requested appointments and community care referrals.</p>
      <h2 data-testid="referrals-heading">Community care referrals</h2>
      <p data-testid="referrals-text">
        Your care team approved these community care referrals. You can schedule
        appointments with these providers now.
      </p>
      <ReferralList referrals={referrals} referralsError={referralsError} />
      <RequestsList
        appointments={pendingAppointments}
        showScheduleButton={showScheduleButton}
      />
    </ReferralLayout>
  );
}
