import React from 'react';
import dashboardManifest from '../../../../applications/personalization/dashboard/manifest.json';

export default function PersonalizationBanner({ dismiss, isLoggedIn }) {
  if (!isLoggedIn) return <div/>;
  return (
    <div className="personalization-announcement">
      <span className="usa-label va-label-primary">New</span> <a onClick={dismiss} href={dashboardManifest.rootUrl}>Check out your new personalized homepage</a>
      <button type="button" aria-label="Dismiss this announcement" onClick={dismiss} className="va-modal-close">
        <i className="fa fa-close"/>
      </button>
    </div>
  );
}
