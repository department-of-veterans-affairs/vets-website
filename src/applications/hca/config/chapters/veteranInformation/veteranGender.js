import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { SIGIGenderDescription } from '../../../components/FormDescriptions';

const { sigiGenders } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Gender identity',
    'ui:description': SIGIGenderDescription,
    sigiGenders: {
      'ui:title': 'Select your gender identity',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          NB: 'Non-binary',
          M: 'Man',
          F: 'Woman',
          TM: 'Transgender man',
          TF: 'Transgender woman',
          O: 'A gender not listed here',
          NA: 'Prefer not to answer',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: { sigiGenders },
  },
};
