import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const description = (
  <>
    <p>
      We want to know if you, your spouse, or your dependents pay medical or
      certain other expenses that aren’t reimbursed.
    </p>
    <p>
      Examples include these types of expenses:
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
        <li> Burial expenses for a spouse or a child over the past year </li>
        <li>
          Legal expenses over the past year that resulted in a financial
          settlement or award (like Social Security disability benefits)
        </li>
      </ul>
    </p>
  </>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Medical expenses and other unreimbursed expenses', description),
    hasMedicalExpenses: yesNoUI({
      title:
        "Do you, your spouse, or your dependents pay medical or other expenses that aren't reimbursed?",
    }),
  },
  schema: {
    type: 'object',
    required: ['hasMedicalExpenses'],
    properties: {
      hasMedicalExpenses: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
