import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { fullNameUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

const { veteranFullName } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    'ui:title': generateTitle('Personal information'),
    veteranFullName: fullNameUI(title => `Veteran’s ${title}`),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName,
    },
  },
};
