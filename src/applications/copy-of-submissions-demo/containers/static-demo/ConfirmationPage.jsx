import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const ConfirmationPage = () => (
  <article className="schemaform-intro">
    <FormTitle
      title="File for disability compensation"
      subTitle="VA Form 21-526EZ"
    />
    <div className="vads-u-margin-top--2">
      <va-alert status="success" visible>
        <h4 slot="headline">Form submission started on 8/27/2025</h4>
        <p>Your submission is in progress.</p>
        <p>
          It may take up to 10 days for us to receive your form in our system.
          We’ll send you an email to confirm your submission.
        </p>
        <p>There’s nothing else you need to do right now.</p>
        <va-link-action
          href="#"
          text="Check the status of your form on My VA"
          type="primary"
        />
      </va-alert>
    </div>
    <div className="vads-u-margin-top--4">
      <va-summary-box>
        <h3 slot="headline">
          Disability Compensation Claim (VA Form 21-526EZ)
        </h3>
        <p>For Leslie Jackson</p>
        <p>
          <strong>Date submitted</strong>
          <br />
          August 27, 2025
        </p>
        <p>
          <strong>Conditions Claimed</strong>
          <ul>
            <li>
              <strong>Tinnitus</strong>
            </li>
            <li>
              <strong>Migraines</strong>
            </li>
          </ul>
        </p>
      </va-summary-box>
    </div>
    <div className="vads-u-margin-top--4">
      <h3>Print this confirmation page</h3>
      <p>
        You can print this page, which includes a summary of the information you
        submitted.
      </p>
      <va-button onClick={() => window.print()} text="Print this page" />
    </div>
    <div className="vads-u-margin-top--4">
      <va-accordion open-single className="vads-u-margin-top--2">
        <va-accordion-item
          bordered
          header="Information you submitted on this form"
          id="first"
        >
          <p>
            Congress shall make no law respecting an establishment of religion,
            or prohibiting the free exercise thereof; or abridging the freedom
            of speech, or of the press; or the right of the people peaceably to
            assemble, and to petition the Government for a redress of
            grievances.
          </p>
          <hr className="vads-u-border--1px vads-u-border-color--gray-light vads-u-margin-y--2" />
          <div>
            <h3>H3 Title</h3>
            <ul className="vads-u-padding--0" style={{ listStyle: 'none' }}>
              <li>Something</li>
            </ul>
          </div>
        </va-accordion-item>
      </va-accordion>
    </div>
    <div className="vads-u-margin-top--4">
      <h3>What to expect</h3>
      <va-process-list>
        <va-process-list-item
          active
          header="Now, we'll confirm that we've received your form"
        >
          <p>
            This can take up to 30 days. When we receive your form, we’ll update
            the status on My VA.
          </p>
          <p>
            <a href="http://localhost:3001/mock-copy-of-submission/introduction">
              Check the status of your form on My VA
            </a>
          </p>
        </va-process-list-item>
        <va-process-list-item pending header="Next, we'll review your form">
          <p>
            If we need more information after reviewing your form, we’ll contact
            you.
          </p>
        </va-process-list-item>
      </va-process-list>
    </div>
    <div className="vads-u-margin-top--4">
      <h3>How to contact us if you have questions</h3>
      <p>
        Call us at . We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
      </p>
      <p>
        Or you can ask us a question online through Ask VA. Select the category
        and topic for the VA benefit this form is related to.
      </p>
      <p>
        <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
      </p>
      <h3>How long will it take VA to make a decision on my claim?</h3>
      <p>
        We process applications in the order we receive them. The amount of time
        it takes us to review your claim depends on:
      </p>
      <ul>
        <li>The type of claim you filed.</li>
        <li>
          How many injuries or conditions you claimed and how complex they are.
        </li>
        <li>
          How long it takes us to collect the evidence needed to decide your
          claim. We may contact you if we have questions or need more
          information.
        </li>
      </ul>
      <h3>If I have dependents, how can I receive additional benefits?</h3>
      <p>
        <strong>If you have a spouse or child,</strong> you may be entitled to
        additional payments.
      </p>
      <p>
        <va-link-action
          href="#"
          text="Apply online to add a dependent"
          type="secondary"
        />
      </p>
      <p>
        Or you can fill out and submit an Application Request to Add and/or
        Remove Dependents (VA Form 21-686c)
      </p>
      <p>
        <a href="https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf">
          Download VA Form 21-686c (PDF, 15 pages)
        </a>
      </p>
      <p>
        <strong>Note:</strong> If you’re claiming your child who became
        permanently disabled before they turned 18, you’ll need to submit all
        military and private medical records relating to the child’s
        disabilities with your application.
      </p>
      <p>
        <strong>
          If you’re claiming a child who’s between 18 and 23 years old and
          attending school full time,
        </strong>{' '}
        you’ll need to fill out and submit a Request for Approval of School
        Attendance (VA Form 21-674) so we can verify their attendance.
      </p>
      <p>
        <a href="https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf">
          Download VA Form 21-674 (PDF, 3 pages)
        </a>
      </p>
    </div>
  </article>
);

export default ConfirmationPage;
