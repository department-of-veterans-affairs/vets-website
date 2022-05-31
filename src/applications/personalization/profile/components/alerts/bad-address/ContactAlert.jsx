import React from 'react';

export default function ContactAlert() {
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
        <a href="#addresses">
          <i aria-hidden="true" className="fas fa-arrow-down" /> Review your
          mailing address
        </a>
      </p>
    </va-alert>
  );
}
