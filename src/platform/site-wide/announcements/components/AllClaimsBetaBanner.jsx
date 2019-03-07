import React from 'react';
import { features } from '../../../../applications/beta-enrollment/routes';
import environment from '../../../../platform/utilities/environment';

export default function AllClaimsBetaBanner({ dismiss, profile }) {
  // skip probability logic if user is enrolled
  if (!profile.services.includes(features.allClaims)) {
    // allow 1000-3000 users to see the banner
    // if user was selected, persist in localStorage
    // always show banner if not in production
    if (!localStorage.getItem('all-claims-beta')) {
      if (environment.isProduction() && Math.random() > 0.85) return null;
      localStorage.setItem('all-claims-beta', true);
    }
  }

  return (
    <div className="personalization-announcement">
      <span className="usa-label va-label-primary">New</span>{' '}
      <a onClick={dismiss} href="/beta-enrollment/all-claims/">
        Check out our new tool for filing a claim for disability compensation
        online.
      </a>
      <button
        type="button"
        aria-label="Dismiss this announcement"
        onClick={dismiss}
        className="va-modal-close"
      >
        <i className="fas fa-times-circle" />
      </button>
    </div>
  );
}
