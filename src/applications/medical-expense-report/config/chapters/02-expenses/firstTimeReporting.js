import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Reporting expenses'),
    firstTimeReporting: yesNoUI('Is this your first time reporting expenses?'),
  },
  schema: {
    type: 'object',
    required: ['firstTimeReporting'],
    properties: {
      firstTimeReporting: {
        type: 'boolean',
      },
    },
  },
};
