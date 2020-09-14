import React from 'react';

export const deductionCodes = Object.freeze({
  '30': 'Compensation & pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
});

export const renderAdditionalInfo = deductionCode => {
  switch (deductionCode) {
    case '30':
      return (
        <div className="vads-u-font-family--sans">
          <p>
            The compensation and pension offices sent you a letter explaining
            why you have this debt. Some common reasons for this type of debt
            are:
          </p>
          <ul>
            <li>
              A change in your spouse's or dependent's status wasn't submitted
              or processed before we made a payment to you, <strong>or</strong>
            </li>
            <li>
              There was an adjustment to your drill pay, <strong>or</strong>
            </li>
            <li>
              Your eligibility for a benefit might have changed,{' '}
              <strong>or</strong>
            </li>
            <li>We made a duplicate or incorrect payment to you</li>
          </ul>
          <p>
            If you want more information about the reason for this debt or the
            decision resulting in this debt, please call the VA office for your
            benefit type:
          </p>
          <p>
            <strong>Disability compensation:</strong>{' '}
            <a href="tel: 800-827-1000" aria-label="800. 8 2 7. 1000.">
              800-827-1000
            </a>
            {', '}
            Monday through Friday, 8:00 a.m to 8:00 p.m. ET
          </p>
          <p>
            <strong>Veterans Pension:</strong>{' '}
            <a href="tel: 877-294-6380" aria-label="877. 2 9 4. 6380.">
              877-294-6380
            </a>
            {', '}
            Monday through Friday, 8:00 a.m to 4:30 p.m. ET
          </p>
          <p>
            If you want more information about debt overpayment and available
            options, please call the Debt Management Center at{' '}
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648
            </a>
          </p>
        </div>
      );
    case '41':
    case '44':
      return (
        <div className="vads-u-font-family--sans">
          <p>
            The Education office sent you a letter explaining why you have this
            debt. Some common reasons for this type of debt are:
          </p>
          <ul>
            <li>
              You made a change in course enrollment, <strong>or</strong>
            </li>
            <li>
              You withdrew from a higher-education institution,{' '}
              <strong>or</strong>
            </li>
            <li>
              Your eligibility for a benefit might have changed,{' '}
              <strong>or</strong>
            </li>
            <li>We made a duplicate or incorrect payment to you</li>
          </ul>
          <p>
            If you want more information about the reason for this debt or the
            decision resulting in this debt, please call the Education office at{' '}
            <a href="tel: 888-442-4551" aria-label="888. 4 4 2. 4551.">
              888-442-4551
            </a>
            {'. '}
            We're here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
          </p>
          <p>
            If you want more information about debt overpayment and available
            options, please call the Debt Management Center at{' '}
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648
            </a>
          </p>
        </div>
      );
    case '71':
    case '72':
    case '74':
    case '75':
      return (
        <div className="vads-u-font-family--sans">
          <p>
            The Education office sent you a letter explaining why you have this
            debt. Some common reasons for this type of debt are:
          </p>
          <ul>
            <li>
              You made a change in course enrollment, <strong>or</strong>
            </li>
            <li>
              You withdrew from a higher-education institution,{' '}
              <strong>or</strong>
            </li>
            <li>Your eligibility for a benefit might have changed, or</li>
            <li>We made a duplicate or incorrect payment to you</li>
          </ul>
          <p>
            <strong>Note:</strong>
            For Post-9/11 GI Bill debts, please make separate payments for
            tuition, housing, and books and supplies. When there is a change in
            this benefit's use, we'll collect the three debts separately.
          </p>
          <p>
            If you want more information about the reason for this debt or the
            decision resulting in this debt, please call the Education office at{' '}
            <a href="tel: 888-442-4551" aria-label="888. 4 4 2. 4551.">
              888-442-4551
            </a>
            {'. '}
            We're here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
          </p>
          <p>
            If you want more information about debt overpayment and available
            options, please call the Debt Management Center at{' '}
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648
            </a>
          </p>
        </div>
      );
    default:
      return null;
  }
};

export const CoronaVirusAlert = () => (
  <>
    <h3 className="vads-u-font-family--serif vads-u-margin-top--0">
      VA debt collection is on hold due to the coronavirus
    </h3>
    <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
      We’ve taken action to stop collection on newly established Veteran debt
      and make it easier for Veterans to request extended repayment plans and
      address other financial needs during this time.
    </p>
    <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
      You won’t receive any debt collection letters in the mail until after
      December 31, 2020. For the latest information about managing VA debt,
      visit our{' '}
      <a href="http://va.gov/coronavirus-veteran-frequently-asked-questions/">
        coronavirus FAQs
      </a>
      {'.'}
    </p>
  </>
);
