import React from 'react';
import { Link } from 'react-router-dom';

export default function full() {
  return (
    <va-alert status="warning">
      <h2 slot="headline">Review your mailing address</h2>
      <p>
        The address we have on file for you may not be correct. Select{' '}
        <strong className="vads-u-font-weight--bold">Edit</strong> to review
        your address. After you correct your address, or if it's already
        correct, select{' '}
        <strong className="vads-u-font-weight--bold">Update</strong> to confirm.
      </p>
      <p>
        <Link to="/contact-information">
          Go to your contact information to review your address
        </Link>
      </p>
    </va-alert>
  );
}
