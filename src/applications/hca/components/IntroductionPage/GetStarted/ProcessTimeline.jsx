import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ProcessTimeline = () => (
  <>
    <h2 data-testid="hca-timeline-heading">
      What to know before you fill out this form
    </h2>

    <va-process-list uswds>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-top--2">
          Make sure you meet our eligibility requirements for enrollment before
          you apply.
        </p>
        <p>
          <strong>Note:</strong> We can help connect you with mental health
          care&mdash;no matter your discharge status, service history, or
          eligibility for VA health care.{' '}
          <va-link
            href="/health-care/health-needs-conditions/mental-health/"
            text="Find out how to get mental health care"
          />
        </p>
        <va-additional-info
          trigger="What are the eligibility requirements to enroll in VA health care?"
          uswds
        >
          <p>
            You may be eligible to enroll in VA health care if all of these
            statements are true:
          </p>
          <ul>
            <li>
              You served in the active military, naval, or air service
              (including being called up from the National Guard or Reserve by a
              federal order), <strong>and</strong>
            </li>
            <li>
              You didn’t receive a dishonorable discharge, <strong>and</strong>
            </li>
            <li>
              You meet at least one of the service requirements for enrollment
            </li>
          </ul>

          <p>You must meet at least one of these service requirements:</p>
          <ul>
            <li>
              You served at least 24 months in a row without a break (called
              continuous), or for your full active-duty period,{' '}
              <strong>or</strong>
            </li>
            <li>
              You were discharged for a service-connected disability,{' '}
              <strong>or</strong>
            </li>
            <li>
              You were discharged for a hardship or “early out,”{' '}
              <strong>or</strong>
            </li>
            <li>You served before September 7, 1980</li>
          </ul>

          <p>
            <strong>Note:</strong> Time spent on active-duty status for training
            purposes only doesn’t count toward the service requirements.
          </p>
          <p>
            <a href="/discharge-upgrade-instructions/">
              Get instructions on how to apply for a discharge upgrade or
              correction
            </a>
          </p>
        </va-additional-info>
      </va-process-list-item>

      <va-process-list-item header="Gather your information">
        <p className="vads-u-font-weight--bold vads-u-margin-top--2">
          Here’s what you’ll need to apply:
        </p>
        <ul>
          <li>
            <strong>Social Security numbers</strong> for you, your spouse (if
            you’re married), and any dependents you may have.
          </li>
          <li>
            <strong>Insurance card information</strong> for all health insurance
            companies that cover you. This includes any coverage that you get
            through a spouse or significant other. This also includes Medicare,
            private insurance, or insurance from your employer.
          </li>
        </ul>

        <p>You can also provide this information:</p>
        <ul>
          <li>
            <strong>Your military service history information</strong> and
            details about exposure to toxins or hazards.
          </li>
          <li>
            <strong>A copy of your DD214 or other separation documents.</strong>{' '}
            If you sign in to apply, we may be able to fill in your military
            service information for you. If you don’t sign in to apply, you can
            upload a copy of your DD214 or other separation documents.
          </li>
          <li>
            <strong>Income information</strong> for you, your spouse, or any
            dependents you may have. This includes income from a job and any
            other sources.
          </li>
          <li>
            <strong>Deductible expenses</strong> (expenses that you can subtract
            from your income) for you and your spouse. These expenses will lower
            the amount of money we count as income.
          </li>
        </ul>
      </va-process-list-item>

      <va-process-list-item header="Start your application">
        <p className="vads-u-margin-top--2">
          We’ll take you through each step of the process. It should take about
          35 minutes.
        </p>
        <va-additional-info trigger="What happens after I apply?" uswds>
          <p>
            We process health care applications within about a week. We’ll send
            you a letter in the mail with our decision.
          </p>
          <p>
            If you don’t receive your decision letter within a week after you
            apply, please don’t apply again. Call us at{' '}
            <va-telephone contact={CONTACTS['222_VETS']} /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
            <dfn>
              <abbr title="Eastern Time">ET</abbr>
            </dfn>
            .
          </p>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  </>
);

export default ProcessTimeline;
