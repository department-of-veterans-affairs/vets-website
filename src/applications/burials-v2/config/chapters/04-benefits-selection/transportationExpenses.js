import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { yesNoUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const { transportationExpenses } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Transportation allowance'),
    transportationExpenses: {
      ...yesNoUI({
        title:
          'Are you responsible for the for the transportation of the Veteran’s remains to the final resting place?',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['transportationExpenses'],
    properties: {
      transportationExpenses,
    },
  },
};
