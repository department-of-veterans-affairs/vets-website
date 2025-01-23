/* istanbul ignore file */
import React from 'react';
import { useGetReferralById } from '../../../hooks/useGetReferralById';

export default function TestComponent() {
  const {
    currentReferral,
    referralFetchStatus,
    referralNotFound,
  } = useGetReferralById('add2f0f4-a1ea-4dea-a504-a54ab57c6800');
  return (
    <div>
      <p>Test component</p>
      <p>{currentReferral?.UUID}</p>
      <p>{referralFetchStatus}</p>
      <p>{`Referral not found: ${referralNotFound}`}</p>
    </div>
  );
}
