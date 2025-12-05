import React from 'react';

/**
 * Student current income content
 * @returns {React.ReactElement} Student income content
 */
export const StudentCurrentIncomeContent = () => (
  <>
    <p>
      Tell us what types of income the student has received during their current
      school term.
    </p>
    <p>
      <strong>Note:</strong> Don’t include VA benefits as income.
    </p>
  </>
);

/**
 * Student expected income content
 * @returns {React.ReactElement} Student expected income content
 */
export const StudentExpectedIncomeContent = () => (
  <>
    <p>
      Tell us what types of income the student expects to receive for the next
      year.
    </p>
    <p>
      <strong>Note:</strong> Don’t include VA benefits as income.
    </p>
  </>
);
