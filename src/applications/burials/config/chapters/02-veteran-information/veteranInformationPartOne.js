import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { fullNameUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const { veteranFullName } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Personal information'),
    veteranFullName: {
      ...fullNameUI(),
      first: {
        'ui:title': 'Veteran’s first name',
        'ui:errorMessages': {
          required: 'Enter the Veteran’s first name',
        },
      },
      middle: {
        'ui:title': 'Veteran’s middle name',
      },
      last: {
        'ui:title': 'Veteran’s last name',
        'ui:errorMessages': {
          required: 'Enter the Veteran’s last name',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName,
    },
  },
};
