import React from 'react';

export const EducationalExpensesDescription = (
  <va-additional-info
    trigger="What we consider college or vocational expenses"
    class="vads-u-margin-y--1"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        College and vocational expenses include payments for these expenses
        related to your own education:
      </p>
      <ul>
        <li>Tuition</li>
        <li>Books</li>
        <li>Fees</li>
        <li>Course materials</li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        Only include expenses for your own education (not your dependents’
        education).
      </p>
    </div>
  </va-additional-info>
);

export const MedicalExpensesDescription = (
  <va-additional-info
    trigger="What we consider non-reimbursable medical expenses"
    class="vads-u-margin-top--1 vads-u-margin-bottom--4"
  >
    <div>
      <p className="vads-u-margin-top--0">
        Non-reimbursable medical expenses include costs you or your spouse paid
        for these types of health care for yourselves, your dependents, or
        others you have the moral obligation to support:
      </p>
      <ul>
        <li>Doctor or dentist appointments</li>
        <li>Medications</li>
        <li>Medicare or health insurance</li>
        <li>Inpatient hospital care</li>
        <li>Nursing home care</li>
      </ul>
      <p className="vads-u-margin-bottom--0">
        We only consider expenses non-reimbursable if your health insurance
        doesn’t pay you back for the cost.
      </p>
    </div>
  </va-additional-info>
);
