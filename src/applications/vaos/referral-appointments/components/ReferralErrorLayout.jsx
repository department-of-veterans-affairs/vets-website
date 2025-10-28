import React from 'react';
import PropTypes from 'prop-types';
import ReferralLayout from './ReferralLayout';
import FindCommunityCareOfficeLink from './FindCCFacilityLink';

/**
 * Common error layout component for referral appointment pages
 * when there's an issue fetching referral data
 */

const ReferralErrorLayout = ({
  message = 'Something went wrong on our end. Please try again later.',
  showFindLink = true,
}) => {
  return (
    <ReferralLayout hasEyebrow heading="Referral Error">
      <va-alert data-testid="error" status="error">
        <h2>We’re sorry. We’ve run into a problem.</h2>
        <p data-testid="error-body">{message}</p>
      </va-alert>
      {showFindLink && <FindCommunityCareOfficeLink />}
    </ReferralLayout>
  );
};

ReferralErrorLayout.propTypes = {
  message: PropTypes.string,
  showFindLink: PropTypes.bool,
};

export default ReferralErrorLayout;
