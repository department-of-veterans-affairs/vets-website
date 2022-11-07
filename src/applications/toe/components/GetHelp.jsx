import React from 'react';

export default function GetHelp() {
  return (
    <>
      <p className="help-talk">
        If you need help with your application or have questions about
        enrollment or eligibility, submit a request with{' '}
        <a target="_blank" href="https://ask.va.gov/" rel="noreferrer">
          {' '}
          Ask VA.
        </a>{' '}
        <br />
        <br />
        If you have technical difficulties using this online application, call
        our MyVA411 main information line at{' '}
        <va-telephone contact="8006982411" /> (TTY:{' '}
        <va-telephone contact="711" />
        ). We're here 24/7.
      </p>
    </>
  );
}
