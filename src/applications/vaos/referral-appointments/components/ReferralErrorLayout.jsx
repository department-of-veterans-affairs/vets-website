import React from 'react';
import PropTypes from 'prop-types';
import ReferralLayout from './ReferralLayout';
import FindCommunityCareOfficeLink from './FindCCFacilityLink';

/**
 * Common error layout component for referral appointment pages
 * when there's an issue fetching referral data
 */
const ReferralErrorLayout = ({
  message = "We're having trouble getting your appointment information. Please try again later or call your facility's community care office.",
  showFindLink = true,
}) => {
  return (
    <ReferralLayout hasEyebrow heading="We're sorry. We've run into a problem">
      <div>
        <p>{message}</p>
        {showFindLink && <FindCommunityCareOfficeLink />}
      </div>
    </ReferralLayout>
  );
};

ReferralErrorLayout.propTypes = {
  message: PropTypes.string,
  showFindLink: PropTypes.bool,
};

export default ReferralErrorLayout;
