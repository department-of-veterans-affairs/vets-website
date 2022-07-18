import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { MedicaidDescription } from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const { isMedicaidEligible } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:medicaidShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            ((form['view:totalDisabilityRating'] &&
              form['view:totalDisabilityRating'] >= HIGH_DISABILITY) ||
              form.vaCompensationType === 'highDisability')
          ),
      },
    },
    'view:medicaidDescription': {
      'ui:description': MedicaidDescription,
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
