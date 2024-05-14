import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
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

export default GetFormHelp;
