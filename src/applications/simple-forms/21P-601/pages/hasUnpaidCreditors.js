import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Creditor information'),
    hasUnpaidCreditors: yesNoUI(
      "Are you seeking reimbursement for expenses you haven't paid yet?",
    ),
    'ui:description': (
      <>
        <p>
          If you're asking VA to reimburse you for funeral or medical expenses
          that you haven't paid, the people or companies you owe money to will
          need to sign the form too.
        </p>
      </>
    ),
  },
  schema: {
    type: 'object',
    required: ['hasUnpaidCreditors'],
    properties: {
      hasUnpaidCreditors: yesNoSchema,
    },
  },
};
