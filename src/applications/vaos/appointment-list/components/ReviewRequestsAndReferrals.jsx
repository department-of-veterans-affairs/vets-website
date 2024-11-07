import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectFeatureCCReviewRequestAndReferrals } from '../../redux/selectors';

export default function ReviewRequestsAndReferrals({ count }) {
  const featureCCReviewRequestAndReferrals = useSelector(state =>
    selectFeatureCCReviewRequestAndReferrals(state),
  );

  if (!featureCCReviewRequestAndReferrals || !count) {
    return null;
  }

  return (
    <div
      className={classNames(
        'vads-u-padding-y--3 vads-u-margin-bottom--3 vads-u-margin-top--1  vads-u-border-top--1px vads-u-border-color--info-light  vads-u-border-bottom--1px vads-u-border-color--info-light ',
      )}
    >
      <va-link
        calendar
        href="/my-health/appointments/referrals-requests"
        text={`Review requests and referrals (${count})`}
        data-testid={`review-requests-and-referrals-${count}`}
        role="link"
      />
    </div>
  );
}
ReviewRequestsAndReferrals.propTypes = {
  count: PropTypes.number.isRequired,
};
