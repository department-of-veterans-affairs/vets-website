import React from 'react';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      <strong>If you have trouble using this online form</strong>, call us at{' '}
      <va-telephone contact="8006982411" /> (<va-telephone tty contact="711" />
      ). We’re here 24/7.
    </p>
    <p>
      <strong>
        If you need help gathering your information or filling out your form
      </strong>
      , contact a local Veterans Service Organization (VSO).
    </p>
    <va-link
      text="Find a local
        Veterans Service Organization"
      label="Find a local
        Veterans Service Organization"
      href="/get-help-from-accredited-representative"
    />
  </>
);

export default GetFormHelp;
