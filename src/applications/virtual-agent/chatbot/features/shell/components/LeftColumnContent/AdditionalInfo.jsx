import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import React from 'react';

function CrisisLine() {
  return (
    <>
      <p className="vads-u-margin-bottom--1">
        To connect with a Veterans Crisis Line responder anytime day or night:
      </p>
      <ul className="vads-u-margin-top--0">
        <li>
          Dialing <va-telephone contact="988" /> and press 1.
        </li>
        <li>
          Calling <va-telephone contact="8002738255" /> and press 1.
        </li>
        <li>
          Texting <va-telephone contact="838255" />.
        </li>
        <li>
          If you have hearing loss, call{' '}
          <va-telephone contact={CONTACTS.SUICIDE_PREVENTION_LIFELINE} tty />.
        </li>
      </ul>
    </>
  );
}

export default function AdditionalInfo() {
  return (
    <va-additional-info
      trigger="How to get help if you’re in crisis and need to talk with someone right
        away"
    >
      <p>
        If you’re a Veteran in crisis or concerned about one, connect with our
        caring, qualified Veterans Crisis Line responders for confidential help.
        Many of them are Veterans themselves. This service is private, free, and
        available 24/7.
      </p>
      <CrisisLine />
    </va-additional-info>
  );
}
