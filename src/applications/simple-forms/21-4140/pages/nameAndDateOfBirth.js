// @ts-check
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const fullNameUISchema = fullNameNoSuffixUI();
fullNameUISchema.first = {
  ...fullNameUISchema.first,
  'ui:errorMessages': {
    ...fullNameUISchema.first['ui:errorMessages'],
    required: 'Please enter your first name',
  },
};
fullNameUISchema.last = {
  ...fullNameUISchema.last,
  'ui:errorMessages': {
    ...fullNameUISchema.last['ui:errorMessages'],
    required: 'Please enter your last name',
  },
};

const dateOfBirthUISchema = dateOfBirthUI({
  errorMessages: {
    required: 'Please provide your date of birth',
  },
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name and date of birth'),
    fullName: fullNameUISchema,
    dateOfBirth: dateOfBirthUISchema,
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
