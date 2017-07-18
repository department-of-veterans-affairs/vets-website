import React from 'react';

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

export function systemDownMessage() {
  return (
    <div className="row">
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
    <div>
      <div className="usa-alert usa-alert-warning claims-no-icon claims-unavailable">
        <h4 className="warning-title">
          <i className="fa fa-exclamation-triangle"></i>&nbsp;We weren't able to find your records
        </h4>
        Please call 855-574-7286 between Monday - Friday, 8:00 a.m. - 8:00 p.m. ET.
      </div>
    </div>
  );
}

export function noChapter33BenefitsWarning() {
  // TODO: expand vertical spacing
  return (
    <div className="feature">
      <h4>You don't have any Post-9/11 GI Bill Benefits</h4>
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
