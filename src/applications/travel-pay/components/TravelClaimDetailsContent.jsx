import React from 'react';
import PropTypes from 'prop-types';

import { ComplexClaimsHelpSection } from './HelpText';
import ClaimDetailsContent from './ClaimDetailsContent';
import { TRAVEL_PAY_INFO_LINK, REIMBURSEMENT_URL } from '../constants';

export default function TravelClaimDetailsContent({ claimDetails, hasError }) {
  return (
    <>
      {hasError && (
        <>
          <h1>Your travel reimbursement claim</h1>
          <va-alert
            close-btn-aria-label="Close notification"
            status="error"
            visible
          >
            <h2 slot="headline">Something went wrong on our end</h2>
            <p className="vads-u-margin-y--0">
              We’re sorry. We couldn’t get your travel reimbursement claim
              status in this tool right now. Please try again later.
            </p>
            <p>
              You can call the BTSSS call center at{' '}
              <va-telephone contact="8555747292" /> (
              <va-telephone tty contact="711" />) Monday through Friday, 8:00
              a.m. to 8:00 p.m. ET.
            </p>
            <va-link
              href={TRAVEL_PAY_INFO_LINK}
              text="Find out how to file for travel reimbursement"
            />
          </va-alert>
        </>
      )}
      {claimDetails && <ClaimDetailsContent {...claimDetails} />}
      <hr className="vads-u-margin-bottom--0" />

      <div className="vads-u-margin-bottom--4">
        <p>
          <strong>Note:</strong> Even if you already set up direct deposit for
          your VA benefits, you’ll need to set up another direct deposit for VA
          travel pay. If you’re eligible for reimbursement, we’ll deposit your
          funds in your bank account.
        </p>
        <va-link
          href={REIMBURSEMENT_URL}
          text="Learn how to set up direct deposit for travel pay"
        />
        <ComplexClaimsHelpSection className="vads-u-margin-left--0" />
      </div>
    </>
  );
}

TravelClaimDetailsContent.propTypes = {
  claimDetails: PropTypes.object,
  hasError: PropTypes.bool,
};
