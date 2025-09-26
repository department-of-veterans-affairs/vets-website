import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  fullNameUI,
  fullNameSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('About the deceased beneficiary'),
    beneficiaryIsVeteran: yesNoUI(
      'Is the deceased beneficiary the same as the veteran?',
    ),
    beneficiaryFullName: {
      ...fullNameUI(),
      'ui:title': "Deceased beneficiary's name",
    },
    beneficiaryDateOfDeath: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    required: ['beneficiaryIsVeteran', 'beneficiaryDateOfDeath'],
    properties: {
      beneficiaryIsVeteran: yesNoSchema,
      beneficiaryFullName: fullNameSchema,
      beneficiaryDateOfDeath: currentOrPastDateSchema,
    },
  },
};
