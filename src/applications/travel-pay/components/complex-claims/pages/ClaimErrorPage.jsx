import React from 'react';
import PropTypes from 'prop-types';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import { PAST_APPOINTMENTS_LINK } from '../../../constants';
import WhatHappensNextSection from './WhatHappensNextSection';
import { ComplexClaimsHelpSection } from '../../HelpText';
// This page is displayed when the API GET CLAIM call and the API CREATE CLAIM call fails
const ClaimErrorPage = ({ isCreate }) => {
  const header = isCreate
    ? 'We couldn’t start your claim'
    : 'We couldn’t access your claim right now';
  const alertDescription = isCreate
    ? 'We’re sorry. We couldn’t start your travel reimbursement claim. Try to file your claim again.'
    : 'We’re sorry. We can’t access your claim information right now. Try again later.';
  useSetPageTitle(header);
  useSetFocus();
  return (
    <div>
      <h1>{header}</h1>
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">Something went wrong on our end</h2>
        <p className="vads-u-margin-y--0">{alertDescription}</p>
        {isCreate ? (
          <va-link
            href={PAST_APPOINTMENTS_LINK}
            text="Go to past appointments to file for travel pay"
          />
        ) : (
          <va-link
            href="/my-health/travel-pay/claims/"
            text="Go to your travel reimbursement claims"
          />
        )}
      </va-alert>
      <WhatHappensNextSection isError />
      <ComplexClaimsHelpSection />
    </div>
  );
};

ClaimErrorPage.propTypes = {
  isCreate: PropTypes.bool,
};

export default ClaimErrorPage;
