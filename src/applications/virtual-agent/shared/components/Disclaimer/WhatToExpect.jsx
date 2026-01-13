import React from 'react';

function CantDo() {
  return (
    <>
      <p>
        <b>Our chatbot can’t do any of these things:</b>
      </p>

      <ul>
        <li>Determine if you have a medical or mental health condition</li>
        <li>
          Provide medical or mental health advice, treatment, or counseling
        </li>
        <li>
          Answer questions or take reports about your prescriptions or side
          effects
        </li>
        <li>Help you with a personal, medical, or mental health emergency</li>
        <li>Transfer you directly to one of our call center representatives</li>
        <li>Help you sign in to VA.gov</li>
      </ul>
    </>
  );
}

function Links() {
  return (
    <>
      <p>
        &ensp;
        <a href="/resources/helpful-va-phone-numbers/">
          Call us at one of our helpful VA phone numbers to speak to a
          representative
        </a>
        <br />
        &ensp;
        <a href="/resources/signing-in-to-vagov/">
          Learn how to sign in to VA.gov
        </a>
      </p>
    </>
  );
}

export default function WhatToExpect() {
  return (
    <>
      <h4 slot="headline">What to expect when using our chatbot</h4>
      <p>
        Our chatbot is a resource to help you quickly find information about VA
        benefits and services. You won’t communicate with an actual
        representative through the chatbot. If you need help with any of the
        issues listed here, you’ll need to speak with a health care professional
        or one of our representatives. You can also visit our resources and
        support section for more information.
      </p>
      <CantDo />
      <Links />
    </>
  );
}
