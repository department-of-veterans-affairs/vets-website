import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Expense reimbursement'),
    claimingReimbursement: yesNoUI(
      'Did you pay for the beneficiary’s last illness or burial expenses and want to be reimbursed?',
    ),
  },
  schema: {
    type: 'object',
    required: ['claimingReimbursement'],
    properties: {
      claimingReimbursement: yesNoSchema,
    },
  },
};
