// @ts-check
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const addressSchemaWithDefault = addressSchema();

addressSchemaWithDefault.properties.country.default = 'USA';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      'We’ll send any important information about your application to this address.',
    ),
    claimantAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantAddress: addressSchemaWithDefault,
    },
  },
};
