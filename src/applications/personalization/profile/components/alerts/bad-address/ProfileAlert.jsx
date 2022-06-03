import React from 'react';
import { Link } from 'react-router-dom';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordBadAddressEvent } from './analytics';

export default function ProfileAlert() {
  return (
    <VaAlert
      status="warning"
      data-testid="bad-address-profile-alert"
      onVa-component-did-load={() => {
        recordBadAddressEvent({ location: 'profile' });
      }}
    >
      <h2 slot="headline">Review your mailing address</h2>
      <p>The mailing address we have on file for you may not be correct.</p>
      <p>
        <Link to="contact-information">
          Go to your contact information to review your address
        </Link>
      </p>
    </VaAlert>
  );
}
