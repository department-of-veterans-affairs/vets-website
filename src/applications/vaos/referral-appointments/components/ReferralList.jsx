import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import PendingReferralCard from './PendingReferralCard';
import { routeToNextReferralPage } from '../flow';
import InfoAlert from '../../components/InfoAlert';
import NewTabAnchor from '../../components/NewTabAnchor';

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
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
        <h3>You don’t have any referrals</h3>
        <p>
          If you think you should have referrals here, call your
          <NewTabAnchor href="/find-locations">VA facility</NewTabAnchor>
        </p>
      </div>
    );
  }
  return (
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
  );
};

ReferralList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.object).isRequired,
  referralsError: PropTypes.bool.isRequired,
};

export default ReferralList;
