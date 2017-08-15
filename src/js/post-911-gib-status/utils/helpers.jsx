import React from 'react';
import { formatDateParsedZoneLong } from '../../common/utils/helpers';

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

  return number.replace(number.substring(0, lengthOfXString),
                        `${'x'.repeat(lengthOfXString)}-`);
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
        <li>Your school made a request to us that’s still in process, <strong>or</strong></li>
        <li>You made a request to us that’s still in process, <strong>or</strong></li>
        <li>You used or are using your benefit for flight, on-the-job, apprenticeship, or correspondence training</li>
      </ul>
    </div>
  ),
  noEnrollmentHistory: (
    <div className="feature">
      <h4>You don’t have any enrollment history</h4>
      <span>Your enrollment history may not be available if:</span>
      <ul>
        <li>You or your school did not yet make a request to us, <strong>or</strong></li>
        <li>You or your school made a request that’s still in process</li>
      </ul>
    </div>
  )
};

export function benefitEndDateExplanation(condition, delimitingDate) {
  switch (condition) {
    case 'activeDuty':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit End Date</h4>
          <div>
            Since you are currently on active duty, your benefits don’t yet have an expiration date.
          </div>
        </div>
      );
    case 'remainingEntitlement':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit End Date</h4>
          <div>
            You have until <strong>{formatDateParsedZoneLong(delimitingDate)}</strong> to use these benefits.
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
        <h2>Currently Not Qualified</h2>
        <span><strong>Our records show you don’t qualify for the Post-9/11 GI Bill because:</strong></span>
        <ul>
          <li>You haven’t served on active duty for at least 90 days after September 10, 2001, and/or</li>
          <li>Your service component let us know that you didn’t receive an honorable discharge</li>
          <li>If the information in our records is not accurate, please call us at 888-442-4551 (888-GI-BILL-1) from 8 a.m. to 7 p.m (ET).</li>
        </ul>
        <h5>Resources</h5>
        <ul>
          <li><a target="_blank" href="/education/eligibility">Check Post-9/11 GI Bill benefits eligibility</a></li>
          <li>If you’re enrolled in education benefits through another chapter (Montgomery GI Bill (MGIB) or Reservists Educational Assistance Program (REAP)), check our <a target="_blank" href="https://www.gibill.va.gov/wave/index.do">Web Automated Verification of Enrollment (W.A.V.E)</a></li>
        </ul>
      </div>
    </div>
  );
}

export function noChapter33BenefitsWarning() {
  // TODO: expand vertical spacing
  return (
    <div className="feature" id="noChapter33Benefits">
      <h4>You don’t currently have any Post-9/11 GI Bill Benefits</h4>
      We may not have information about your Post-9/11 GI Bill benefit because
      <ul>
        <li>You haven’t applied for Post-9/11 GI Bill benefits, <strong>or</strong></li>
        <li>Your application for Post-9/11 GI Bill benefits is still in process, <strong>or</strong></li>
        <li>You have education benefits through a different benefit or chapter.</li>
      </ul>
      Need to apply?
      <ul>
        <li><a href="">Check to make sure you qualify for Post-9/11 GI Bill benefits</a></li>
        <li><a href="">Apply for benefits</a></li>
      </ul>
      Not sure if you have benefits through another program?
      <ul>
        <li><a href="" target="_blank">Check your benefit status through our Web Automated Verification of Enrollment (W.A.V.E.) system</a></li>
      </ul>
    </div>
  );
}
