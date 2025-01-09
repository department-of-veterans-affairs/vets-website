import React from 'react';
import { useLocation } from 'react-router-dom';

import { useGetReferralById } from '../hooks/useGetReferralById';
import ReferralTaskCard from './ReferralTaskCard';
import { FETCH_STATUS } from '../../utils/constants';

export default function ReferralTaskCardWithReferral() {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const id = params.get('id');

  const { currentReferral, referralFetchStatus } = useGetReferralById(id);

  if (
    !currentReferral &&
    (referralFetchStatus === FETCH_STATUS.succeeded ||
      referralFetchStatus === FETCH_STATUS.failed)
  ) {
    return (
      <va-alert
        data-testid="referral-error"
        status="error"
        class="vads-u-margin-y--3"
      >
        <h2>We’re sorry. We’ve run into a problem</h2>
        <p>
          We’re having trouble getting your referral information. Please try
          again later.
        </p>
      </va-alert>
    );
  }

  return <ReferralTaskCard data={currentReferral} />;
}
