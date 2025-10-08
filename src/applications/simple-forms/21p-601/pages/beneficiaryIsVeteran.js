import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('About the deceased beneficiary'),
    beneficiaryIsVeteran: yesNoUI(
      'Is the deceased beneficiary the same as the veteran?',
    ),
  },
  schema: {
    type: 'object',
    required: ['beneficiaryIsVeteran'],
    properties: {
      beneficiaryIsVeteran: yesNoSchema,
    },
  },
};
