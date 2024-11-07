import React from 'react';
import classNames from 'classnames';

export default function ReviewRequestsAndReferrals() {
  return (
    <div
      className={classNames(
        'vads-u-padding-y--3 vads-u-margin-bottom--3 vads-u-margin-top--1  vads-u-border-top--1px vads-u-border-color--info-light  vads-u-border-bottom--1px vads-u-border-color--info-light ',
      )}
    >
      <va-link
        calendar
        href="/my-health/appointments/referrals-requests"
        text="Review requests and referrals"
        data-testid="review-requests-and-referrals"
      />
    </div>
  );
}
