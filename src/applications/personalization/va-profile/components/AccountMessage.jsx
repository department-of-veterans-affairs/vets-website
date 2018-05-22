import React from 'react';
import accountManifest from '../../account/manifest.json';
import recordEvent from '../../../../platform/monitoring/record-event';

export default function AccountMessage() {
  return (
    <div>
      <h3>Want to update the email you use to sign in to Vets.gov?</h3>
      <a href={accountManifest.rootUrl} onClick={() => { recordEvent({ event: 'profile-navigation', 'profile-action': 'view-link', 'profile-section': 'account-settings' }); }}>Go to your account settings</a>
    </div>
  );
}
