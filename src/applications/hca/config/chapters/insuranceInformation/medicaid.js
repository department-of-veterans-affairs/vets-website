import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { shortFormAlert, medicaidDescription } from '../../../helpers';

const { isMedicaidEligible } = fullSchemaHca.properties;

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema: {
    'view:shortFormAlert': {
      'ui:description': shortFormAlert,
      'ui:options': {
        hideIf: form => form.vaCompensationType !== 'highDisability',
      },
    },
    'view:medicaidDescription': {
      'ui:description': medicaidDescription,
    },
    isMedicaidEligible: {
      'ui:title': 'Are you eligible for Medicaid?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isMedicaidEligible'],
    properties: {
      'view:shortFormAlert': emptyObjectSchema,
      'view:medicaidDescription': emptyObjectSchema,
      isMedicaidEligible,
    },
  },
};
