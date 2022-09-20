import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { medicaidDescription } from '../../../helpers';

const { isMedicaidEligible } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': medicaidDescription,
    isMedicaidEligible: {
      'ui:title': 'Are you eligible for Medicaid?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible'],
    properties: {
      isMedicaidEligible,
    },
  },
};
