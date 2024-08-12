import React from 'react';

import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

import { recordEventOnce } from '~/platform/monitoring/record-event';

import formConfig from '../config/form';
import { getReadableDate } from '../../shared/utils/dates';

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
    <p>
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
    <div className="vads-u-margin-bottom--2">
      <p>You can continue to file your claim or call us to confirm.</p>
      <strong>What an intent to file means: </strong>
      <ul>
        <li>
          If you’re filing a Supplemental Claim to request a review of a claim
          we decided longer than 1 year ago, an intent to file sets a potential
          start date (or effective date) for your benefits. You then have up to
          1 year to complete and file your Supplemental Claim. And you may be
          able to get payments for the time between when you submitted your
          intent to file and when we approved your claim.
        </li>
        <li>
          If you’re submitting a Supplemental Claim to request a review of a
          claim we decided within the past year, an intent to file gives you 1
          year to complete and file your Supplemental Claim. But we’ll use the
          original date you filed the claim under review as the potential start
          date for your benefits.
        </li>
      </ul>
      <p />
      <strong>What you can do next:</strong>
      <ul>
        <li>
          You can continue and submit your claim online today—or when you’re
          ready. If we don’t have an intent to file on record for this claim
          that’s within the past year, we’ll use the date you submit your claim
          as a potential start date for your benefits.
        </li>
        <li>
          Or you can call us to confirm if you have an intent to file for this
          claim and what your next step should be. Call us at{' '}
          <va-telephone contact="8008271000" /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </li>
      </ul>
      <p>
        <a
          href="/resources/your-intent-to-file-a-va-claim/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more about the intent to file process (opens in a new tab)
        </a>
      </p>
    </div>
  </div>
);

export const itfSuccess = (
  hasPreviousItf,
  expirationDate,
  prevExpirationDate,
) => (
  <div>
    <p>
      By starting this Supplemental Claim request, you automatically submitted
      an Intent to File. Your Intent to File will expire on{' '}
      {getReadableDate(expirationDate) || ''}.
    </p>
    {hasPreviousItf && (
      <p>
        <strong>Note:</strong> We found in our records an Intent to File that
        expired on {getReadableDate(prevExpirationDate) || ''}. There are 2
        possible reasons you have an expired Intent to File. You may have
        started an application that you didn’t finish before the Intent to File
        expired. Or, you may have already submitted the claim connected to this
        Intent to File.
      </p>
    )}
  </div>
);

export const itfActive = expirationDate => (
  <p>
    Our records show that you already submitted an Intent to File for disability
    compensation. Your Intent to File will expire on{' '}
    {getReadableDate(expirationDate) || ''}. You’ll need to file your claim by
    this date to receive payments starting from your effective date.
  </p>
);
