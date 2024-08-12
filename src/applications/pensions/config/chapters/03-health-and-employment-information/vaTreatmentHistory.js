import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { vaTreatmentHistory } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Treatment from a VA medical center',
  path: 'medical/history/va-treatment',
  uiSchema: {
    ...titleUI('Treatment from a VA medical center'),
    vaTreatmentHistory: yesNoUI({
      title: 'Have you received treatment from a VA medical center?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['vaTreatmentHistory'],
    properties: {
      vaTreatmentHistory,
    },
  },
};
