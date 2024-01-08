import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Treatment from a VA medical center',
    vaTreatmentHistory: yesNoUI({
      title: 'Have you received treatment from a VA medical center?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['vaTreatmentHistory'],
    properties: {
      vaTreatmentHistory: yesNoSchema,
    },
  },
};
