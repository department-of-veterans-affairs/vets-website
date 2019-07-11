import React from 'react';
import accountManifest from '../../account/manifest.json';

export default function AccountMessage() {
  return (
    <div>
      <h3>Want to update the email you use to sign in to VA.gov?</h3>
      <a href={accountManifest.rootUrl}>Go to your account settings</a>
    </div>
  );
}
