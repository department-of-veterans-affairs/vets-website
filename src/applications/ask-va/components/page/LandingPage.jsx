/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
/* eslint-disable @department-of-veterans-affairs/telephone-contact-digits */
import React from 'react';

export default function LandingPage() {
  return (
    <div className="row va-flex">
      <h1>Ask VA</h1>

      <div className="va-introtext">
        <p>
          AVA is an online portal that allows Veterans, caregivers, and
          supporting personnel in education, debt, loans, etc. to submit
          questions to VA and receive a secure message response.
        </p>

        <p>
          <a href="/contact-us/ask-va-too/ask-a-question">CLICK ME!</a>
        </p>

        <p>This is a placeholder for the real landing page.</p>

        <p>
          AVA on the modernized VA.gov platform will be a digital support
          channel that works with other tools and features on VA.gov and VA
          ecosystem to quickly and accurately answer users' questions. Users
          should feel it is easy and intuitive to submit their issues and
          receive adequate updates and information that results in a final
          resolution. Ultimately, we want AVA to feel part of a cohesive and
          user-centric approach to support.
        </p>
      </div>

      <h2>We’re Currently in Devlopment Mode</h2>

      <p>Some amazing text goes here.</p>
    </div>
  );
}
