import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const description = (
  <section>
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
  </section>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Medical expenses',
    'ui:description': description,
    medicalExpenses: yesNoUI({
      title:
        "Do you, your spouse, or your dependents pay medical or other expenses that aren't reimbursed?",
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    required: ['medicalExpenses'],
    properties: {
      medicalExpenses: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
