import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { recordEventOnce } from 'platform/monitoring/record-event';

import { add as addFns, format as formatFns, parseISO } from 'date-fns';
import { parseDate } from '../utils/dates';

// EVSS returns dates like '2014-07-28T19:53:45.810+0000'
// Use date-fns tokens to parse this format
const evssDateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSX";
const outputDateFormat = "eeee, MMMM do, yyyy 'at' h:mm a";

const normalizeEvssIso = dateString =>
  typeof dateString === 'string'
    ? dateString.replace(/([+-]\d{2})(\d{2})$/, '$1:$2')
    : dateString;

// Adding 1 hour to the displayDate output will display the time in the ET timezone as the returned time and date
// is in the central timezone
const displayDate = dateString => {
  if (!dateString) return '';

  let parsed = parseISO(normalizeEvssIso(dateString));
  if (!parsed || Number.isNaN(parsed.getTime())) {
    parsed = parseDate(dateString, evssDateFormat);
  }
  if (!parsed) return '';

  const adjusted = addFns(parsed, { hours: 1 });
  return formatFns(adjusted, outputDateFormat);
};

export const itfMessage = (headline, content, status) => (
  // Inline style to match .full-page-alert bottom margin because usa-grid > :last-child has a
  //  bottom margin of 0 and overrides it
  <div className="full-page-alert itf-wrapper">
    <va-alert visible status={status} uswds>
      <h2 slot="headline">{headline}</h2>
      {content}
    </va-alert>
  </div>
);

const recordITFHelpEvent = () =>
  recordEventOnce({
    event: 'disability-526EZ--form-help-text-clicked',
    'help-text-label': 'Disability - Form 526EZ - What is an intent to file',
  });

const expander = (
  <VaAdditionalInfo
    trigger="What is an Intent to File?"
    disableAnalytics
    disable-border
    onClick={recordITFHelpEvent}
  >
    <p className="vads-u-font-size--base">
      An Intent to File request lets VA know that you’re planning to file a
      claim. An Intent to File reserves a potential effective date for when you
      could start getting benefits while you prepare your disability claim and
      gather supporting documents.
    </p>
  </VaAdditionalInfo>
);

export const claimsIntakeAddress = (
  <p className="va-address-block vads-u-font-size--base">
    Department of Veterans Affairs
    <br role="presentation" />
    Claims Intake Center
    <br role="presentation" />
    PO Box 4444
    <br role="presentation" />
    Janesville, WI 53547-4444
  </p>
);

export const itfError = (
  <div>
    <div className="vads-u-margin-bottom--2">
      <p className="vads-u-font-size--base">
        You can continue to file your claim or call us to confirm.
      </p>
      <strong>What an intent to file means: </strong>
      <p className="vads-u-font-size--base">
        An intent to file sets a potential start date (or effective date) for
        your benefits. You then have up to 1 year to complete and file your
        claim. And you may be able to get retroactive payments (payments for the
        time between when you submitted your intent to file and when we approved
        your claim).
      </p>
      <br />
      <strong>What you can do next:</strong>
      <p className="vads-u-font-size--base">
        <ul>
          <li>
            You can continue and submit your claim online today—or when you’re
            ready. If we don’t have an intent to file on record for this claim
            that’s within the past year, we’ll use the date you submit your
            claim as a potential start date for your benefits.
          </li>
          <li>
            Or you can call us to confirm if you have an intent to file for this
            claim and what your next step should be. Call us at{' '}
            <va-telephone contact="8008271000" /> (
            <va-telephone contact={CONTACTS['711']} tty />
            ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          </li>
        </ul>
      </p>
      <a
        href="/resources/your-intent-to-file-a-va-claim/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Learn more about the intent to file process (opens in a new tab)
      </a>
    </div>
  </div>
);

export const itfSuccess = (
  hasPreviousItf,
  expirationDate,
  prevExpirationDate,
) => (
  <div>
    <p className="vads-u-font-size--base">
      Thank you for submitting your Intent to File request for disability
      compensation. Your Intent to File will expire on{' '}
      <strong>{displayDate(expirationDate)} ET</strong>.
    </p>
    {hasPreviousItf && (
      <p className="vads-u-font-size--base">
        <strong>Please note:</strong> We found a previous Intent to File request
        in our records that expired on{' '}
        <strong>{displayDate(prevExpirationDate)} ET</strong>. This ITF might
        have been from an application you started, but didn’t finish before the
        ITF expired. Or, it could have been from a claim you already submitted.
      </p>
    )}
    {expander}
  </div>
);

export const itfActive = expirationDate => (
  <div>
    <p className="vads-u-font-size--base">
      Our records show that you already have an Intent to File for disability
      compensation. Your Intent to File will expire on{' '}
      <strong>{displayDate(expirationDate)} ET</strong>. You’ll need to submit
      your claim by this date in order to receive payments starting from your
      effective date.
    </p>
    {expander}
  </div>
);
