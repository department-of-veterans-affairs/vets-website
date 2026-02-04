import {
  fullNameSchema,
  fullNameUI,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimant’s name and date of birth'),
    claimantFullName: fullNameUI(),
    claimantDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
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
