import React from 'react';

export const IntroductionPageFormProcess = () => (
  <>
    <h2 className="vads-u-font-size--h2 ">Follow these steps to get started</h2>
    <va-process-list uswds>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-bottom--0">
          If you and your dependents meet the requirements listed here, you may
          be eligible to use this form to add or remove dependents for your VA
          benefits.
        </p>
        <p>One of these must be true:</p>
        <ul>
          <li>
            You’re a Veteran entitled to disability benefits, and you have a
            combined disability rating of at least 30 percent,{' '}
            <strong>or</strong>
          </li>
          <li>
            You’re a Veteran entitled to Veterans Pension benefits,{' '}
            <strong>or</strong>
          </li>
          <li>
            You’re a surviving spouse of a Veteran entitled to survivors
            benefits, <strong>or</strong>
          </li>
        </ul>
        <p>
          <strong>Note:</strong> If you’re a surviving spouse who receives
          Dependency and Indemnity Compensation (DIC) benefits and your child is
          over age 18 and receives their own DIC benefits, you can’t receive
          additional benefits.
        </p>
        <p>Your dependent must be one of these people:</p>
        <ul>
          <li>
            Your spouse (you should only use this form to add your spouse as a
            dependent if you’ve never received additional benefits for them
            before)
          </li>
          <li>
            An unmarried child (including an adopted or stepchild) under age 18
          </li>
          <li>
            An unmarried child between ages 18 and 23 years old who attends
            school
          </li>
          <li>
            An unmarried child who can’t support themselves because they became
            permanently disabled before they turned 18 years old
          </li>
        </ul>
        <p>
          If your dependent parent died, you may also use this form to remove
          them as a dependent.
        </p>
        <p>
          <strong>Note:</strong> If you need to add a parent as a dependent,
          you’ll need to complete a Statement of Dependency of Parent(s) (VA
          Form 21P-509) instead.
          <br />
          <va-link
            href="/find-forms/about-form-21p-509/"
            text="Get VA Form 21P-509 to download"
          />
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p>Here is what you’ll need to apply:</p>
        <ul>
          <li>
            <strong>Personal information about yourself.</strong> This includes
            date of birth, Social Security number, Military Service number, and
            contact information.
          </li>
          <li>
            <strong>
              Personal information about the dependents you’re adding or
              removing.
            </strong>{' '}
            This includes date of birth and Social Security number.
          </li>
        </ul>
        <p>
          In certain situations, you may also need to provide other information.
          Or you may need to submit supporting documents, like copies of your
          marriage license or birth certificates. We’ll tell you if we need
          other information or supporting documents.
        </p>
        <va-link
          href="/view-change-dependents/"
          text="Find out which documents you need to add or remove dependents"
        />
        <p>
          If you need help to prepare, contact an accredited representative or
          local Veterans Service Organization (VSO).
        </p>
        <va-link
          href="/get-help-from-accredited-representative/"
          text="Get help filing your claim"
        />
      </va-process-list-item>
      <va-process-list-item header="Start your dependency claim">
        <p>
          We’ll take you through each step of the process. It should take about
          30 minutes.
        </p>
        <p>
          When you submit your application, you’ll get a confirmation message.
          You can print this message for your records.
        </p>
        <va-additional-info trigger="What happens after I apply?">
          <p>If we send you a request for information, be sure to respond.</p>
          <br />
          <p>
            After we complete our review, we’ll mail you a decision letter with
            the details of our decision.
          </p>
          <br />
          <p>
            <strong>If you don’t hear back from us about your claim,</strong>{' '}
            don’t file another claim. <br />
            Contact us online or call us instead.
          </p>
          <p />
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  </>
);
