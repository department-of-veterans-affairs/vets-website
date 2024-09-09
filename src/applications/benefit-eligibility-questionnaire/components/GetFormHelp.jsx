import React from 'react';

export default function() {
  return (
    <>
      <p className="help-talk">
        <strong>If you have trouble using this online form,</strong> call us at{' '}
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We&rsquo;re here 24/7.
      </p>
      <p className="help-talk">
        <strong>
          If you need help gathering your information or filling out this form,
        </strong>{' '}
        contact a local Veterans Service Organization (VSO).
      </p>
      <va-link
        href="https://va.gov/vso/"
        text="Find a local Veterans Service Organization"
      />
    </>
  );
}
