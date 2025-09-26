import {
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Previous reimbursements'),
    'ui:description':
      'Have you already received any payments for these expenses?',
    amountPaidByVA: numberUI('Amount paid by VA'),
    amountPaidByOthers: numberUI('Amount paid by insurance or other sources'),
    netAmountDue: {
      ...numberUI('Net amount due'),
      'ui:disabled': true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      amountPaidByVA: numberSchema,
      amountPaidByOthers: numberSchema,
      netAmountDue: numberSchema,
    },
  },
};
