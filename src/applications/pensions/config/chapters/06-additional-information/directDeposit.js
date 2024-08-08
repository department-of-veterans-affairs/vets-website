import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: 'Direct deposit for Veterans Pension benefits',
  path: 'additional-information/direct-deposit',
  initialData: {},
  uiSchema: {
    ...titleUI(
      'Direct deposit for Veterans Pension benefits',
      'The Department of Treasury requires all federal benefit payments be made by electronic funds transfer (EFT), also called direct deposit. If we approve your application for pension benefits, we’ll use direct deposit to deposit your payments directly into a bank account.',
    ),
    'view:usingDirectDeposit': yesNoUI({
      title: 'Do you have a bank account to use for direct deposit?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:usingDirectDeposit': yesNoSchema,
    },
    required: ['view:usingDirectDeposit'],
  },
};
