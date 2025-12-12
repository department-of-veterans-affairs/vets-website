import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import recordEvent from 'platform/monitoring/record-event';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function StemAskVAQuestions() {
  const handler = {
    recordLinkClick: () => {
      recordEvent({
        event: 'nav-ask-va-questions-link-click',
        'ask-va-questions-header': 'Need help',
      });
    },
  };

  return (
    <div>
      <h2 className="help-heading">Need help?</h2>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        Ask a question
      </h3>
      <p className="vads-u-padding-top--1px">
        <VaLink
          data-testid="contact-us-online-through-ask-va-link"
          href="https://www.va.gov/contact-us/"
          onClick={handler.recordLinkClick}
          text="Contact us online through Ask VA"
        />
      </p>
      <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        Call us
      </h3>
      <p className="vads-u-padding-top--1px">Veterans Crisis Line: </p>
      <p>
        <va-telephone contact={CONTACTS.CRISIS_LINE} /> and select 1
      </p>
      <br />
      <p>Education Call Center:</p>
      <p>
        <va-telephone contact={CONTACTS.GI_BILL} />
        <span id="inside-US-tele">(inside the U.S.)</span>
      </p>
      <p>
        <va-telephone contact="9187815678" international />
        <span id="outside-US-tele">(outside the U.S.)</span>
      </p>
      <p>
        TTY, Federal Relay: <va-telephone contact={CONTACTS[711]} />
      </p>
      <br />
      <p>
        <VaLink
          data-testid="va-regional-office-location-link"
          href="/find-locations"
          onClick={handler.recordLinkClick}
          text="VA Regional Office Location"
        />
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
