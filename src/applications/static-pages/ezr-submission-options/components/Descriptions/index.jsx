import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const PhoneDescription = () => {
  return (
    <p>
      Call our Health Eligibility Center at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> and select 1 (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re available Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      .
    </p>
  );
};

export const MailDescription = () => {
  return (
    <>
      <p>Fill out a Health Benefits Update Form (VA Form 10-10EZR).</p>
      <p>
        <va-link
          href="/find-forms/about-form-10-10ezr/"
          text="Get VA Form 10-10EZR to download"
        />
      </p>
      <p>
        Mail the completed form and any supporting documents to this address:
      </p>
      <p className="va-address-block">
        VA Health Eligibility Center
        <br role="presentation" />
        2957 Clairmont Road, Suite 200
        <br role="presentation" />
        Atlanta, GA 30329
      </p>
    </>
  );
};

export const InPersonDescription = () => {
  return (
    <>
      <p>You can update your information in person at a VA health facility.</p>
      <p>
        <va-link
          href="/find-locations/"
          text="Find your nearest VA health facility"
        />
      </p>
    </>
  );
};
