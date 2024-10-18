import React from 'react';

export const deductionCodes = Object.freeze({
  '30': 'Disability compensation and pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
});

export const renderWhyMightIHaveThisDebt = deductionCode => {
  switch (deductionCode) {
    case '30':
      return (
        <section>
          <p className="vads-u-margin-top--0">
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
          <p className="vads-u-margin-top--0">
            Some reasons you have debt related to your education benefits might
            include:
          </p>

          <ul>
            <li>You were suspended or put on academic probation.</li>
            <li>
              You made a change in your course enrollment or withdrew from a
              class. <br />
              <strong>Note:</strong> A change in course enrollment can cause an
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

          <p className="vads-u-margin-bottom--0">
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
