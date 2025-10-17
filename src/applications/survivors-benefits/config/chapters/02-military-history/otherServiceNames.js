import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Other service names',
  path: 'veteran/other-service-names',
  uiSchema: {
    addOtherServiceName: yesNoUI({
      title: 'Would you like to add another name you served under?',
      labelHeaderLevel: 3,
    }),
  },
  schema: {
    type: 'object',
    required: ['addOtherServiceName'],
    properties: {
      addOtherServiceName: yesNoSchema,
    },
  },
};
