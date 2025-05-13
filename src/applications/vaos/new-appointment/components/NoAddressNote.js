import React from 'react';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function NoAddressNote() {
  return (
    <p>
      <strong>Note:</strong> To sort your facilities by closest to your home,
      add your home address to your VA profile.
      <br />
      <NewTabAnchor href="/profile/contact-information">
        Manage your contact information (opens in new tab)
      </NewTabAnchor>
    </p>
  );
}
