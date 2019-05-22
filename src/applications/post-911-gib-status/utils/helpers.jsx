import React from 'react';
import { Link } from 'react-router';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { formatDateParsedZoneLong } from '../../../platform/utilities/date';
import CallHRC from '../../../platform/static-data/CallHRC';

export function formatPercent(percent) {
  let validPercent = undefined;

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
          <div>
            You have until{' '}
            <strong>{formatDateParsedZoneLong(delimitingDate)}</strong> to use
            these benefits.
          </div>
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
            888-GI-BILL-1 (<a href="tel:+18884424551">888-442-4551</a>
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

export function noChapter33BenefitsWarning() {
  return (
    <div id="noChapter33Benefits">
      <header>
        <h1>We couldn’t find your Post-9/11 GI Bill information.</h1>
      </header>
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          <p className="usa-alert-heading">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=post-911-gi-bill-enrollment-status"
            >
              If you’re a dependent, please go to eBenefits to look up your GI
              Bill information.
            </a>
          </p>
        </div>
      </div>
      <h2>Need GI Bill help?</h2>
      <hr className="divider" />
      <p>
        If you have questions or need help looking up your GI Bill information,
        please call <span className="gi-phone-nowrap">888-GI-BILL-1</span>(
        <a className="gi-phone-nowrap" href="tel:1-888-442-4551">
          888-442-4551
        </a>
        ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
      </p>
    </div>
  );
}

export function backendErrorMessage() {
  return (
    <div id="backendErrorMessage" className="row">
      <div className="medium-8 columns">
        <h3>We’re sorry. Something went wrong on our end.</h3>
        <p>
          We’re having trouble finding your Post-9/11 GI Bill Statement of
          Benefits right now.
        </p>
        <p>
          <strong>This could be for 1 of 3 reasons:</strong>
        </p>
        <ul>
          <li>
            We’re still processing your education benefits application and we
            haven’t yet created a record for you. We usually process
            applications within 60 days. If you applied less than 60 days ago,
            please check back soon.
          </li>
          <li>
            The name on your VA.gov account doesn’t exactly match the name we
            have in our Post-9/11 GI Bill records.
          </li>
          <li>
            You haven’t yet applied for Post-9/11 GI Bill education benefits.
          </li>
        </ul>
        <p>
          If you think your Statement of Benefits should be here, please{' '}
          <CallHRC />
        </p>
        <Link className="usa-button usa-button-primary" to="/">
          Back to Post-9/11 GI Bill
        </Link>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export const wizardConfig = [
  {
    type: 'existingApplication',
    previous: null,
    label: 'Have you already applied for Post-9/11 GI Bill benefits?',
    options: [
      {
        label: 'Yes',
        value: true,
      },
      {
        label: 'No',
        value: false,
      },
    ],
    isActive: () => true,
  },
  {
    type: 'recentApplication',
    previous: 'existingApplication',
    label: 'When did you apply for benefits?',
    options: [
      {
        label: 'Less than 60 days ago',
        value: true,
      },
      {
        label: 'More than 60 days ago',
        value: false,
      },
    ],
    isActive: previousValue => previousValue === true,
  },
  {
    type: 'recentMessage',
    previous: 'recentApplication',
    component: () => (
      <AlertBox
        content={
          <p>
            It takes us about 60 days to process applications. If you applied
            less than 60 days ago, please check back soon.
          </p>
        }
        status="warning"
      />
    ),
    isActive: previousValue => previousValue === true,
  },
  {
    type: 'applicationLink',
    previous: 'existingApplication',
    component: () => (
      <ul>
        <li>
          <a href="/education/about-gi-bill-benefits/post-9-11/">
            Find out if you’re eligible for Post-9/11 GI Bill benefits
          </a>
        </li>{' '}
        <span>or </span>
        <li>
          <a href="/education/how-to-apply/">Apply for education benefits</a>
        </li>
      </ul>
    ),
    isActive: previousValue => previousValue === false,
  },
  {
    type: 'veteran',
    previous: 'recentApplication',
    label:
      'Are you a Veteran or service member claiming a benefit based on your own service?',
    options: [
      {
        label: 'Yes',
        value: true, // the ds component doesn't handle booleans
      },
      {
        label: 'No',
        value: false,
      },
    ],
    isActive: previousValue => previousValue === false,
  },
  {
    type: 'automaticEligibility',
    previous: 'veteran',
    label:
      'Does your sponsor have a 100% disability rating, or are they deceased, MIA, or a POW?',
    options: [
      {
        label: 'Yes',
        value: true, // the ds component doesn't handle booleans
      },
      {
        label: 'No',
        value: false,
      },
    ],
    isActive: previousValue => previousValue === false,
  },
  {
    type: 'benefitsTransferred',
    previous: 'automaticEligibility',
    label:
      'Has your sponsor transferred their Post-9/11 GI Bill benefits to you?',
    options: [
      {
        label: 'Yes',
        value: true, // the ds component doesn't handle booleans
      },
      {
        label: 'No',
        value: false,
      },
    ],
    isActive: previousValue => previousValue === false,
  },
  {
    type: 'errorMessage',
    previous: ['veteran', 'automaticEligibility', 'benefitsTransferred'],
    component: () => (
      <AlertBox
        headline="We’re sorry. We can’t find your Statement of Benefits right now."
        content={
          <div>
            <p>
              If you’re having trouble accessing your benefit statement, it
              could be for one of these reasons:
            </p>
            <ul>
              <li>
                We’re still processing your education benefits application and
                we haven’t yet created a record for you. We usually process
                applications within 60 days. If you applied less than 60 days
                ago, please check back soon.
              </li>
              <li>
                The name on your account doesn’t exactly match the name we have
                in our Post-9/11 GI Bill records.
              </li>
              <li>
                You haven’t yet applied for Post-9/11 GI Bill education
                benefits.
              </li>
            </ul>
            <p>
              If none of these situations apply to you, and you think your
              Statement of Benefits should be here, please call the Education
              Call Center at 888-442-4551 (888-GI-BILL-1). We’re here Monday
              through Friday, 8:00 a.m. to 7:00 p.m. ET.
            </p>
          </div>
        }
        status="warning"
      />
    ),
    isActive: choices =>
      choices.veteran ||
      choices.automaticEligibility ||
      choices.benefitsTransferred,
  },
  {
    type: 'transferMessage',
    previous: 'benefitsTransferred',
    component: () => (
      <AlertBox
        content={
          <p>
            Your sponsor needs to transfer their Post-9/11 GI Bill benefits to
            you before we can process your application.
          </p>
        }
        status="warning"
      />
    ),
    isActive: previousValue => previousValue === false,
  },
];
