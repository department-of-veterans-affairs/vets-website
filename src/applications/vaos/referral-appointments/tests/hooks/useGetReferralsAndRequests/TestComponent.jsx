/* istanbul ignore file */
import React from 'react';
import { useGetReferralsAndRequests } from '../../../hooks/useGetReferralsAndRequests';

export default function TestComponent() {
  const {
    loading,
    referrals,
    pendingAppointments,
    showScheduleButton,
    referralsError,
    requestsError,
  } = useGetReferralsAndRequests();
  return (
    <div>
      <p>Test component</p>
      {referrals?.length > 0 && (
        <>
          <h2>Referrals</h2>
          <ul>
            {referrals.map(referral => {
              return <li key={referral.id}>{referral.name}</li>;
            })}
          </ul>
        </>
      )}
      {pendingAppointments?.length > 0 && (
        <>
          <h2>Requests</h2>
          <ul>
            {pendingAppointments.map(request => {
              return <li key={request.id}>{request.name}</li>;
            })}
          </ul>
        </>
      )}
      <p>{`Loading: ${loading}`}</p>
      <p>{`Referrals error: ${referralsError}`}</p>
      <p>{`Requests error: ${requestsError}`}</p>
      {showScheduleButton && <p>Button</p>}
    </div>
  );
}
