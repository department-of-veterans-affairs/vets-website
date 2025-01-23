import React from 'react';
import {
  Page,
  FormTitle,
} from '@department-of-veterans-affairs/va-forms-system-core';

export default function BurialIntroduction(props) {
  return (
    <>
      <Page {...props}>
        <div className="schemaform-intro">
          <FormTitle title="Apply for burial benefits" />
          <p>Equal to VA Form 21P-530 (Application for Burial Benefits).</p>
          <h2 className="vads-u-font-size--h4">
            Follow the steps below to apply for burial benefits.
          </h2>
          <va-process-list>
            <va-process-list-item header="Prepare">
              <div>
                <h4>
                  <a href="/burials-memorials/veterans-burial-allowance/">
                    Find out if you qualify for a burial allowance
                  </a>
                  .
                </h4>
              </div>
              <br />
              <div>
                <h4>
                  To fill out this application, you’ll need information about
                  the deceased Veteran, including their:
                </h4>
              </div>
              <ul>
                <li>Social Security number or VA file number (required)</li>
                <li>Date and place of birth (required)</li>
                <li>Date and place of death (required)</li>
                <li>Military status and history</li>
              </ul>
              <div>
                <h4>You may need to upload:</h4>
              </div>
              <ul>
                <li>
                  A copy of the deceased Veteran’s DD214 or other separation
                  documents
                </li>
                <li>A copy of the Veteran’s death certificate</li>
                <li>
                  Documentation for transportation costs (if you’re claiming
                  costs for the transportation of the Veteran’s remains)
                </li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.{' '}
                <a href="/disability/get-help-filing-claim/">
                  Get help filing your claim
                </a>
                .
              </p>
              <h4>Learn about other survivor and dependent benefits</h4>
              <p>
                If you’re the survivor or dependent of a Veteran who died in the
                line of duty or from a service-related illness, you may be able
                to get a benefit called{' '}
                <a href="/burials-memorials/dependency-indemnity-compensation/">
                  Dependency and Indemnity Compensation
                </a>
                .
              </p>
            </va-process-list-item>
            <va-process-list-item header="Apply">
              <div>
                <p>Complete this burial benefits form.</p>
                <p>
                  After submitting the form, you’ll get a confirmation message.
                  You can print this for your records.
                </p>
              </div>
            </va-process-list-item>
            <va-process-list-item header="VA Review">
              <p>We process claims in the order we receive them.</p>
              <p>We’ll let you know by mail if we need more information.</p>
            </va-process-list-item>
            <va-process-list-item header="Decision">
              <p>
                After we process your claim, you’ll get a notice in the mail
                about the decision.
              </p>
            </va-process-list-item>
          </va-process-list>
          <va-omb-info
            exp-date="12/31/2077"
            omb-number="12-3456"
            res-burden={120}
          />
        </div>
      </Page>
    </>
  );
}
