import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Dependent children',
    'view:hasDependents': yesNoUI({
      title: 'Do you have any dependent children?',
    }),
  },
  schema: {
    type: 'object',
    required: ['view:hasDependents'],
    properties: {
      'view:hasDependents': yesNoSchema,
    },
  },
};
