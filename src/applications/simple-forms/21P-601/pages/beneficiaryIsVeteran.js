import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Deceased beneficiary'),
    beneficiaryIsVeteran: yesNoUI('Is the deceased beneficiary the Veteran?'),
  },
  schema: {
    type: 'object',
    required: ['beneficiaryIsVeteran'],
    properties: {
      beneficiaryIsVeteran: yesNoSchema,
    },
  },
};
