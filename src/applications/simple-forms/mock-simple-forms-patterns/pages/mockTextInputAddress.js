import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import {
  addressSchema,
  addressUI,
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    addressOld: {
      ...addressUiSchema('addressOld', undefined, () => true),
    },
    'view:wcv3Title': inlineTitleUI('Web component'),
    wcv3Address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      addressOld: fullSchema.properties.veteran.properties.address,
      'view:wcv3Title': inlineTitleSchema,
      wcv3Address: addressSchema(),
    },
    required: [],
  },
};
