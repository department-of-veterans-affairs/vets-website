import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import AuthenticatedShortFormAlert from '../../../components/FormAlerts/AuthenticatedShortFormAlert';
import { BirthInfoDescription } from '../../../components/FormDescriptions';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

const { cityOfBirth, stateOfBirth } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'view:authShortFormAlert': {
      'ui:field': AuthenticatedShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
      },
    },
    'view:placeOfBirth': {
      'ui:title': 'Place of birth',
      'ui:description': BirthInfoDescription,
      cityOfBirth: {
        'ui:title': 'City',
      },
      stateOfBirth: {
        'ui:title': 'State/Province/Region',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:authShortFormAlert': emptyObjectSchema,
      'view:placeOfBirth': {
        type: 'object',
        properties: {
          cityOfBirth,
          stateOfBirth,
        },
      },
    },
  },
};
