import React from 'react';
import PropTypes from 'prop-types';
import ReferralLayout from './ReferralLayout';
import FindCommunityCareOfficeLink from './FindCCFacilityLink';
import InfoAlert from '../../components/InfoAlert';

/**
 * Common error layout component for referral appointment pages
 * when there's an issue fetching referral data
 */

const ReferralErrorLayout = ({
  message = "We're having trouble getting your appointment information. Please try again later or call your facility's community care office.",
  showFindLink = true,
}) => {
  return (
    <ReferralLayout hasEyebrow heading="Referral Error">
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        {message}
      </InfoAlert>
      {showFindLink && <FindCommunityCareOfficeLink />}
    </ReferralLayout>
  );
};

ReferralErrorLayout.propTypes = {
  message: PropTypes.string,
  showFindLink: PropTypes.bool,
};

export default ReferralErrorLayout;
