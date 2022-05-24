import React from 'react';
import { Link } from 'react-router-dom';

export default function secondary() {
  return (
    <va-alert status="warning">
      <h2 slot="headline">Review your mailing address</h2>
      <p>The mailing address we have on file for you may not be correct.</p>
      <p>
        <Link to="/contact-information">
          Go to your contact information to review your address
        </Link>
      </p>
    </va-alert>
  );
}
