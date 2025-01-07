import React from 'react';
import { useLocation } from 'react-router-dom';
import { isAfter } from 'date-fns';

import { useGetReferralById } from '../hooks/useGetReferralById';
import ReferralTaskCard from './ReferralTaskCard';
import { FETCH_STATUS } from '../../utils/constants';

const isExpired = referral => {
  const expirationDate = referral.ReferralExpirationDate;
  const now = new Date();
  const expiration = new Date(expirationDate);
  return isAfter(now, expiration);
};

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

  if (isExpired(currentReferral)) {
    return (
      <va-alert-expandable
        status="warning"
        trigger="Your community care referral has expired"
        disable-analytics="false"
        class="vads-u-margin-y--2"
        uswds
        data-testid="expired-alert"
      >
        <p>
          Call your facility to request a new referral.
          <br />
          <va-link
            href="/find-locations/?facilityType=health"
            target="_blank"
            text="Find your VA health facility"
          />
        </p>
      </va-alert-expandable>
    );
  }

  return <ReferralTaskCard data={currentReferral} />;
}
