import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import PendingReferralCard from './PendingReferralCard';
import { routeToNextReferralPage } from '../flow';
import InfoAlert from '../../components/InfoAlert';

const ReferralList = ({ referrals, referralsError }) => {
  const history = useHistory();
  const handleReferralClick = (e, referralId) => {
    e.preventDefault();
    routeToNextReferralPage(history, 'referralsAndRequests', referralId);
  };
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
      <InfoAlert
        status="info"
        headline="You don’t have any community care referrals"
      >
        You don’t have any community care referrals at this time. If you think
        you should have one, please call your VA health care team.
      </InfoAlert>
    );
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
  referrals: PropTypes.arrayOf(PropTypes.object).isRequired,
  referralsError: PropTypes.bool.isRequired,
};

export default ReferralList;
