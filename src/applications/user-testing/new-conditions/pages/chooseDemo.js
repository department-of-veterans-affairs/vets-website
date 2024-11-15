import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const demoOptions = {
  newConditions: 'Owl',
  newConditionsJustConditions: 'Fox',
};

/** @type {PageSchema} */
export default {
  title: 'Choose path',
  path: 'choose-demo',
  uiSchema: {
    demo: radioUI({
      title: 'Which demo would you like to go through first?',
      labels: demoOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      demo: radioSchema(Object.keys(demoOptions)),
    },
    required: ['demo'],
  },
};
