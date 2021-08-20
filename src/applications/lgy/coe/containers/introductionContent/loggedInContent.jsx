import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';

export const loggedInContent = () => (
  <>
    <h2 className="">Follow these steps to apply for a VA home loan COE</h2>
    <div className="process schemaform-process">
      <ol>
        <li className="process-step list-one">
          <h3>Check your service requirements</h3>
          <p>
            Make sure you meet our VA home loan eligibility requirements before
            you apply for a COE. You may be able to get a COE if you:
          </p>
          <ul>
            <li>
              Didn’t receive a dishonorable discharge <strong>and</strong>
            </li>
            <li>
              Meet the minimum active-duty service requirement based on when you
              served
            </li>
          </ul>
        </li>
        <li className="process-step list-two">
          <h3>Gather your information</h3>
          <p>Here’s what you’ll need to apply:</p>
          <ul>
            <li>
              Your Social Security number, date of birth and current contact
              information.
            </li>
            <li>
              The property location and dates of past VA loans (if you have or
              had a VA-backed loan)
            </li>
            <li>
              <strong>If you’re a Veteran,</strong> you’ll need a copy of your
              discharge or separation papers (DD214).
            </li>
            <li>
              <strong>If you’re an active-duty service member,</strong> you’ll
              need a statement of service—signed by your commander, adjutant, or
              personnel officer.
            </li>
            <li>
              <strong>
                If you’re a current or former activated National Guard or
                Reserve member,
              </strong>{' '}
              you’ll need a copy of your discharge or separation papers (DD214).
            </li>
            <li>
              <strong>
                If you’re a current member of the National Guard or Reserves
                who’s never been activated,
              </strong>{' '}
              you’ll need a statement of service—signed by your commander,
              adjutant, or personnel officer.
            </li>
            <li>
              <strong>
                If you’re a discharged member of the National Guard and were
                never activated,
              </strong>{' '}
              you’ll need your Report of Separation and Record of Service (NGB
              Form 22) and your Retirement Points Statement (NGB Form 23).
            </li>
            <li>
              <strong>
                If you’re a discharged member of the Reserves who has never been
                activated,
              </strong>{' '}
              you’ll need a copy of your latest annual retirement points and
              proof of your honorable service.
            </li>
          </ul>
        </li>
        <li className="process-step list-three">
          <h3>Start your application</h3>
          <p>
            Complete the form to apply for a VA home loan Certificate of
            Eligibility. It should take about 15 minutes.
          </p>
          <AdditionalInfo triggerText="What happens after I apply?">
            <p>hey</p>
          </AdditionalInfo>
        </li>
      </ol>
      <a
        className="vads-c-action-link--green vads-u-margin-bottom--3 vads-u-display--block"
        href="/housing-assistance/home-loans/apply-for-coe-form-26-1880/applicant-information-summary"
      >
        Apply for a Certificate of Eligibility
      </a>
      <OMBInfo expDate="11/30/2022" ombNumber="2900-0086" resBurden={15} />
    </div>
  </>
);
