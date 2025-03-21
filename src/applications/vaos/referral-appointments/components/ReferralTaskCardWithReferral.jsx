import React from 'react';
import { useLocation } from 'react-router-dom';
import { isAfter } from 'date-fns';
import ReferralTaskCard from './ReferralTaskCard';
import { useGetReferralByIdQuery } from '../../redux/api/vaosApi';

const isExpired = referral => {
  if (!referral?.expirationDate) {
    return false;
  }
  const { expirationDate } = referral;
  const now = new Date();
  const expiration = new Date(expirationDate);
  return isAfter(now, expiration);
};

export default function ReferralTaskCardWithReferral() {
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const id = params.get('id');
  const { data: referral, error, isLoading } = useGetReferralByIdQuery(id, {
    skip: !id,
  });

  if (id && isLoading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        set-focus
        message="Loading your data..."
      />
    );
  }

  if (id && error) {
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
