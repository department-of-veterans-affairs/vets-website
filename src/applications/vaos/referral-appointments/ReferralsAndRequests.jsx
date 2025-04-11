import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import InfoAlert from '../components/InfoAlert';
import { setFormCurrentPage } from './redux/actions';
import ReferralLayout from './components/ReferralLayout';
import ReferralList from './components/ReferralList';
import { useGetReferralsAndRequests } from './hooks/useGetReferralsAndRequests';
import RequestsList from './components/RequestsList';

export default function ReferralsAndRequests() {
  const dispatch = useDispatch();

  const location = useLocation();
  useEffect(() => {
    dispatch(setFormCurrentPage('referralsAndRequests'));
  }, [location, dispatch]);

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
        Your care team approved these referrals. Only referrals that you can
        schedule online are shown here, so you may not find all your referrals
        listed.
      </p>
      <p>
        <va-link
          href="https://www.va.gov/resources/how-to-get-community-care-referrals-and-schedule-appointments/"
          text="Find out more about community care referrals"
        />
      </p>
      <ReferralList referrals={referrals} referralsError={referralsError} />
      <h2>Active requests</h2>
      <p className="vaos-hide-for-print">
        We’ll contact you to finish scheduling these appointments.
      </p>
      <RequestsList
        appointments={pendingAppointments}
        showScheduleButton={showScheduleButton}
        requestsError={requestsError}
      />
    </ReferralLayout>
  );
}
