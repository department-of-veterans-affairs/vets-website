import React from 'react';
import moment from 'moment';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { recordEventOnce } from 'platform/monitoring/record-event';

import formConfig from '../config/form';

// EVSS returns dates like '2014-07-28T19:53:45.810+0000'
const evssDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
export const outputDateFormat = 'MMMM DD, YYYY';
const displayDate = dateString =>
  moment(dateString, evssDateFormat).format(outputDateFormat);

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
    event: `${formConfig.trackingPrefix}--form-help-text-clicked`,
    'help-text-label':
      'File a Supplemental Claim - Intent to File - What is an intent to file',
  });

export const itfExpander = (
  <VaAdditionalInfo
    trigger="What is an Intent to File?"
    disableAnalytics
    onClick={recordITFHelpEvent}
    uswds
  >
    <p className="vads-u-font-size--base">
      When you submit an Intent to File, you’re telling us that you plan to file
      a claim. This sets a potential start date (called an effective date) for
      when you could start getting benefits. It gives you time to prepare your
      claim and gather supporting documents. And it means that your start date
      for benefits may be earlier than the date you file your claim.
    </p>
  </VaAdditionalInfo>
);

export const itfError = (
  <div>
    <p className="vads-u-font-size--base">
      We’re sorry. Your Intent to File request didn’t go through because
      something went wrong on our end. For help creating an Intent to File a
      Claim for Compensation, please call Veterans Benefits Assistance at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday,
      8:00 a.m. to 9:00 p.m. ET. Or, you can fill out VA Form 21-0966 and submit
      it to:
    </p>
    <p className="va-address-block vads-u-font-size--base">
      Department of Veterans Affairs
      <br role="presentation" />
      Claims Intake Center
      <br role="presentation" />
      PO Box 4444
      <br role="presentation" />
      Janesville, WI 53547-4444
    </p>
  </div>
);

export const itfSuccess = (
  hasPreviousItf,
  expirationDate,
  prevExpirationDate,
) => (
  <div>
    <p className="vads-u-font-size--base">
      By starting this Supplemental Claim request, you automatically submitted
      an Intent to File. Your Intent to File will expire on{' '}
      {displayDate(expirationDate)}.
    </p>
    {hasPreviousItf && (
      <p className="vads-u-font-size--base">
        <strong>Note:</strong> We found in our records an Intent to File that
        expired on {displayDate(prevExpirationDate)}. There are 2 possible
        reasons you have an expired Intent to File. You may have started an
        application that you didn’t finish before the Intent to File expired.
        Or, you may have already submitted the claim connected to this Intent to
        File.
      </p>
    )}
  </div>
);

export const itfActive = expirationDate => (
  <p className="vads-u-font-size--base">
    Our records show that you already submitted an Intent to File for disability
    compensation. Your Intent to File will expire on{' '}
    {displayDate(expirationDate)}. You’ll need to file your claim by this date
    to receive payments starting from your effective date.
  </p>
);
