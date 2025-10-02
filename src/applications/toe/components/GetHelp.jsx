import React from 'react';

export default function GetHelp() {
  return (
    <div className="help-talk">
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
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We're here 24/7.
      </p>
    </div>
  );
}
