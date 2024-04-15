import React from 'react';
import moment from 'moment';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { recordEventOnce } from 'platform/monitoring/record-event';

// EVSS returns dates like '2014-07-28T19:53:45.810+0000'
const evssDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const outputDateFormat = 'dddd[,] MMMM Do[,] Y [at] h[:]mm a';
// Adding 1 hour to the displayDate output will display the time in the ET timezone as the returned time and date
// is in the central timezone
const displayDate = dateString =>
  moment(dateString, evssDateFormat)
    .add(1, 'hours')
    .format(outputDateFormat);

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
        We’re sorry. Your Intent to File request didn’t go through because
        something went wrong on our end. For help creating an Intent to File a
        Claim for Compensation, please call Veterans Benefits Assistance at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET. Or, you can fill out VA Form 21-0966 and
        submit it to:
      </p>
      {claimsIntakeAddress}
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
