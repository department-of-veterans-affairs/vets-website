import React from 'react';

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
  if (!meetsCriteria(profile)) return null;

  return (
    <div>
      <h4 className="section-header">Beta tools</h4>
      <p>You’re invited to try our new online tools that make it easier to see important updates and keep your information current.</p>
      <a className="usa-button-primary" type="button" href="/beta-enrollment/personalization">Learn more</a>
    </div>
  );
}
