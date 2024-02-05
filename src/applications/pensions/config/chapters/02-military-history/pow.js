import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import set from 'platform/utilities/data/set';

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

const { powDateRange } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'POW Status',
    powStatus: yesNoUI({
      title: 'Have you ever been a prisoner of war?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    powDateRange: set(
      'ui:options.expandUnder',
      'powStatus',
      dateRangeUI(
        'Start of confinement',
        'End of confinement',
        'Confinement start date must be before end date',
      ),
    ),
  },
  schema: {
    type: 'object',
    required: ['powStatus'],
    properties: {
      powStatus: yesNoSchema,
      powDateRange,
    },
  },
};
