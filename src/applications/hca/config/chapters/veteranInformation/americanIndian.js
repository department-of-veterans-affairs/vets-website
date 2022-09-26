import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { AmericanIndianDescription } from '../../../components/FormDescriptions';
import { ShortFormAlert } from '../../../components/FormAlerts';
import { NotHighDisability } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';

const { sigiIsAmericanIndian } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:aiqShortFormMessage': {
      'ui:description': ShortFormAlert,
      'ui:options': {
        hideIf: NotHighDisability,
      },
    },
    'view:aiqDescription': {
      'ui:description':
        'If any of these descriptions are true for you, you may not need to pay a copay for care or services.',
    },
    sigiIsAmericanIndian: {
      'ui:title': 'Are any of these descriptions true for you?',
      'ui:description': AmericanIndianDescription,
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
