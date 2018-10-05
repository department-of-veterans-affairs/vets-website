import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import moment from 'moment';

// EVSS returns dates like '2014-07-28T19:53:45.810+0000'
const evssDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
const outputDateFormat = 'MMMM DD, YYYY';
const displayDate = dateString =>
  moment(dateString, evssDateFormat).format(outputDateFormat);

export const itfMessage = (headline, content, status) => (
  <div className="usa-grid full-page-alert">
    <div>
      <AlertBox
        isVisible
        headline={headline}
        content={content}
        status={status}
      />
    </div>
  </div>
);

const expander = (
  <AdditionalInfo triggerText="What is an Intent to File?">
    <p>
      An Intent to File request lets VA know that you’re planning to file a
      claim. An Intent to File reserves a potential effective date for when you
      could start getting benefits while you prepare your disability claim and
      gather supporting documents.
    </p>
  </AdditionalInfo>
);

export const itfError = (
  <div>
    <div>
      <p>
        We’re sorry. Your Intent to File request didn’t go through because
        something went wrong on our end. For help creating an Intent to File a
        Claim for Compensation, please call Veterans Benefits Assistance at{' '}
        <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday – Friday, 8:00
        a.m. – 9:00 a.m. (ET). Or, you can fill out VA Form 21-0966 and submit
        it to:
      </p>
      <p>
        Department of Veterans Affairs
        <br />
        Claims Intake Center
        <br />
        PO Box 4444
        <br />
        Janesville, WI 53547-4444
      </p>
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
