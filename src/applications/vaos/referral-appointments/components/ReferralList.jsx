import React from 'react';
import PropTypes from 'prop-types';
import PendingReferralCard from './PendingReferralCard';
import InfoAlert from '../../components/InfoAlert';
import NewTabAnchor from '../../components/NewTabAnchor';

const ReferralList = ({ referrals, referralsError }) => {
  if (referralsError) {
    return (
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        We’re sorry. We can’t retrieve your community care referrals at this
        time. Please try again later.
      </InfoAlert>
    );
  }
  if (referrals.length === 0) {
    return (
      <div
        data-testid="no-referral-content"
        className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3"
      >
        <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
          You don’t have any referrals
        </h2>
        <p className="vads-u-margin-bottom--0">
          If you think you should have referrals here, call your{' '}
          <NewTabAnchor href="/find-locations">VA health facility</NewTabAnchor>
        </p>
      </div>
    );
  }
  return (
    <ul
      className="vads-u-padding-left--0 vads-u-margin-top--0"
      data-testid="referral-list"
    >
      {referrals.map((referral, index) => {
        return (
          <PendingReferralCard key={index} index={index} referral={referral} />
        );
      })}
    </ul>
  );
};

ReferralList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.object).isRequired,
  referralsError: PropTypes.bool.isRequired,
};

export default ReferralList;
