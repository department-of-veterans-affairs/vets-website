import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Treatment from federal medical facilities',
  path: 'medical/history/federal-treatment',
  uiSchema: {
    ...titleUI('Treatment from federal medical facilities'),
    federalTreatmentHistory: yesNoUI({
      title:
        'Have you received treatment from any non-VA federal medical facilities within the past year?',
      hint:
        'Examples of federal medical facilities include military bases and prisons',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['federalTreatmentHistory'],
    properties: {
      federalTreatmentHistory: yesNoSchema,
    },
  },
};
