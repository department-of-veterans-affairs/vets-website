import React from 'react';
import moment from 'moment';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { formatDateParsedZoneLong } from '@department-of-veterans-affairs/platform-utilities/date';

export function formatPercent(percent) {
  let validPercent;

  if (!Number.isNaN(parseInt(percent, 10))) {
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
  if (!field || field.months == null || field.days == null) {
    return 'unavailable';
  }

  const { months, days } = field;

  const monthString = `${months} ${months === 1 ? 'month' : 'months'}`;

  const dayString = `${days} ${days === 1 ? 'day' : 'days'}`;

  return `${monthString}, ${dayString}`;
}

export function benefitEndDateExplanation(condition, delimitingDate) {
  switch (condition) {
    case 'activeDuty':
      return (
        <div className="section benefit-end-date">
          <h3 className="vads-u-font-size--h4">Benefit end date</h3>
          <div>
            Since you’re on active duty, your benefits don’t yet have an
            expiration date.
          </div>
        </div>
      );
    case 'remainingEntitlement':
      return (
        <div className="section benefit-end-date">
          <h3 className="vads-u-font-size--h4">Benefit end date</h3>
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
            If you’re enrolled in education benefits through MGIB-Active Duty or
            MGIB-Selected Reserve benefits, confirm your school enrollment by
            using the{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.va.gov/education/verify-school-enrollment"
            >
              Verify Your Enrollment (VYE)
            </a>
            &nbsp;tool.
          </li>
        </ul>
      </div>
    </div>
  );
}

export const backendErrorMessage = (
  <div
    id="backendErrorMessage"
    className="vads-u-margin-bottom--2 grid-col usa-width-two-thirds"
  >
    <VaAlert status="warning" visible>
      We’re sorry. There’s a problem with our system. We can’t check if you have
      a GI Bill Statement of Benefits right now. Try again later.
    </VaAlert>
    <p>
      If you need information about your GI Bill benefits now, call the GI Bill
      Hotline at <va-telephone contact="8884424551" />
      &nbsp;(&nbsp;
      <va-telephone tty contact="711" />
      ).
    </p>
    <va-link-action
      href="/"
      message-aria-describedby="Return to VA homepage"
      text="Go back to VA.gov"
    />
  </div>
);

export const serviceDowntimeErrorMessage = (
  <div
    id="serviceDowntimeErrorMessage"
    className="vads-u-margin-bottom--2 grid-col usa-width-two-thirds"
  >
    <VaAlert status="info" visible>
      This tool isn’t available right now. You can use this tool Sunday through
      Friday, 6:00 a.m. to 10:00 p.m. ET, and Saturday 6:00 a.m. to 7:00 p.m.
      ET.
    </VaAlert>
    <p>
      If you need information about your GI Bill benefits now, call the GI Bill
      Hotline at <va-telephone contact="8884424551" />
      &nbsp;(&nbsp;
      <va-telephone tty contact="711" />
      ).
    </p>
    <va-link-action
      href="/"
      message-aria-describedby="Return to VA homepage"
      text="Go back to VA.gov"
    />
  </div>
);

export const genericErrorMessage = (
  <div
    id="genericErrorMessage"
    className="vads-u-margin-bottom--2 grid-col usa-width-two-thirds"
  >
    <va-alert
      class="vads-u-margin-bottom--3"
      close-btn-aria-label="Close notification"
      disable-analytics="false"
      full-width="false"
      slim
      status="warning"
      visible
    >
      <p className="vads-u-margin-y--0">
        We’re sorry. Something went wrong on our end. Please try again later.
      </p>
    </va-alert>
    <va-button
      className="usa-button usa-button-primary"
      onClick={e => {
        e.preventDefault();
        window.history.back();
      }}
      text=" Back to Post-9/11 GI Bill"
    />
  </div>
);

export const authenticationErrorMessage = (
  <div
    id="authenticationErrorMessage"
    className="vads-u-margin-bottom--2 grid-col usa-width-two-thirds"
  >
    <div className="vads-u-margin-bottom--2">
      <h1 className="vads-u-font-size--h2">
        Why can’t I access my Statement of Benefits?
      </h1>
      <va-alert
        class="vads-u-margin-bottom--3"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        full-width="false"
        slim
        status="info"
        visible
      >
        <p className="vads-u-margin-y--0">
          Your Post-9/11 GI Bill Statement of Benefits isn’t available in this
          tool.
        </p>
      </va-alert>
      <p>
        Here are some reasons your Post-9/11 GI Bill Statement of Benefits might
        not be available:
        <ul>
          <li>
            We’re still processing your education benefits application, so we
            haven’t created a record yet for you. We usually process
            applications within 30 days. If you applied less than 30 days ago,
            please check back soon.
          </li>
          <li>
            The name on the account you’re signed in with doesn’t exactly match
            the name we have in our Post-9/11 GI Bill records.
          </li>
          <li>
            You haven’t applied yet for Post-9/11 GI Bill education benefits.
            <br />
            <va-link
              href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
              text="Apply for education benefits"
            />
          </li>
          <li>You’re not eligible for Post-9/11 GI Bill benefits.</li>
          <li>
            You are the family member or dependent of a Veteran. Right now, the
            GI Bill Statement of Benefits isn’t available online to family
            members or dependents. You’ll need to request a copy of your
            education decision letter by mail to check your GI Bill benefit
            status.
          </li>
        </ul>
        If none of these situations applies to you, and you think your Statement
        of Benefits should be here, call the GI Bill Hotline at{' '}
        <va-telephone contact="8884424551" />
        &nbsp;(&nbsp;
        <va-telephone tty contact="711" />
        ).
      </p>
    </div>

    <va-link-action
      href="/"
      message-aria-describedby="Return to VA homepage"
      text="Go back to VA.gov"
    />
  </div>
);
