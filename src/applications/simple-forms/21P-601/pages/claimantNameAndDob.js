import {
  titleUI,
  fullNameUI,
  fullNameSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your name and date of birth'),
    claimantFullName: fullNameUI(),
    claimantDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: fullNameSchema,
      claimantDateOfBirth: dateOfBirthSchema,
    },
  },
};
