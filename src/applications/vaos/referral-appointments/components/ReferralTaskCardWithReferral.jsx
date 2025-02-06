import React from 'react';
import { useLocation } from 'react-router-dom';
import { isAfter } from 'date-fns';

import { useGetReferralById } from '../hooks/useGetReferralById';
import ReferralTaskCard from './ReferralTaskCard';
import { FETCH_STATUS } from '../../utils/constants';

const isExpired = referral => {
  if (!referral?.ReferralExpirationDate) {
    return false;
  }
  const expirationDate = referral.ReferralExpirationDate;
  const now = new Date();
  const expiration = new Date(expirationDate);
  return isAfter(now, expiration);
};

export default function ReferralTaskCardWithReferral() {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const id = params.get('id');

  const { referral, referralFetchStatus } = useGetReferralById(id);

  if (
    id &&
    (referralFetchStatus === FETCH_STATUS.loading ||
      referralFetchStatus === FETCH_STATUS.notStarted)
  ) {
    return <va-loading-indicator set-focus message="Loading your data..." />;
  }

  if (id && referralFetchStatus === FETCH_STATUS.failed) {
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

  if (isExpired(referral)) {
    return (
      <va-alert-expandable
        status="warning"
        trigger="Your community care referral has expired"
        disable-analytics="false"
        class="vads-u-margin-y--2"
        uswds
        data-testid="expired-alert"
      >
        <div>
          <p className="vads-u-margin-bottom--1p5">
            Call your facility to request a new referral.
          </p>
          <va-link
            href="/find-locations/?facilityType=health"
            text="Find your VA health facility"
          />
        </div>
      </va-alert-expandable>
    );
  }

  return <ReferralTaskCard data={referral} />;
}
