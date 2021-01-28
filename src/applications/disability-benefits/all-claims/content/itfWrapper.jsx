import React from 'react';
import moment from 'moment';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { recordEventOnce } from 'platform/monitoring/record-event';

// EVSS returns dates like '2014-07-28T19:53:45.810+0000'
const evssDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const outputDateFormat = 'MMMM DD, YYYY';
const displayDate = dateString =>
  moment(dateString, evssDateFormat).format(outputDateFormat);

export const itfMessage = (headline, content, status) => (
  // Inline style to match .full-page-alert bottom margin because usa-grid > :last-child has a
  //  bottom margin of 0 and overrides it
  <div className="full-page-alert itf-wrapper">
    <AlertBox
      isVisible
      headline={headline}
      content={content}
      status={status}
      level="2"
    />
  </div>
);

const recordITFHelpEvent = () =>
  recordEventOnce({
    event: 'disability-526EZ--form-help-text-clicked',
    'help-text-label': 'Disability - Form 526EZ - What is an intent to file',
  });

const expander = (
  <AdditionalInfo
    triggerText="What is an Intent to File?"
    onClick={recordITFHelpEvent}
  >
    <p>
      An Intent to File request lets VA know that you’re planning to file a
      claim. An Intent to File reserves a potential effective date for when you
      could start getting benefits while you prepare your disability claim and
      gather supporting documents.
    </p>
  </AdditionalInfo>
);

export const claimsIntakeAddress = (
  <p className="va-address-block">
    Department of Veterans Affairs
    <br />
    Claims Intake Center
    <br />
    PO Box 4444
    <br />
    Janesville, WI 53547-4444
  </p>
);

export const itfError = (
  <div>
    <div>
      <p>
        We’re sorry. Your Intent to File request didn’t go through because
        something went wrong on our end. For help creating an Intent to File a
        Claim for Compensation, please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
        8:00 a.m. to 9:00 p.m. ET. Or, you can fill out VA Form 21-0966 and
        submit it to:
      </p>
      {claimsIntakeAddress}
    </div>
    {expander}
  </div>
);

export const itfSuccess = (
  hasPreviousItf,
  expirationDate,
  prevExpirationDate,
) => (
  <div>
    <p>
      Thank you for submitting your Intent to File request for disability
      compensation. Your Intent to File will expire on{' '}
      {displayDate(expirationDate)}.
    </p>
    {hasPreviousItf && (
      <p>
        <strong>Please note:</strong> We found a previous Intent to File request
        in our records that expired on {displayDate(prevExpirationDate)}. This
        ITF might have been from an application you started, but didn’t finish
        before the ITF expired. Or, it could have been from a claim you already
        submitted.
      </p>
    )}
    {expander}
  </div>
);

export const itfActive = expirationDate => (
  <div>
    <p>
      Our records show that you already have an Intent to File for disability
      compensation. Your Intent to File will expire on{' '}
      {displayDate(expirationDate)}. You’ll need to submit your claim by this
      date in order to receive payments starting from your effective date.
    </p>
    {expander}
  </div>
);
