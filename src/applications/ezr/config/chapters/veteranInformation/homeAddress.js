import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  addressUI,
  addressSchema,
  descriptionUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

const {
  veteranHomeAddress: { properties: schemaOverride },
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:pageTitle': titleUI(content['vet-home-address-title']),
    veteranHomeAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': titleSchema,
      veteranHomeAddress: merge({}, addressSchema(), {
        properties: schemaOverride,
      }),
    },
  },
};
