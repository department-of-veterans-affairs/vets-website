import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const fullNameMiddleInitialUI = {
  ...fullNameUI(),
  middle: {
    ...fullNameUI().middle,
    'ui:title': 'Middle initial',
  },
};

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  path: 'personal-information',
  uiSchema: {
    ...titleUI('Personal information'),
    fullName: fullNameMiddleInitialUI,
    dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    required: ['dateOfBirth'],
    properties: {
      fullName: fullNameSchema,
      dateOfBirth: dateOfBirthSchema,
    },
  },
};
