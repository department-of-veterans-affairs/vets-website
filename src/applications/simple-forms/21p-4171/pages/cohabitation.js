import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Living together'),
    living: {
      maintainedHome: yesNoUI(
        'Did/do the Veteran and the claimed spouse maintain a home and live together as married to one another?',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      living: {
        type: 'object',
        properties: {
          maintainedHome: yesNoSchema,
        },
        required: ['maintainedHome'],
      },
    },
    required: ['living'],
  },
};
