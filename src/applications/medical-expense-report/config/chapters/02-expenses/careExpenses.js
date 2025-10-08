import React from 'react';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

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

/** @type {PageSchema} */
export default {
  title: 'Care expenses',
  path: 'expenses/care',
  uiSchema: {
    ...titleUI('Care expenses'),
    'ui:description': CareExpenseDescription,
    hasCareExpenses: yesNoUI({
      title:
        'Do you, your spouse, or your dependents pay recurring care expenses that aren’t reimbursed',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['hasCareExpenses'],
    properties: {
      hasCareExpenses: {
        type: 'boolean',
      },
    },
  },
};
