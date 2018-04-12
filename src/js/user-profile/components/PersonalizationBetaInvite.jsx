import React from 'react';

function meetsCriteria(profile) {
  return true;
}

export default function PersonalizationBetaInvite({ profile }) {
  if (!meetsCriteria(profile)) return null;

  return (
    <div>
      <h4 className="section-header">Beta tools</h4>
      <p>You’re invited to try our new online tools that make it easier to see important updates and keep your information current.</p>
      <a type="button" href="/beta-enrollment/personalization">Learn more</a>
    </div>
  )
}
