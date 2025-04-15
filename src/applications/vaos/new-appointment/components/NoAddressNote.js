import React from 'react';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function NoAddressNote() {
  return (
    <p>
      <strong>Note:</strong> To show locations near your home, you need to add
      your home address to your VA profile.
      <br />
      <NewTabAnchor href="/profile/contact-information">
        Go to your VA.gov profile (opens in new tab)
      </NewTabAnchor>
    </p>
  );
}
