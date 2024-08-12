import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { powStatus } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'POW status',
  path: 'military/pow',
  uiSchema: {
    ...titleUI('Prisoner of war status'),
    powStatus: yesNoUI({
      title: 'Have you ever been a prisoner of war?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    powDateRange: {
      ...currentOrPastDateRangeUI(
        'Start of confinement',
        'End of confinement',
        'Confinement start date must be before end date',
      ),
      'ui:options': {
        expandUnder: 'powStatus',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['powStatus'],
    properties: {
      powStatus,
      powDateRange: {
        ...currentOrPastDateRangeSchema,
        required: [],
      },
    },
  },
};
