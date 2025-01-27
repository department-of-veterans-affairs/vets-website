import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => (
  <>
    <p>
      <strong>If you have trouble using this online form,</strong> call us at{' '}
      <va-telephone contact={CONTACTS.GI_BILL} international not-clickable />.
    </p>
    <p>
      <strong>
        If you need help gathering your information or filling out your form,{' '}
      </strong>
      <va-link
        text="visit Education Liaison Representatives - Education and Training."
        href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp"
      />
    </p>
  </>
);

export default GetFormHelp;
