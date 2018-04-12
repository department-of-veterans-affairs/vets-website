import React from 'react';
import dashboardManifest from '../../personalization/dashboard-beta/manifest.json';

// If it's production, check the dashboard manifest.json production flag
const enabled = document.location.hostname === 'www.vets.gov' ? dashboardManifest.production : true;
const eligibleServices = [
  'evss-claims',
  'appeals-status',
  'messaging',
  'rx'
];

function meetsCriteria(profile) {
  return profile.services.some(service => {
    return eligibleServices.includes(service);
  });
}

export default function PersonalizationBetaInvite({ profile }) {
  if (!enabled || !meetsCriteria(profile)) return null;

  return (
    <div>
      <h4 className="section-header">Beta tools</h4>
      <p>You’re invited to try our new online tools that make it easier to see important updates and keep your information current.</p>
      <a className="usa-button-primary" type="button" href="/beta-enrollment/personalization">Learn more</a>
    </div>
  );
}
