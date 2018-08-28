import React from 'react';
import backendServices from '../../../../platform/user/profile/constants/backendServices';

export default function ClaimIncreaseBanner({ dismiss, isLoggedIn, profile }) {
  if (!isLoggedIn) return <div/>;
  if (!profile.services.includes(backendServices.CLAIM_INCREASE_AVAILABLE)) return <div/>;

  return (
    <div className="personalization-announcement">
      <span className="usa-label va-label-primary">New</span> <a onClick={dismiss} href="/beta-enrollment/claim-increase">Check out the new claim increase form</a>
      <button type="button" aria-label="Dismiss this announcement" onClick={dismiss} className="va-modal-close">
        <i className="fa fa-close"/>
      </button>
    </div>
  );
}
