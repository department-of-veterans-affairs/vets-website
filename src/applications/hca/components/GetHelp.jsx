import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetHelp = () => (
  <>
    <p className="help-talk">
      <strong> If you have trouble using this online application,</strong> call
      our MyVA411 main information line at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>
    <p className="help-talk">
      <strong>
        If you’re trying to apply by the September 30th special enrollment
        deadline for certain combat Veterans
      </strong>
      , you can also apply in other ways. Call us at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} />. We’re here Friday,
      September 29, 7:00 a.m. to 9:00 p.m.{' '}
      <dfn>
        <abbr title="Central Time">CT</abbr>
      </dfn>
      , and Saturday, September 30, 7:00 a.m. to 11:59 p.m.{' '}
      <dfn>
        <abbr title="Central Time">CT</abbr>
      </dfn>
      . Mail us an application postmarked by September 30, 2023. Or bring your
      application in person to your nearest VA health facility.{' '}
      <a href="/health-care/how-to-apply/">
        Learn more about how to apply by phone, mail, or in person
      </a>
      .
    </p>
    <p className="help-talk">
      <strong>
        If you need help to gather your information or fill out your
        application,{' '}
      </strong>
      <va-link
        href="/vso/"
        text="contact a local Veterans Service Organization (VSO)"
      />
      .
    </p>
    <p className="help-talk">
      <strong>If you have questions about VA health care,</strong> call our
      Health Eligibility Center at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      .
    </p>
  </>
);

export default GetHelp;
