import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import {
  shortFormAlert,
  shortFormMessage,
  HIGH_DISABILITY,
  medicaidDescription,
  emptyObjectSchema,
} from '../../../helpers';

const { isMedicaidEligible } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:shortFormAlert': {
      'ui:description': shortFormAlert,
      'ui:options': {
        hideIf: form => form.vaCompensationType !== 'highDisability',
      },
    },
    'view:medicaidShortFormMessage': {
      'ui:description': shortFormMessage,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
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
      'view:medicaidShortFormMessage': emptyObjectSchema,
      'view:medicaidDescription': emptyObjectSchema,
      isMedicaidEligible,
    },
  },
};
