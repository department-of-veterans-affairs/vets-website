import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ProcessTimeline = () => (
  <>
    <h2 className="vads-u-font-size--h3">Follow these steps to get started</h2>
    <va-process-list class="vads-u-margin-left--neg5">
      <li>
        <h3 className="vads-u-font-size--h4">Check your eligibility</h3>
        <p>
          Make sure you meet our eligibility requirements for enrollment before
          you apply.
        </p>
        <p>
          <strong>Note:</strong> We can help connect you with mental health
          care—no matter your discharge status, service history, or eligibility
          for VA health care.{' '}
          <va-link
            href="/health-care/health-needs-conditions/mental-health/"
            text="Find out how to get mental health care"
          />
        </p>
        <va-additional-info trigger="What are the eligibility requirements to enroll in VA health care?">
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
      </li>

      <li>
        <h3 className="vads-u-font-size--h4">Gather your information</h3>

        <p>Here’s what you’ll need to apply:</p>
        <ul>
          <li>
            <strong>Social Security numbers</strong> for you, your spouse, and
            your qualified dependents.
          </li>
          <li>
            <strong>Your military discharge information</strong> If you sign in
            to apply, we may be able to fill in this information for you. If you
            don’t sign in to apply, we’ll ask you to upload a copy of your DD214
            or other separation documents.
          </li>
          <li>
            <strong>Insurance cards</strong> for all health insurance companies
            that cover you. This includes any coverage that you get through a
            spouse or significant other. This also includes Medicare, private
            insurance, or insurance from your employer.
          </li>
        </ul>

        <p>We’ll also ask you for this optional information:</p>
        <ul>
          <li>
            <strong>Last year’s gross household income</strong> for you, your
            spouse, and your dependents. This includes income from a job and any
            other sources. Gross household income is your income before taxes
            and any other deductions.
          </li>
          <li>
            <strong>Your deductible expenses for last year</strong> These
            include certain health care and education costs. These expenses will
            lower the amount of money we count as your income.
          </li>
        </ul>

        <va-additional-info trigger="Why does VA need this information?">
          <p>When you apply, we review this information:</p>
          <ul>
            <li>Your service history</li>
            <li>Your VA disability rating</li>
            <li>
              Your income level (and the income level of your spouse or other
              qualified dependents)
            </li>
            <li>
              Your eligibility for Medicaid, VA disability compensation, and VA
              pension benefits
            </li>
          </ul>
          <p>We use this information to help us decide these 3 things:</p>
          <ul>
            <li>
              What types of VA health care benefits you’re eligible for,{' '}
              <strong>and</strong>
            </li>
            <li>
              How soon we can enroll you in VA health care, <strong>and</strong>
            </li>
            <li>
              How much (if anything) you’ll have to pay toward the cost of your
              care
            </li>
          </ul>
          <p>
            We give Veterans with service-connected disabilities the highest
            priority.
          </p>
          <p>
            <strong>Note:</strong> We ask about other health insurance for
            billing only. Having other health insurance doesn’t affect your
            eligibility for VA health care.
          </p>
        </va-additional-info>
      </li>

      <li>
        <div>
          <h3 className="vads-u-font-size--h4">Start your application</h3>
        </div>
        <p>
          We’ll take you through each step of the process. It should take about
          30 minutes.
        </p>
        <va-additional-info trigger="What happens after I apply?">
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
      </li>
    </va-process-list>
  </>
);

export default ProcessTimeline;
