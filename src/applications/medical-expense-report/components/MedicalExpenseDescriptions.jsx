import React from 'react';

export function CareExpenseDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        We want to know about your unreimbursed care expenses.
      </p>
      <p>
        Examples of unreimbursed care expenses include payments to in-home care
        providers, nursing homes, or other care facilities that insurance won’t
        cover.
      </p>
    </div>
  );
}

export function MedicalExpenseDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        We want to know if you, your spouse, or your dependents pay medical or
        certain other expenses that aren’t reimbursed.
      </p>
      <p>Examples include these types of expenses:</p>
      <ul>
        <li>
          Recurring medical expenses for yourself, or someone in your household,
          that insurance doesn’t cover
        </li>
        <li>
          One-time medical expenses for yourself, or someone in your household,
          after you started this online application or after you submitted an
          Intent to File, that insurance doesn’t cover
        </li>
        <li>
          Tuition, materials, and other expenses for educational courses or
          vocational rehabilitation for you or your spouse over the past year
        </li>
        <li>Burial expenses for a spouse or a child over the past year</li>
        <li>
          Legal expenses over the past year that resulted in a financial
          settlement or award (like Social Security disability benefits)
        </li>
      </ul>
    </div>
  );
}

export function SupportingDocumentsDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Based on your answer, you’ll need to submit supporting documents about
        your care expenses.
      </p>
      <h4>For in-home care or other facility expenses</h4>
      <p>A provider or administrator will need to complete these forms:</p>
      <ul>
        <li>
          Residential Care, Adult Daycare, or a Similar Facility worksheet
          (opens in a new tab)
        </li>
        <li>In-Home Attendant Expenses worksheet (opens in a new tab)</li>
      </ul>
      <h4>For nursing home expenses</h4>
      <p>You may also need these forms:</p>
      <ul>
        <li>
          Request for Nursing Home Information in Connection with Claim for Aid
          and Attendance (VA Form 21-0779)
        </li>
        <li>
          Examination for Housebound Status or Permanent Need for Regular Aid
          and Attendance form (VA Form 21-2680)
        </li>
      </ul>
      <p>
        We’ll ask you to upload these documents at the end of this application.
      </p>
    </div>
  );
}

export function MedicalExpenseDetailsDescription() {
  return (
    <div className="vads-u-margin-bottom--2">
      <p className="vads-u-margin-top--0">
        We want to know if you, your spouse, or your dependents pay medical or
        certain other expenses that aren’t reimbursed.
      </p>
      <va-additional-info trigger="How to report monthly recurring expenses">
        <p>
          For recurring monthly expenses, report them as a single expense.
          Include the start date and the monthly or annual cost.
        </p>
        <p>
          If a recurring expense has ended, treat the expense as non-recurring.
          Non-recurring expenses must be reported individually as separate
          expenses.
        </p>
        <p>Prescription medications are generally not considered recurring.</p>
      </va-additional-info>
    </div>
  );
}
