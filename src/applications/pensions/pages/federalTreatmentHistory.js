import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Treatment from federal medical facilities',
    federalTreatmentHistory: yesNoUI({
      title:
        'Have you received treatment from any non-VA federal medical facilities within the past year?',
      hint:
        'Examples of federal medical facilities include military bases and prisons',
      uswds: true,
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
