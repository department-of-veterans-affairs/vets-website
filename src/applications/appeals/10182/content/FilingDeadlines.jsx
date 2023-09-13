import React from 'react';

// Needed for Introduction page
export const filingDeadlineContent = (
  <>
    <p>
      You can submit this online form (VA Form 10182) to appeal a VA decision
      dated on or after February 19, 2019. The Board must receive your completed
      form <strong>within 1 year (365 days)</strong> from the date listed on
      your decision notice, unless one of these situations apply:
    </p>
    <p className="vads-u-margin-left--4">
      <strong>If our decision involves a contested claim,</strong> the Board
      must receive your completed form within 60 days from the date listed on
      your decision notice. A contested claim is when a favorable claim decision
      for one person results in denial or reduced benefits for another person.
    </p>
    <div className="vads-u-margin-left--4">
      <strong>If you have a Statement of the Case (SOC)</strong> or a{' '}
      <strong>
        Supplemental Statement of the Case (SSOC) from the old appeals system
        dated on or after February 19, 2019,
      </strong>{' '}
      the Board must receive your completed form in one of these time frames,
      whichever is later:
      <ul className="vads-u-margin-left--2">
        <li>
          Within 60 days from the date on the SSOC letter, <strong>or</strong>
        </li>
        <li>
          Within 1 year of the decision date by the agency of original
          jurisdiction
        </li>
      </ul>
    </div>
  </>
);

export const FilingDeadlinesDescription = (
  <>
    <h3>Deadlines for submitting this form</h3>
    {filingDeadlineContent}
    <p>
      Please understand that by listing any issues currently pending in the old
      system, you are specifically opting those issues into the new decision
      review process if you continue with this submission. We won’t continue to
      process your appeal in the old system.
    </p>
  </>
);
