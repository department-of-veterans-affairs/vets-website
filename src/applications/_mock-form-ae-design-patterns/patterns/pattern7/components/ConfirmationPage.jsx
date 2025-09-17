import React, { useEffect } from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { scrollToTop } from 'platform/utilities/scroll';

const ConfirmationPage = () => {
  useEffect(() => {
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '#',
            label: 'Custom home',
          },
          {
            href: '#',
            label: 'Disability Benefits',
          },
          {
            href: '#',
            label: 'File for disability compensation',
          },
        ]}
        homeVeteransAffairs
        label="Breadcrumb"
      />

      <FormTitle
        title="File for disability compensation"
        subTitle="VA Form 21-526EZ"
      />

      <div className="vads-u-margin-top--2">
        <va-alert status="success" visible>
          <h3 slot="headline">Form submission started on 9/22/2025</h3>
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
          <div>
            <strong>Date submitted</strong>
            <div>September 22, 2025</div>
          </div>
          <div>
            <strong>Conditions Claimed</strong>
            <ul>
              <li>
                <strong>Tinnitus</strong>
              </li>
              <li>
                <strong>Migraines</strong>
              </li>
            </ul>
          </div>
        </va-summary-box>
      </div>

      <div className="vads-u-margin-top--4">
        <h3>Print this confirmation page</h3>
        <p>
          You can print this page, which includes a summary of the information
          you submitted.
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
            <h2 className="vads-u-margin-top--0">Review Veteran Details</h2>
            <section
              aria-labelledby="contact-info-heading"
              className="vads-u-margin-top--0"
            >
              <h3 id="contact-info-heading" className="vads-u-margin-top--0">
                Veteran contact information
              </h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Phone number
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  <va-telephone contact="2023336688" not-clickable />
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Email address
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  L.jackson.vet@email.com
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Country
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  USA
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Street address
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  1700 Clairmont Rd
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  City
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Decatur
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  State
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  GA
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Postal code
                </dt>
                <dd className="vads-u-margin-left--0">30033-4032</dd>
              </dl>
            </section>

            <section
              aria-labelledby="housing-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="housing-heading">Housing situation</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Are you homeless or at risk of becoming homeless?
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  I'm at risk of becoming homeless.
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Name (contact person)
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Bob
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Phone number (contact person)
                </dt>
                <dd className="vads-u-margin-left--0">
                  <va-telephone contact="1231231234" not-clickable />
                </dd>
              </dl>
            </section>

            <section
              aria-labelledby="terminal-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="terminal-heading">Terminally ill</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Are you terminally ill?
                </dt>
                <dd className="vads-u-margin-left--0">Yes</dd>
              </dl>
            </section>

            <section
              aria-labelledby="alias-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="alias-heading">Service under another Name</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  First name
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Leslie
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Last name
                </dt>
                <dd className="vads-u-margin-left--0">Jones</dd>
              </dl>
            </section>

            <section
              aria-labelledby="military-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="military-heading">Military service history</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Branch of service
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Army
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Active service start date
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  January 1, 2000
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Active service end date
                </dt>
                <dd className="vads-u-margin-left--0">January 1, 2004</dd>
              </dl>
            </section>

            <section
              aria-labelledby="separation-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="separation-heading">Separation or severance pay</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Did you receive separation pay or disability severance pay?
                </dt>
                <dd className="vads-u-margin-left--0">Not specified</dd>
              </dl>
            </section>

            <section
              aria-labelledby="retirement-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="retirement-heading">Retirement pay</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Please choose the branch of service that gave you military
                  retired pay
                </dt>
                <dd className="vads-u-margin-left--0">Army</dd>
              </dl>
            </section>

            <section
              aria-labelledby="training-heading"
              className="vads-u-margin-top--3"
            >
              <h3 id="training-heading">Training pay</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Do you expect to receive active or inactive duty training pay?
                </dt>
                <dd className="vads-u-margin-left--0">Yes</dd>
              </dl>
            </section>

            <hr className="vads-u-margin-y--3" />

            <section
              aria-labelledby="conditions-heading"
              className="vads-u-margin-top--3"
            >
              <h2 id="conditions-heading" className="vads-u-margin-top--0">
                Conditions
              </h2>
              <h3>Review your conditions</h3>

              <div className="vads-u-margin-bottom--2">
                <h4 className="vads-u-margin-bottom--0">Migraines</h4>
                <div>
                  <strong className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                    Description
                  </strong>
                  <div className="vads-u-margin-left--0">
                    New condition; started January 2005; caused by combat.
                  </div>
                </div>
              </div>

              <div className="vads-u-margin-bottom--2">
                <h4 className="vads-u-margin-bottom--0">Tinnitus</h4>
                <div>
                  <strong className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                    Description
                  </strong>
                  <div className="vads-u-margin-left--0">
                    New condition; started February 2005; caused by combat too.
                  </div>
                </div>
              </div>
              <h3 id="toxic-exposure-heading">Toxic exposure</h3>

              <h4>Service After August 2, 1990</h4>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Did you serve in any of these Gulf War locations?
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Afghanistan, Iraq, Jordan
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Afghanistan service dates
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  January 3, 2001 - January 5, 2002
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Iraq service dates
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  February 2, 2002 - February 2, 2003
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Jordan service dates
                </dt>
                <dd className="vads-u-margin-left--0">
                  February 1, 2003 - February 1, 2004
                </dd>
              </dl>

              <h4 className="vads-u-margin-top--3">Service post-9/11</h4>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Did you serve in any of these Gulf War locations on or after
                  September 11, 2001?
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  The airspace above any of these locations
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Airspace service dates
                </dt>
                <dd className="vads-u-margin-left--0">
                  January 12, 2000 - January 24, 2002
                </dd>
              </dl>

              <h4 className="vads-u-margin-top--3">Agent Orange locations</h4>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Did you serve in any of these locations?
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Guam, American Samoa, or their territorial waters
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Other locations
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Korean DMZ
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Service dates for Guam, etc.
                </dt>
                <dd className="vads-u-margin-left--0">
                  January 3, 2003 - January 2, 2004
                </dd>
              </dl>

              <h4 className="vads-u-margin-top--3">Other toxic exposures</h4>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Have you been exposed to any of these hazards?
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Asbestos, Radiation
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Other toxic exposures
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  N/A
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Asbestos exposure dates
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  January 2, 2003 - February 2, 2004
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Radiation exposure dates
                </dt>
                <dd className="vads-u-margin-left--0">
                  February 4, 2002 - February 4, 2003
                </dd>
              </dl>
            </section>

            <hr className="vads-u-margin-y--3" />

            <section
              aria-labelledby="mh-heading"
              className="vads-u-margin-top--3"
            >
              <h2 id="mh-heading">Mental health statement</h2>

              <h3>
                Option to add a statement in support of mental health conditions
              </h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Do you want to add a statement in support of mental health
                  conditions?
                </dt>
                <dd className="vads-u-margin-left--0">
                  No, I don’t want to add this form to my claim
                </dd>
              </dl>
            </section>

            <hr className="vads-u-margin-y--3" />

            <section
              aria-labelledby="supporting-evidence-heading"
              className="vads-u-margin-top--3"
            >
              <h2
                id="supporting-evidence-heading"
                className="vads-u-margin-top--0"
              >
                Supporting evidence
              </h2>

              <h3 className="vads-u-margin-top--1">VA medical records</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Name of VA medical facility
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Mobile VA Clinic
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  When did you first visit this facility?
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  January 19, 2009
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Country
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  USA
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  State
                </dt>
                <dd className="vads-u-margin-left--0">AL</dd>
              </dl>

              <h3 className="vads-u-margin-top--3">Private medical records</h3>
              <dl className="vads-u-margin-top--1">
                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Name of private provider or hospital
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  Lakeview Hospital
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Street
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  4444 Oak Rd
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  First treatment date
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  January 1, 2009
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  City
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  mobile
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Last treatment date
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  January 2, 2009
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  State
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  AL
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Country
                </dt>
                <dd className="vads-u-margin-left--0 vads-u-margin-bottom--2">
                  USA
                </dd>

                <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                  Postal code
                </dt>
                <dd className="vads-u-margin-left--0">36619</dd>
              </dl>
            </section>

            <hr className="vads-u-margin-y--3" />

            <section
              aria-labelledby="additional-info-heading"
              className="vads-u-margin-top--3"
            >
              <h2 id="additional-info-heading" className="vads-u-margin-top--0">
                Additional information
              </h2>

              <h3 className="vads-u-margin-top--1">VA employee</h3>
              <dl className="vads-u-margin-top--1">
                <div className="vads-u-margin-bottom--2">
                  <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                    Are you currently a VA employee?
                  </dt>
                  <dd className="vads-u-margin-left--0">Not specified</dd>
                </div>
              </dl>

              <h3 className="vads-u-margin-top--3">Retirement pay waiver</h3>
              <dl className="vads-u-margin-top--1">
                <div className="vads-u-margin-bottom--2">
                  <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                    What type of pay you would like to receive?
                  </dt>
                  <dd className="vads-u-margin-left--0">
                    I want to receive VA compensation pay.
                  </dd>
                </div>
              </dl>

              <h3 className="vads-u-margin-top--3">Training pay waiver</h3>
              <dl className="vads-u-margin-top--1">
                <div className="vads-u-margin-bottom--2">
                  <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                    Selected
                  </dt>
                  <dd className="vads-u-margin-left--0">
                    I don’t want to get VA compensation pay for the days I
                    receive training pay.
                  </dd>
                </div>
              </dl>

              <h3 className="vads-u-margin-top--3">
                Fully developed claim program
              </h3>
              <dl className="vads-u-margin-top--1">
                <div className="vads-u-margin-bottom--2">
                  <dt className="vads-u-color--gray-medium vads-u-font-size--sm vads-u-font-weight--normal">
                    Do you want to apply using the Fully Developed Claim
                    program?
                  </dt>
                  <dd className="vads-u-margin-left--0">
                    No, I have some extra information that I’ll submit to VA
                    later.
                  </dd>
                </div>
              </dl>
            </section>
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
              This can take up to 30 days. When we receive your form, we’ll
              update the status on My VA.
            </p>

            <p>
              <va-link href="#" text="Check the status of your form on My VA" />
            </p>
          </va-process-list-item>
          <va-process-list-item pending header="Next, we'll review your form">
            <p>
              If we need more information after reviewing your form, we’ll
              contact you.
            </p>
          </va-process-list-item>
        </va-process-list>
      </div>

      <div className="vads-u-margin-top--4">
        <h3>How to contact us if you have questions</h3>
        <p>
          Call us at <va-telephone contact="8008271000" /> (
          <span>
            TTY: <va-telephone contact="711" tty />
          </span>
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.
        </p>
        <p>
          Or you can ask us a question online through Ask VA. Select the
          category and topic for the VA benefit this form is related to.
        </p>
        <p>
          <va-link
            href="https://ask.va.gov/"
            text="Contact us online through Ask VA"
            target="_blank"
            rel="noopener noreferrer"
          />
        </p>
        <h3>How long will it take VA to make a decision on my claim?</h3>
        <p>
          We process applications in the order we receive them. The amount of
          time it takes us to review your claim depends on:
        </p>
        <ul>
          <li>The type of claim you filed.</li>
          <li>
            How many injuries or conditions you claimed and how complex they
            are.
          </li>
          <li>
            How long it takes us to collect the evidence needed to decide your
            claim. We may contact you if we have questions or need more
            information.
          </li>
        </ul>

        <h3 id="dependents-heading">
          If I have dependents, how can I receive additional benefits?
        </h3>

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
          <va-link
            href="#"
            text="Download VA Form 21-686c (PDF, 15 pages)"
            className="vads-c-download-link"
          />
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
          </strong>
          &nbsp;you’ll need to fill out and submit a Request for Approval of
          School Attendance (VA Form 21-674) so we can verify their attendance.
        </p>

        <p>
          <va-link
            href="#"
            text="Download VA Form 21-674 (PDF, 3 pages)"
            className="vads-c-download-link"
          />
        </p>

        <p>
          <strong>If you have dependent parents,</strong> you may be entitled to
          additional payments. Fill out and submit a Statement of Dependency of
          Parent(s) (VA Form 21P-509).
        </p>

        <p>
          <va-link
            href="#"
            text="Download VA Form 21P-509 (PDF, 4 pages)"
            className="vads-c-download-link"
          />
        </p>
      </div>
      <div className="vads-u-margin-top--4">
        <va-need-help>
          <div slot="content">
            <p>
              If you have questions or need help filling out this form, please
              call us at <va-telephone contact="8008271000" />. We’re here
              Monday through Friday, 8:00 a.m to 9:00 p.m ET.
            </p>
            <p>
              If you have hearing loss, call <va-telephone contact="711" tty />.
            </p>
          </div>
        </va-need-help>
        <br />
      </div>
    </div>
  );
};

export default ConfirmationPage;
