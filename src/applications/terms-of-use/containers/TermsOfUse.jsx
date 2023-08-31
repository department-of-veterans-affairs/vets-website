import React from 'react';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
]);
const formatOrdinals = n => {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
};

export default function TermsOfUse() {
  return (
    <section className="vads-l-grid-container vads-u-padding-y--5 vads-u-padding-x--0">
      <div className="usa-content">
        <h1>VA online services terms of use</h1>
        <p className="va-introtext">
          To sign in to VA.gov and most other VA online services, you’ll need to
          accept the terms of use. We recently updated the terms. Read the
          updated terms on this page. Then confirm if you accept or not.
        </p>
        <article>
          <va-on-this-page />
          <div>
            <p>
              Version: 1<br />
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p>
              If you want to save or print the terms, you can download a copy
              now.
            </p>
            <va-link
              href="#download"
              download
              fileType="PDF"
              pages={6}
              text="Download VA online services terms of use"
            />
          </div>
          <h2 id="terms-of-use">Terms of use</h2>
          <p>
            The Department of Veterans Affairs (VA) owns and manages VA.gov and
            the My HealtheVet health management portal. VA.gov allows you to use
            online tools that display parts of your personal health information.
            This health information is only displayed on VA.gov &mdash; the
            information is stored on VA protected federal computer systems and
            networks. VA supports the secure storage and transmission of all
            information on VA.gov.
          </p>
          <div>
            <va-accordion bordered>
              {Array.from({
                length: 7,
              }).map((_, i) => (
                <va-accordion-item
                  header={`${formatOrdinals(i + 1)}`}
                  level={3}
                  key={i}
                >
                  This is some long summary that needs to see some information
                  for {formatOrdinals(i + 1)} one
                </va-accordion-item>
              ))}
            </va-accordion>
          </div>
          <h2 id="getting-va-benefits-and-services">
            Getting VA benefits and services if you don’t accept
          </h2>
          <p>
            Your decision to decline these terms won’t affect your eligibility
            for VA health care and benefits in any way. You can still get VA
            health care and benefits in-person without using online services. If
            you need help or have questions, <SubmitSignInForm /> We’re here
            24/7.
          </p>
          <va-alert status="warning" visible>
            <h3 slot="headline" id="what-happens-if-you-decline">
              What will happen if you decline?
            </h3>
            <p>
              If you decline these terms, we'll automatically sign you out and
              take you back to the VA.gov homepage. And you won't be able to
              sign in to use tools on these VA websites:
            </p>
            <ul>
              <li>VA.gov</li>
              <li>My HealtheVet</li>
              <li>My VA Health</li>
            </ul>
            <p>
              This means you won’t be able to do these types of things using VA
              online services:
            </p>
            <ul>
              <li>Apply for some benefits</li>
              <li>Check your claim status</li>
              <li>Send messages to your VA health care providers</li>
              <li>Refill your prescriptions</li>
              <li>Update your personal information</li>
            </ul>
          </va-alert>
          <h2 id="do-you-accept-of-terms-of-use">
            Do you accept these terms of use?
          </h2>
          <va-button
            text="Accept"
            onClick={() => {}}
            ariaLabel="I accept to VA online serivices terms of use"
          />
          <va-button
            text="Decline"
            secondary
            ariaLabel="I decline to VA online serivices terms of use"
            onClick={() => {}}
          />
        </article>
      </div>
    </section>
  );
}
