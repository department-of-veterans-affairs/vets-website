import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import React from 'react';

function Links() {
  return (
    <ul>
      <li>
        <a href="/resources/helpful-va-phone-numbers/">
          Call us at one of our helpful VA phone numbers
        </a>
      </li>
      <li>
        <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
      </li>
      <li>
        <a href="/resources/">Explore our resources and support content</a>
      </li>
    </ul>
  );
}

export default function BetaTesting() {
  return (
    <>
      <h2>We’re currently in beta testing</h2>
      <p>
        Welcome to our chatbot, a new part of{' '}
        <a href="https://va.gov/">VA.gov</a>. We're still building the bot's
        ability to respond to your questions, so it won't have answers to every
        question.
      </p>
      <p>
        If you’re a Veteran in crisis or concerned about one, connect with our
        caring, qualified Veterans Crisis Line responders for confidential help.
        Many of them are Veterans themselves. This service is private, free, and
        available 24/7.
      </p>
      <p className="vads-u-margin-bottom--0">
        To connect with a Veterans Crisis Line responder anytime day or night:
      </p>
      <ul className="vads-u-margin-top--0">
        <li>
          Dialing <va-telephone contact="988" /> and press 1.
        </li>
        <li>
          Calling <va-telephone contact={CONTACTS.CRISIS_LINE} /> and press 1.
        </li>
        <li>
          Texting <va-telephone contact="838255" />.
        </li>
        <li>
          If you have hearing loss, call{' '}
          <va-telephone contact={CONTACTS.CRISIS_TTY} tty />.
        </li>
      </ul>
      <p>
        <strong>
          If you have questions about VA benefits and services that our chatbot
          can’t answer right now,{' '}
        </strong>
        you can get the information in any of these ways:
        <Links />
      </p>
    </>
  );
}
