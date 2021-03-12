import React from 'react';

import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

function StemAskVAQuestions() {
  return (
    <div>
      <h2 className="help-heading">Need help?</h2>
      <h3 className="vads-u-font-size--h4">Ask a question</h3>
      <p>
        <a href="https://gibill.custhelp.va.gov/app/">Ask a question online</a>{' '}
        (Include your full name and VA file number)
      </p>
      <h3 className="vads-u-font-size--h4">Call us</h3>
      <p>Veterans Crisis Line: </p>
      <p>
        <Telephone contact={CONTACTS.CRISIS_LINE} /> and select 1
      </p>
      <br />
      <p>Education Call Center:</p>
      <p>
        <Telephone contact={CONTACTS.GI_BILL} /> (inside the U.S.)
      </p>
      <p>
        <Telephone contact={'19187815678'} pattern={PATTERNS.OUTSIDE_US} />{' '}
        (outside the U.S.)
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
      <h3 className="vads-u-font-size--h4">Send us mail</h3>
      <p>
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
