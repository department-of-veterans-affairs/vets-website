import {
  titleUI,
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  fullNameUI,
  fullNameSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const claimantIdUI = ssnOrVaFileNumberUI();
claimantIdUI.ssn['ui:title'] = 'Your Social Security number';
claimantIdUI.vaFileNumber['ui:title'] = 'Your VA file number';

export default {
  uiSchema: {
    ...titleUI('Tell us about yourself'),
    claimantFullName: fullNameUI(),
    claimantIdentification: claimantIdUI,
    claimantDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: [
      'claimantFullName',
      'claimantIdentification',
      'claimantDateOfBirth',
    ],
    properties: {
      claimantFullName: fullNameSchema,
      claimantIdentification: ssnOrVaFileNumberSchema,
      claimantDateOfBirth: dateOfBirthSchema,
    },
  },
};
