import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

function GetFormHelp1995() {
  return (
    <div className="help-talk">
      <>
        <p className="vads-u-margin-top--0">
          If you need help with your application or have questions about
          enrollment or eligibility,{' '}
          <va-link
            href="https://ask.va.gov/"
            external
            text="submit a request with Ask VA"
          />
          .
        </p>
        <p className="vads-u-margin-bottom--0">
          If you have technical difficulties using this online application, call
          our MyVA411 main information line at{' '}
          <va-telephone contact={CONTACTS.VA_411} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We're here 24/7.
        </p>
      </>
    </div>
  );
}

export default GetFormHelp1995;
