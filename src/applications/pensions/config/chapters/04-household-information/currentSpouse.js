import {
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Current spouse’s name',
    currentSpouseFullName: fullNameUI(title => `Spouse’s ${title}`),
  },
  schema: {
    type: 'object',
    required: ['currentSpouseFullName'],
    properties: {
      currentSpouseFullName: fullNameSchema,
    },
  },
};
