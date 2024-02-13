import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  addressUI,
  addressSchema,
  descriptionUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const {
  veteranContacts: { items: emergencyContact },
} = ezrSchema.properties;
const {
  address: { properties: schemaOverride },
} = emergencyContact.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': titleSchema,
      address: merge({}, addressSchema(), {
        properties: schemaOverride,
      }),
    },
  },
};
