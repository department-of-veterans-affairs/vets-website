import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function GetFormHelp() {
  // Is the current page a confirmation page under a CHAMPVA form?
  const isChampvaConfirmation = /.*champva.*confirmation(\/)?$/.test(
    window.location.href,
  );

  // Don't show footers on CHAMPVA confirmation pages (we still want them
  // on all other pages though).
  return isChampvaConfirmation ? (
    <div className="row vads-u-margin-bottom--4" />
  ) : (
    <div className="row vads-u-margin-bottom--4">
      <div className="form-panel">
        <h2 className="vads-u-font-size--h3">Need help?</h2>
        <hr className="vads-u-margin-y--0 vads-u-border-bottom--2px vads-u-border-top--0px vads-u-border-color--primary" />
        <p className="help-talk">
          <strong>If you have trouble using this online form,</strong> call us
          at <va-telephone contact={CONTACTS.HELP_DESK} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here 24/7.
        </p>
        <p className="help-talk">
          <strong>
            If you need help gathering your information or filling out this
            form,
          </strong>{' '}
          contact a local Veterans Service Organization (VSO).
        </p>
        <va-link
          href="https://va.gov/vso/"
          text="Find a local Veterans Service Organization"
        />
      </div>
    </div>
  );
}
