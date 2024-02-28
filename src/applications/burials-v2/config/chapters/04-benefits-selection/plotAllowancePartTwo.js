import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { yesNoUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const { plotExpenseResponsibility } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Plot or interment allowance'),
    plotExpenseResponsibility: {
      ...yesNoUI({
        title:
          'Are you responsible for the Veteran’s plot or interment expenses?',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['plotExpenseResponsibility'],
    properties: {
      plotExpenseResponsibility,
    },
  },
};
