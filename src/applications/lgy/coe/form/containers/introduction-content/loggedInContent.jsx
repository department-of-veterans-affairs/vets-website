import React from 'react';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const LoggedInContent = ({ route }) => (
  <>
    <div className="process schemaform-process">
      <ol>
        <li className="process-step list-one">
          <h3>Check your service requirements</h3>
          <p>
            Make sure you meet our VA home loan eligibility requirements before
            you request a COE. You may be able to get a COE if you:
          </p>
          <ul>
            <li>
              Didn’t receive a dishonorable discharge, <strong>and</strong>
            </li>
            <li>
              Meet the minimum service requirement based on when you served
            </li>
          </ul>
          <a href="/">Eligibility requirements for VA home loan programs</a>
        </li>
        <li className="process-step list-two">
          <h3>Gather your information</h3>
          <p>Here’s what you’ll need to request a COE:</p>
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
          <va-additional-info trigger="What's a statement of service?">
            <p>hey</p>
          </va-additional-info>
        </li>
        <li className="process-step list-three">
          <h3>Start your request</h3>
          <p>
            Complete the form to request a VA home loan Certificate of
            Eligibility. It should take about 15 minutes.
          </p>
          <va-additional-info trigger="What happens after I request a COE?">
            <p>hey</p>
          </va-additional-info>
        </li>
      </ol>
      <div className="vads-u-margin-bottom--4">
        <SaveInProgressIntro
          buttonOnly
          testActionLink
          prefillEnabled={route.formConfig.prefillEnabled}
          messages={route.formConfig.savedFormMessages}
          formConfig={route.formConfig}
          pageList={route.pageList}
          downtime={route.formConfig.downtime}
          startText="Request a Certificate of Eligibility"
          headingLevel={2}
        />
      </div>
      <OMBInfo expDate="11/30/2022" ombNumber="2900-0086" resBurden={15} />
    </div>
  </>
);

LoggedInContent.propTypes = {
  route: PropTypes.object,
};

export default LoggedInContent;
