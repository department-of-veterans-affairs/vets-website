import React from 'react';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const deductionCodes = Object.freeze({
  '30': 'Disability compensation and pension debt',
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
        <section className="vads-u-font-family--sans">
          <p>
            The compensation and pension offices sent you a letter explaining
            why you have this debt. Some common reasons for this type of debt
            are:
          </p>

          <ul>
            <li>
              A change in your spouse’s or dependent’s status wasn’t submitted
              or processed before we made a payment to you, <strong>or</strong>
            </li>
            <li>
              There was an adjustment to your drill pay, <strong>or</strong>
            </li>
            <li>
              Your eligibility for a benefit might have changed,
              <strong className="vads-u-margin-left--0p5">or</strong>
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
            <VaTelephone contact="8008271000" />, Monday through Friday, 8:00
            a.m to 8:00 p.m. ET
          </p>
          <p>
            <strong>Veterans Pension:</strong>{' '}
            <VaTelephone contact="87729463850" />, Monday through Friday, 8:00
            a.m to 4:30 p.m. ET
          </p>
          <p>
            If you want more information about debt overpayment and available
            options, please call the Debt Management Center at{' '}
            <VaTelephone contact="8008270648" />.
          </p>
        </section>
      );
    case '41':
    case '44':
      return (
        <section className="vads-u-font-family--sans">
          <p>
            The Education office sent you a letter explaining why you have this
            debt. Some common reasons for this type of debt are:
          </p>

          <ul>
            <li>
              You made a change in course enrollment, <strong>or</strong>
            </li>
            <li>
              You withdrew from a higher-education institution,
              <strong className="vads-u-margin-left--0p5">or</strong>
            </li>
            <li>
              Your eligibility for a benefit might have changed,
              <strong className="vads-u-margin-left--0p5">or</strong>
            </li>
            <li>We made a duplicate or incorrect payment to you</li>
          </ul>

          <p>
            If you want more information about the reason for this debt or the
            decision resulting in this debt, please call the Education office at{' '}
            <VaTelephone contact="8884424551" />. We’re here Monday through
            Friday, 8:00 a.m. to 7:00 p.m. ET.
          </p>

          <p>
            If you want more information about debt overpayment and available
            options, please call the Debt Management Center at{' '}
            <VaTelephone contact="8008270648" />.
          </p>
        </section>
      );
    case '71':
    case '72':
    case '74':
    case '75':
      return (
        <section className="vads-u-font-family--sans">
          <p>
            The Education office sent you a letter explaining why you have this
            debt. Some common reasons for this type of debt are:
          </p>
          <ul>
            <li>
              You made a change in course enrollment, <strong>or</strong>
            </li>
            <li>
              You withdrew from a higher-education institution,
              <strong className="vads-u-margin-left--0p5">or</strong>
            </li>
            <li>Your eligibility for a benefit might have changed, or</li>
            <li>We made a duplicate or incorrect payment to you</li>
          </ul>
          <p>
            <strong>Note:</strong>
            For Post-9/11 GI Bill debts, please make separate payments for
            tuition, housing, and books and supplies. When there is a change in
            this benefit’s use, we’ll collect the three debts separately.
          </p>
          <p>
            If you want more information about the reason for this debt or the
            decision resulting in this debt, please call the Education office at{' '}
            <VaTelephone contact="8884424551" />. We’re here Monday through
            Friday, 8:00 a.m. to 7:00 p.m. ET.
          </p>
          <p>
            If you want more information about debt overpayment and available
            options, please call the Debt Management Center at{' '}
            <VaTelephone contact="8008270648" />.
          </p>
        </section>
      );
    default:
      return null;
  }
};

export const renderWhyMightIHaveThisDebt = deductionCode => {
  switch (deductionCode) {
    case '30':
      return (
        <section>
          <p>
            Some reasons you have debt related to your compensation and pension
            benefits might include:
          </p>

          <ul>
            <li>
              You’ve received a payment for disability compensation and military
              pay at the same time.
            </li>
            <li>
              You didn’t let us know of a change in your marital or dependent
              status.
            </li>
            <li>
              You’ve received two payments for the same compensation and pension
              benefits.
            </li>
            <li>You didn’t let us know of additional income you might have.</li>
            <li>
              You didn’t let us know that you were incarcerated (sent to jail or
              prison).
            </li>
            <li>There was a change in your active-duty status.</li>
            <li>Your eligibility for a benefit has changed.</li>
          </ul>
        </section>
      );
    case '41':
    case '44':
    case '71':
    case '72':
    case '74':
    case '75':
      return (
        <section>
          <p>
            Some reasons you have debt related to your education benefits might
            include:
          </p>

          <ul>
            <li>You were suspended or put on academic probation.</li>
            <li>
              You made a change in your course enrollment or withdrew from a
              class. o Note: A change in course enrollment can cause an
              overpayment in tuition, housing, and book and supplies.
            </li>
            <li>There was a change in your housing situation.</li>
            <li>We made a duplicate payment to you.</li>
            <li>
              You withdrew from your college, university, or higher-education
              program.
            </li>
            <li>There was a change in your active-duty status.</li>
            <li>Your eligibility for a benefit has changed.</li>
          </ul>

          <p>
            <strong>Note: </strong>
            For Post-9/11 GI Bill benefits, we make separate payments for
            tuition, housing, and books and supplies. When there is a change in
            one of these benefits, we’ll collect the three debts separately.
          </p>
        </section>
      );
    default:
      return null;
  }
};
