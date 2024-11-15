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
  title: 'Choose a demo',
  path: 'choose-demo',
  uiSchema: {
    demo: radioUI({
      title: 'Choose a demo',
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
