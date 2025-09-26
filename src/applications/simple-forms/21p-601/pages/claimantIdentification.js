import {
  titleUI,
  ssnUI,
  ssnSchema,
  fullNameUI,
  fullNameSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Tell us about yourself'),
    claimantFullName: fullNameUI(),
    claimantSsn: ssnUI('Your Social Security number'),
    claimantDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantSsn', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: fullNameSchema,
      claimantSsn: ssnSchema,
      claimantDateOfBirth: dateOfBirthSchema,
    },
  },
};
