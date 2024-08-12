import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetHelp = () => (
  <>
    <p className="help-talk">
      <strong>If you have trouble using this online application</strong>, call
      our MyVA411 main information line at{' '}
      <va-telephone contact={CONTACTS.HELP_DESK} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here 24/7.
    </p>

    <p className="help-talk">
      <strong>You can call the VA Caregiver Support Line</strong> at{' '}
      <va-telephone contact={CONTACTS.CAREGIVER} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). Or you can contact a Caregiver Support Program Team.{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.caregiver.va.gov/support/New_CSC_Page.asp"
      >
        Go to our Caregiver Support Program Teams directory
      </a>
    </p>

    <p className="help-talk">
      <strong>
        You can call the Enrollment and Eligibility Division of the Health
        Eligibility Center
      </strong>{' '}
      at <va-telephone contact={CONTACTS.HEALTHCARE_ELIGIBILITY_CENTER} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ), Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      .
    </p>
  </>
);

export default GetHelp;
