import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Marriage status',
  path: 'household/marriage-status',
  uiSchema: {
    ...titleUI('Marriage status'),
    livedContinuouslyWithVeteran: yesNoUI({
      title:
        'Did you live continuously with the Veteran from the date of marriage to the date of their death?',
    }),
  },
  schema: {
    type: 'object',
    required: ['livedContinuouslyWithVeteran'],
    properties: {
      livedContinuouslyWithVeteran: yesNoSchema,
    },
  },
};
