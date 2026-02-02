import {
  fullNameSchema,
  fullNameUI,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updatedFullNameSchema = fullNameSchema;
updatedFullNameSchema.properties.first.maxLength = 12;
updatedFullNameSchema.properties.last.maxLength = 18;

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
      claimantFullName: updatedFullNameSchema,
      claimantDateOfBirth: dateOfBirthSchema,
    },
  },
};
