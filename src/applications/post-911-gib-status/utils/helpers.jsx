import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { formatDateParsedZoneLong } from 'platform/utilities/date';
import EducationWizard from '../components/EducationWizard';
import wizardConfig from './wizardConfig';

export function formatPercent(percent) {
  let validPercent;

  if (!isNaN(parseInt(percent, 10))) {
    validPercent = `${Math.round(percent)}%`;
  }

  return validPercent;
}

export function formatVAFileNumber(n) {
  const number = n || '';
  const lengthOfXString = number.length > 4 ? number.length - 4 : 0;

  return number.replace(
    number.substring(0, lengthOfXString),
    `${'x'.repeat(lengthOfXString)}-`,
  );
}

export function formatMonthDayFields(field) {
  let displayValue;
  if (field) {
    if (field.days === 1) {
      displayValue = `${field.months} months, ${field.days} day`;
    } else {
      displayValue = `${field.months} months, ${field.days} days`;
    }
  } else {
    displayValue = 'unavailable';
  }
  return displayValue;
}

export const enrollmentHistoryExplanation = {
  standard: (
    <div className="feature">
      <h4>Does something look wrong in your enrollment history?</h4>
      <span>Certain enrollments may not be displayed in this history if:</span>
      <ul>
        <li>
          Your school made a request to us that’s still in process,{' '}
          <strong>or</strong>
        </li>
        <li>
          You made a request to us that’s still in process, <strong>or</strong>
        </li>
        <li>
          You used or are using your benefit for flight, on-the-job,
          apprenticeship, or correspondence training
        </li>
      </ul>
    </div>
  ),
  noEnrollmentHistory: (
    <div className="feature">
      <h4>You don’t have any enrollment history</h4>
      <span>Your enrollment history may not be available if:</span>
      <ul>
        <li>
          You or your school did not yet make a request to us,{' '}
          <strong>or</strong>
        </li>
        <li>You or your school made a request that’s still in process</li>
      </ul>
    </div>
  ),
};

export function benefitEndDateExplanation(condition, delimitingDate) {
  switch (condition) {
    case 'activeDuty':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit end date</h4>
          <div>
            Since you’re on active duty, your benefits don’t yet have an
            expiration date.
          </div>
        </div>
      );
    case 'remainingEntitlement':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit end date</h4>
          {moment(delimitingDate).isValid() ? (
            <div>
              You have until{' '}
              <strong>{formatDateParsedZoneLong(delimitingDate)}</strong> to use
              these benefits.
            </div>
          ) : (
            <div>There’s no time limit to use these education benefits.</div>
          )}
        </div>
      );
    default:
      return undefined;
  }
}

export function notQualifiedWarning() {
  return (
    <div className="usa-alert usa-alert-warning usa-content not-qualified">
      <div className="usa-alert-body">
        <h2>You don't qualify</h2>
        <span>
          <strong>
            Our records show you don’t qualify for the Post-9/11 GI Bill
            because:
          </strong>
        </span>
        <ul>
          <li>
            You haven’t served on active duty for at least 90 days after
            September 10, 2001, and/or
          </li>
          <li>
            Your service component let us know that you didn’t receive an
            honorable discharge
          </li>
          <li>
            If the information in our records isn't accurate, please call us at
            888-GI-BILL-1 (<va-telephone contact="8884424551" />
            ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
          </li>
        </ul>
        <h5>Resources</h5>
        <ul>
          <li>
            <a target="_blank" href="/education/eligibility/">
              Check Post-9/11 GI Bill benefits eligibility
            </a>
          </li>
          <li>
            If you’re enrolled in education benefits through another chapter
            (Montgomery GI Bill (MGIB) or Reservists Educational Assistance
            Program (REAP)), check our{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.gibill.va.gov/wave/index.do"
            >
              Web Automated Verification of Enrollment (W.A.V.E)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export const backendErrorMessage = (
  <div id="backendErrorMessage">
    <h3>
      We’re sorry. Our system isn’t working right now. Please try again or check
      back soon.
    </h3>
    <Link className="usa-button usa-button-primary" to="/">
      Back to Post-9/11 GI Bill
    </Link>
  </div>
);

export const genericErrorMessage = (
  <div>
    <h3>We’re sorry. Something went wrong on our end. Please try again.</h3>
    <Link className="usa-button usa-button-primary" to="/">
      Back to Post-9/11 GI Bill
    </Link>
  </div>
);

export const authenticationErrorMessage = (
  <div id="authenticationErrorMessage" className="vads-u-margin-bottom--2">
    <div className="vads-u-margin-bottom--2">
      <h1>We’re having trouble finding your GI Bill benefit statement</h1>

      <VaAlert status="info" visible>
        <h3 slot="headline">
          The most common reason for this error is that you haven’t yet applied
          for Post-9/11 GI Bill benefits
        </h3>
        <>
          <p>
            You need to apply for Post-9/11 GI Bill benefits before you can view
            your GI Bill benefit statement.
          </p>

          <p>
            After you apply, it’ll take us on average 30 days to process your
            application. If you’re awarded GI Bill benefits, you’ll be able to
            access and view your benefit statement.
          </p>

          <a href="/education/how-to-apply/">
            Find out how to apply for Post-9/11 GI Bill benefits
          </a>
        </>
      </VaAlert>
    </div>
    <div>
      <h4>Have you already applied for education benefits?</h4>
      <p>
        There are a few situations where your Post-9/11 GI Bill benefit
        statement might not be available even if you’ve already applied for
        education benefits. Just answer a few questions below and we’ll try to
        help you find out why.
      </p>
    </div>
    <EducationWizard
      config={wizardConfig}
      toggleText="Troubleshoot My GI Bill Benefits"
    />
  </div>
);
