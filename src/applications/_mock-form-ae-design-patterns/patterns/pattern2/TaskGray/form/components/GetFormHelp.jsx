import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const GetFormHelp = () => {
  const isReview = window.location.pathname.includes('review-then-submit');

  return !isReview ? (
    <p className="help-talk">
      Call us at <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here
      Monday through Friday, 8:00 a.m. to 9:00 p.m. ET. If you have hearing
      loss, call <va-telephone contact={CONTACTS[711]} tty />
    </p>
  ) : (
    <>
      <p className="help-talk">
        <strong>If you have trouble using this online form,</strong> call us at{' '}
        <va-telephone contact={CONTACTS.HELP_DESK} />. We’re here 24/7.
      </p>
      <p className="help-talk">
        <strong>
          If you need help gathering your information or filling out your form,
        </strong>{' '}
        contact a local Veteran Service Organization (VSO).
      </p>
      <va-link href="" text="Find a local Veterans Service Organization" />
    </>
  );
};
