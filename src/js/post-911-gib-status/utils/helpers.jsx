import React from 'react';
import { formatDateLong } from '../../common/utils/helpers';

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
    displayValue = `${field.months} months, ${field.days} days`;
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
        <li>Your school made a request to us that's still in process, <strong>or</strong></li>
        <li>You made a request to us that's still in process, <strong>or</strong></li>
        <li>You used or are using your benefit for flight, on-the-job, apprenticeship, or correspondence training</li>
      </ul>
    </div>
  ),
  noEnrollmentHistory: (
    <div className="feature">
      <h4>You don't have any enrollment history</h4>
      <span>Your enrollment history may not be available if:</span>
      <ul>
        <li>You or your school did not yet make a request to us, <strong>or</strong></li>
        <li>You or your school made a request that's still in process</li>
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
            Since you are currently on active duty, your benefits don't yet have an expiration date.
          </div>
        </div>
      );
    case 'remainingEntitlement':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit End Date</h4>
          <div>
            You have until <strong>{formatDateLong(delimitingDate)}</strong> to use these benefits.
          </div>
        </div>
      );
    default:
      return undefined;
  }
}

export function systemDownMessage() {
  return (
    <div className="row" id="systemDownMessage">
      <div className="small-12 columns">
        <div className="react-container">
          <h3>Sorry, our system is temporarily down while we fix a few things. Please try again later.</h3>
          <a href="/"><button>Go Back to Vets.gov</button></a>
        </div>
      </div>
    </div>
  );
}

export function unableToFindRecordWarning() {
  return (
    <div id="recordNotFound">
      <div className="small-12 columns">
        <div className="react-container">
          <h3>We weren't able to find your records.</h3>
          <h4>Please call 855-574-7286 between Monday - Friday, 8:00 a.m. - 8:00 p.m. ET.</h4>
        </div>
      </div>
    </div>
  );
}

export function noChapter33BenefitsWarning() {
  // TODO: expand vertical spacing
  return (
    <div className="feature" id="noChapter33Benefits">
      <h4>You don't currently have any Post-9/11 GI Bill Benefits</h4>
      We may not have information about your Post-9/11 GI Bill benefit because
      <ul>
        <li>You haven't applied for Post-9/11 GI Bill benefits, <strong>or</strong></li>
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
