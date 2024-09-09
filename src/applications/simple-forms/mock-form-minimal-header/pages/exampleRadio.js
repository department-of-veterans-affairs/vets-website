import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Example radio page',
      headerLevel: 1,
      headerStyleLevel: 2,
    }),
    exampleRadio: radioUI({
      title: 'Example radio field',
      labels: {
        option1: 'Option 1',
        option2: 'Option 2',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      exampleRadio: radioSchema(['option1', 'option2']),
    },
    required: ['exampleRadio'],
  },
};
