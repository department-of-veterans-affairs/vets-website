import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Are you claiming reimbursement?'),
    claimingReimbursement: yesNoUI(
      'Are you seeking reimbursement for last illness or burial expenses?',
    ),
    'ui:description':
      'Select yes if you paid for medical care or burial services for the deceased and want to be reimbursed.',
  },
  schema: {
    type: 'object',
    required: ['claimingReimbursement'],
    properties: {
      claimingReimbursement: yesNoSchema,
    },
  },
};
