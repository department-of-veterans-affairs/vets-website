import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const description = (
  <>
    <p>We want to know about your unreimbursed care expenses.</p>
    <p>
      Examples of unreimbursed care expenses include payments to in-home care
      providers, nursing homes, or other care facilities that insurance won’t
      cover.
    </p>
  </>
);

/** @type {PageSchema} */
export default {
  path: 'financial/care-expenses',
  title: 'Care expenses',
  uiSchema: {
    ...titleUI('Care expenses', description),
    hasCareExpenses: yesNoUI({
      title:
        "Do you, your spouse, or your dependents pay recurring care expenses that aren't reimbursed?",
    }),
  },
  schema: {
    type: 'object',
    required: ['hasCareExpenses'],
    properties: {
      hasCareExpenses: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
