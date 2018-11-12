import React from 'react';
import backendServices from 'platform/user/profile/constants/backendServices';
import brandConsolidation from '../../../brand-consolidation';

export default function ClaimIncreaseBanner({ dismiss, isLoggedIn, profile }) {
  if (brandConsolidation.isEnabled()) return null;

  if (profile.loading) return null;
  if (
    isLoggedIn &&
    !profile.services.includes(backendServices.CLAIM_INCREASE_AVAILABLE)
  )
    return null;

  return (
    <div className="personalization-announcement">
      <span className="usa-label va-label-primary">New</span>{' '}
      <a onClick={dismiss} href="/beta-enrollment/claim-increase">
        Check out our new beta tool for filing a claim for increased disability
        compensation online.
      </a>
      <button
        type="button"
        aria-label="Dismiss this announcement"
        onClick={dismiss}
        className="va-modal-close"
      >
        <i className="fa fa-close" />
      </button>
    </div>
  );
}
