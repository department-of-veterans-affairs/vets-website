/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
/* eslint-disable @department-of-veterans-affairs/telephone-contact-digits */
import React from 'react';

export default function LandingPage() {
  return (
    <div className="row va-flex">
      <div>
        <h1>Ask VA</h1>

        <div className="va-introtext">
          <p>
            AVA is an online portal that allows Veterans, caregivers, and
            supporting personnel in education, debt, loans, etc. to submit
            questions to VA and receive a secure message response.
          </p>

          <p>
            <a href="/contact-us/ask-va-too/inquiry">CLICK ME!</a>
          </p>

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

        <h2>Before you start</h2>

        <p>
          <b>If you think your life or health is in danger,</b>
           go to the nearest emergency room or call 911. If you’re not sure if
          your condition is an emergency, contact your primary care provider.
          <br />{' '}
          <a href="/find-locations">Find your nearest VA health facility</a>
          <br />{' '}
          <a href="/initiatives/emergency-room-911-or-urgent-care/">
            Learn more about emergency medical care at VA
          </a>
        </p>

        <va-additional-info
          trigger="How to get help if you’re in crisis and need to talk with someone right
          away"
        >
          <p>
            If you’re a Veteran in crisis or concerned about one, connect with our
            caring, qualified Veterans Crisis Line responders for confidential
            help. Many of them are Veterans themselves. This service is private,
            free, and available 24/7.
          </p>
          <p>
            To connect with a Veterans Crisis Line responder anytime day or night:
            <ul>
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
                If you have hearing loss, call TTY:{' '}
                <va-telephone contact="8007994889" tty />.
              </li>
            </ul>
          </p>
        </va-additional-info>
      </div>
    </div>
  );
}
