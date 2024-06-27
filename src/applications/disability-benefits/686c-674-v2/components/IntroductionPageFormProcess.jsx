import React from 'react';

export const IntroductionPageFormProcess = () => (
  <>
    <div className="schemaform-intro vads-u-margin-bottom--6">
      <h2 className="vads-u-font-size--h2">
        Follow these steps to get started
      </h2>
      <va-process-list uswds>
        <va-process-list-item header="Check your eligibility">
          <p className="vads-u-margin-bottom--0">
            Make sure you meet our eligibility requirements before you apply.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather your information">
          <p>
            <strong>
              You’ll need this information about the deceased Veteran:
            </strong>
          </p>
          <ul>
            <li>Social Security number or VA file number</li>
            <li>Date and place of birth</li>
            <li>Date and place of death</li>
            <li>Military service history</li>
            <li>Date of burial</li>
            <li>Final resting place</li>
          </ul>
          <p>
            And we’ll ask for your personal information. This includes your
            Social Security number, date of birth, mailing address, and contact
            information.
          </p>
          <p>
            <strong>
              You may also need to provide copies of these documents:
            </strong>
          </p>
          <ul>
            <li>
              The Veteran’s death certificate including the cause of death
            </li>
            <li>
              An itemized receipt for transportation costs (only if you paid
              transportation costs for the Veteran’s remains)
            </li>
          </ul>
          <p>
            We also recommend providing a copy of the Veteran’s DD214 or other
            separation documents, you can request these documents now.
          </p>
          <p>
            If you don’t have their DD214 or other separation documents, you can
            request these documents now.
            <br />
            <va-link
              href="/records/get-military-service-records/"
              text="Learn more about requesting military service records"
            />
          </p>
          <p>
            <strong>What if I need help with my application?</strong>
          </p>
          <p>
            An accredited representative, like a Veterans Service Organization
            (VSO), can help you fill out your application.
            <br />
            <va-link
              href="/disability/get-help-filing-claim/"
              text="Learn more about getting help from an accredited representative"
            />
          </p>
        </va-process-list-item>
        <va-process-list-item header="Apply">
          <p>
            We’ll take you through each step of the process. It should take
            about 30 minutes.
          </p>
        </va-process-list-item>
        <va-process-list-item header="After you apply">
          <p>
            We’ll contact you by mail if we need more information. Once we
            process your application, we’ll mail you a letter with our decision.
          </p>
        </va-process-list-item>
      </va-process-list>
    </div>
  </>
);
