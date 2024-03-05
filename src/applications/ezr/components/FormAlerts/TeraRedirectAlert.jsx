import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const TeraRedirectAlert = () => (
  <>
    <va-alert
      status="error"
      class="vads-u-margin-bottom--5"
      data-testid="ezr-tera-alert-redirect"
      uswds
    >
      <h2 slot="headline">
        Veterans enrolled in VA health care and expansion of benefits
      </h2>
      <p>
        On <strong>March 5, 2024</strong>, we expanded health care to millions
        of Veterans.
      </p>
      <a href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/">
        Learn more about the PACT Act and VA health care and benefits
      </a>
      <p>
        Veterans who are enrolled in VA health care can now provide more
        information about their military service history. We’ll use this
        information to determine if you may have had exposure to any toxins or
        other hazards. And we’ll determine if we’ll place you in a higher
        priority group. This may affect how much (if anything) you’ll have to
        pay towards the cost of your care.
      </p>
      <p>
        These questions are only available on your PDF form at this time. If you
        want to answer these questions, you’ll need to submit your form by mail
        or in person.
      </p>
      <p>Fill out a Health Benefits Update Form (VA Form 10-10EZR).</p>
      <va-link
        href="/find-forms/about-form-10-10ezr/"
        text="Get VA Form 10-10EZR to download"
      />
      <p>Send your completed form here:</p>
      <p className="va-address-block">
        Health Eligibility Center
        <br role="presentation" />
        PO Box 5207
        <br role="presentation" />
        Janesville, WI 53547-5207
      </p>
      <p>Or you can bring your form to your nearest VA health facility.</p>
      <va-link
        href="/find-locations/"
        text="Find your nearest VA health facility"
      />
      <p>
        If you have trouble downloading your application, call our{' '}
        <a href="https://www.va.gov/">VA.gov</a> help desk at{' '}
        <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </va-alert>
  </>
);
