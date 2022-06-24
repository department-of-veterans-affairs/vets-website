import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { countries, states } from 'platform/forms/address';

import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';
import { BirthInfoDescription } from '../../../components/FormDescriptions';
import AuthenticatedShortFormAlert from '../../../components/AuthenticatedShortFormAlert';

const { cityOfBirth } = fullSchemaHca.properties;

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
      countryOfBirth: {
        'ui:title': 'Country',
      },
      cityOfBirth: {
        'ui:title': 'City',
      },
      stateOfBirth: {
        'ui:title': 'State/Province/Region',
        'ui:options': {
          hideIf: formData => {
            const { countryOfBirth } = formData['view:placeOfBirth'];
            return !states[countryOfBirth]?.length;
          },
          updateSchema: formData => {
            const { countryOfBirth } = formData['view:placeOfBirth'];
            return states[countryOfBirth]?.length
              ? {
                  enum: states[countryOfBirth].map(object => object.value),
                  enumNames: states[countryOfBirth].map(object => object.label),
                }
              : { enum: [], enumNames: [] };
          },
        },
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
          countryOfBirth: {
            default: 'USA',
            type: 'string',
            enum: countries.map(object => object.value),
            enumNames: countries.map(object => object.label),
          },
          cityOfBirth,
          stateOfBirth: {
            type: 'string',
            enum: states.USA.map(object => object.value),
            enumNames: states.USA.map(object => object.label),
          },
        },
      },
    },
  },
};
