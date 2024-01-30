import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const radioOptions = {
  YES: 'Yes',
  NO: 'No',
  IDK: 'I’m not sure',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Current spouse’s marital history',
    currentSpouseMaritalHistory: radioUI({
      title: 'Has your spouse been married before?',
      labels: radioOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['currentSpouseMaritalHistory'],
    properties: {
      currentSpouseMaritalHistory: radioSchema(Object.keys(radioOptions)),
    },
  },
};
