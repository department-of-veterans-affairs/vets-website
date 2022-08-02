import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { AmericanIndianDescription } from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const { sigiIsAmericanIndian } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:aiqShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
      },
    },
    'view:aiqDescription': {
      'ui:description': AmericanIndianDescription,
    },
    sigiIsAmericanIndian: {
      'ui:title':
        'Are you recognized as an American Indian or Alaska Native by any tribal, state, or federal law or regulation?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['sigiIsAmericanIndian'],
    properties: {
      'view:aiqShortFormMessage': emptyObjectSchema,
      'view:aiqDescription': emptyObjectSchema,
      sigiIsAmericanIndian,
    },
  },
};
