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
        <b>
          If you have questions about VA benefits and services that our chatbot
          can’t answer right now,{' '}
        </b>
        you can get the information in any of these ways:
      </p>
      <Links />
    </>
  );
}
