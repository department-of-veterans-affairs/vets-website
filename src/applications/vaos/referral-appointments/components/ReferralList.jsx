import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import PendingReferralCard from './PendingReferralCard';
import { routeToNextReferralPage } from '../flow';

const ReferralList = ({ referrals }) => {
  const history = useHistory();
  const handleReferralClick = (e, referralId) => {
    e.preventDefault();
    routeToNextReferralPage(history, 'referralsAndRequests', referralId);
  };
  // return if referrals is empty
  if (referrals.length === 0) {
    return null;
  }
  return (
    <>
      <h2 data-testid="referrals-heading">Community care referrals</h2>
      <p data-testid="referrals-text">
        Your care team approved these community care referrals. You can schedule
        appointments with these providers now.
      </p>
      <ul
        className="vads-u-padding-left--0 vads-u-margin-top--0"
        data-cy="requested-appointment-list"
      >
        {referrals.map((referral, index) => {
          return (
            <PendingReferralCard
              key={index}
              index={index}
              referral={referral}
              handleClick={handleReferralClick}
            />
          );
        })}
      </ul>
    </>
  );
};

ReferralList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ReferralList;
