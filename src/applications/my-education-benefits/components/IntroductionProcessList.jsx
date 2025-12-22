import React from 'react';

export const IntroductionProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p>Make sure you meet our eligibility requirements before you apply.</p>

        <va-additional-info trigger="What are the Post-9/11 GI Bill (Chapter 33) requirements?">
          <ul>
            <li>
              You served at least 90 days on active duty (either all at once or
              with breaks in service) on or after September 11, 2001;{' '}
              <strong>or</strong>
            </li>
            <li>
              You received a Purple Heart on or after September 11, 2001, and
              were honorably discharged after any amount of service;{' '}
              <strong>or</strong>
            </li>
            <li>
              You served for at least 30 continuous days (all at once, without a
              break in service) on or after September 11, 2001, and were
              honorably discharged with a service-connected disability
            </li>
          </ul>
        </va-additional-info>

        <va-additional-info trigger="What are the Montgomery GI Bill Active Duty (Chapter 30) eligibility requirements?">
          <ul>
            <li>
              You served at least 2 years on active duty; <strong>and</strong>
            </li>
            <li>
              You were honorably discharged; <strong>and</strong>
            </li>
            <li>
              You have a high school diploma, GED, or 12 hours of college
              credit; <strong>and</strong>
            </li>
            <li>You meet other requirements</li>
          </ul>
        </va-additional-info>

        <va-additional-info trigger="What are the Montgomery GI Bill Selected Reserve (Chapter 1606) eligibility requirements?">
          <ul>
            <li>
              You served as a member of the Army, Navy, Air Force, Marine Corps
              or Coast Guard Reserves, Army National Guard, or Air National
              Guard; <strong>and</strong>
            </li>
            <li>
              You have either a 6-year service obligation in the Selected
              Reserve; <strong>or</strong>
            </li>
            <li>
              You’re an officer in the Selected Reserve who agreed to serve 6
              years beyond your initial service obligation; <strong>and</strong>
            </li>
            <li>You meet other requirements</li>
          </ul>
        </va-additional-info>
      </va-process-list-item>

      <va-process-list-item header="Gather your information">
        <p>
          <strong>Here’s what you’ll need to apply:</strong>
        </p>
        <ul>
          <li>Knowledge of your military service history</li>
          <li>Your current address and contact information</li>
          <li>Bank account direct deposit information</li>
        </ul>
      </va-process-list-item>

      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. It should take about
          15 minutes.
        </p>
        <va-additional-info trigger="What happens after I apply?">
          <p>
            After you apply, you may get an automatic decision. If we approve
            your application, you’ll be able to download your Certificate of
            Eligibility (or award letter) right away. If we deny your
            application, you can download your denial letter. We’ll also mail
            you a copy of your decision letter.
          </p>
          <br />
          <p>
            <strong>Note:</strong> In some cases, we may need more time to make
            a decision. If you don’t get an automatic decision right after you
            apply, you’ll receive a decision letter in the mail in about 30
            days. And we’ll contact you if we need more information.
          </p>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};

export default IntroductionProcessList;
