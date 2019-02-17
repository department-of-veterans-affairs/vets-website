import React from 'react';

export default function AllClaimsBetaBanner({ dismiss }) {
  // only allow a small percentage of users to see the banner
  // if user was selected, persist in localStorage
  if (!localStorage.getItem('all-claims-beta')) {
    if (Math.random() > 0.01) return null;
    localStorage.setItem('all-claims-beta', true);
  }

  return (
    <div className="personalization-announcement">
      <span className="usa-label va-label-primary">New</span>{' '}
      <a
        onClick={dismiss}
        href="/disability-benefits/apply/form-526-all-claims/"
      >
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
