import React from 'react';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

function MedicalExpenseDescription() {
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

/** @type {PageSchema} */
export default {
  title: 'Medical expenses',
  path: 'expenses/medical',
  uiSchema: {
    ...titleUI('Medical expenses'),
    'ui:description': MedicalExpenseDescription,
    hasMedicalExpenses: yesNoUI({
      title:
        'Do you, your spouse, or your dependents pay medical or other expenses that aren’t reimbursed?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['hasMedicalExpenses'],
    properties: {
      hasMedicalExpenses: {
        type: 'boolean',
      },
    },
  },
};
