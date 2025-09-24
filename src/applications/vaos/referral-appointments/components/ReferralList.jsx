import React from 'react';
import PropTypes from 'prop-types';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PendingReferralCard from './PendingReferralCard';
import InfoAlert from '../../components/InfoAlert';
import NewTabAnchor from '../../components/NewTabAnchor';

const renderDowntimeMessage = () => {
  return (
    <InfoAlert
      status="warning"
      headline="We’re working on community care referrals right now"
    >
      <p>
        You can’t access community care referrals right now. Check back soon, or
        call your provider for help scheduling an appointment.
      </p>
      <p>
        <NewTabAnchor href="/find-locations">
          Find your community care provider’s phone number
        </NewTabAnchor>
      </p>
    </InfoAlert>
  );
};

const ReferralList = ({ referrals, referralsError }) => {
  if (referralsError) {
    return (
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        We’re having trouble getting your community care referrals. Please try
        again later.
      </InfoAlert>
    );
  }

  const referralListContent = () => {
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
            <NewTabAnchor href="/find-locations">
              VA health facility
            </NewTabAnchor>
          </p>
        </div>
      );
    }
    return (
      <ul
        className="usa-unstyled-list vaos-appts__list"
        data-testid="referral-list"
      >
        {referrals.map((referral, index) => {
          return (
            <PendingReferralCard
              key={index}
              index={index}
              referral={referral.attributes}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <DowntimeNotification
      appTitle="community care referrals"
      dependencies={[externalServices.communityCareDS]}
      render={(props, children) => {
        // eslint-disable-next-line react/prop-types
        if (props.status === 'down') {
          return renderDowntimeMessage();
        }
        return children;
      }}
    >
      {referralListContent()}
    </DowntimeNotification>
  );
};

ReferralList.propTypes = {
  referrals: PropTypes.arrayOf(PropTypes.object).isRequired,
  referralsError: PropTypes.bool.isRequired,
};

export default ReferralList;
