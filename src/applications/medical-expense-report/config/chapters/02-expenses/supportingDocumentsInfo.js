import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

function SupportingDocumentsDescription() {
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

/** @type {PageSchema} */
export default {
  title: 'Care expenses',
  path: 'expenses/care/supporting-documents',
  depends: formData => formData.hasCareExpenses === true,
  uiSchema: {
    ...titleUI('Submit supporting documents'),
    'ui:description': SupportingDocumentsDescription,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {},
  },
};
