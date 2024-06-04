import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Dates you were employed'),
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
    },
  },
};
