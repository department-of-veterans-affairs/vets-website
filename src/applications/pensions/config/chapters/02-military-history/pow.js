import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import set from '@department-of-veterans-affairs/platform-forms-system/set';

import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import dateRangeUI from '@department-of-veterans-affairs/platform-forms-system/dateRange';

const { powDateRange } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'POW Status',
    'ui:order': ['view:powStatus', 'powDateRange'],
    'view:powStatus': yesNoUI({
      title: 'Have you ever been a prisoner of war?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    powDateRange: set(
      'ui:options.expandUnder',
      'view:powStatus',
      dateRangeUI(
        'Start of confinement',
        'End of confinement',
        'Confinement start date must be before end date',
      ),
    ),
  },
  schema: {
    type: 'object',
    required: ['view:powStatus'],
    properties: {
      'view:powStatus': yesNoSchema,
      powDateRange,
    },
  },
};
