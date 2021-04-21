import React from 'react';

import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function StemAskVAQuestions() {
  return (
    <div>
      <h2 className="help-heading">Need help?</h2>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        Ask a question
      </h3>
      <p className="vads-u-padding-top--1px">
        <a href="https://gibill.custhelp.va.gov/app/">Ask a question online</a>{' '}
        (Include your full name and VA file number)
      </p>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        Call us
      </h3>
      <p className="vads-u-padding-top--1px">Veterans Crisis Line: </p>
      <p>
        <Telephone contact={CONTACTS.CRISIS_LINE} /> and select 1
      </p>
      <br />
      <p>Education Call Center:</p>
      <p>
        <span
          aria-describedby="inside-US-tele"
          className="no-wrap"
          href="tel:+18884424551"
          aria-label="8 8 8. 4 4 2. 4 5 5 1."
        >
          <Telephone contact={CONTACTS.GI_BILL} />
        </span>{' '}
        <span id="inside-US-tele">(inside the U.S.)</span>
      </p>
      <p>
        <span
          aria-describedby="outside-US-tele"
          className="no-wrap"
          href="tel:+19187815678"
          aria-label="9 1 8. 7 8 1. 5 6 7 8."
        >
          <Telephone contact={'19187815678'} pattern={PATTERNS.OUTSIDE_US} />
        </span>{' '}
        <span id="outside-US-tele">(outside the U.S.)</span>
      </p>
      <br />
      <p>
        <a href="https://www.va.gov/find-locations">
          VA Regional Office Location
        </a>
      </p>
      <br />
      <p>
        TTY, Federal Relay:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />
      </p>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        Send us mail
      </h3>
      <p className="vads-u-padding-top--1px">
        Include your full name and VA file number on the inside of mailed
        correspondence, not on envelope.
      </p>
      <br />
      <p>Mailing Address:</p>
      Department of Veteran Affairs
      <p>Buffalo Regional Office</p>
      <p />
      PO Box 4616
      <p>Buffalo, New York 14240-4616</p>
    </div>
  );
}

export default StemAskVAQuestions;
