import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Nursing home information',
    nursingHome: yesNoUI({
      title: 'Do you live in a nursing home?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['nursingHome'],
    properties: {
      nursingHome: yesNoSchema,
    },
  },
};
