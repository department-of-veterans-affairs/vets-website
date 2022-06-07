import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordBadAddressEvent } from './analytics';

export default function ContactAlert() {
  return (
    <VaAlert
      status="warning"
      data-testid="bad-address-contact-alert"
      onVa-component-did-load={() => {
        recordBadAddressEvent({ location: 'contact' });
      }}
      className="vads-u-margin-bottom--4"
    >
      <h2
        slot="headline"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="alert"
        aria-live="polite"
        aria-label="The address we have on file for you may not be correct."
      >
        Review your mailing address
      </h2>
      <p>
        The address we have on file for you may not be correct. Select{' '}
        <strong className="vads-u-font-weight--bold">Edit</strong> to review
        your address. After you correct your address, or if it's already
        correct, select{' '}
        <strong className="vads-u-font-weight--bold">Update</strong> to confirm.
      </p>
      <p>
        <a href="#mailing-address">
          <i aria-hidden="true" className="fas fa-arrow-down" /> Review your
          mailing address
        </a>
      </p>
    </VaAlert>
  );
}
