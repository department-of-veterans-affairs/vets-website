import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import {
  addressSchema,
  addressUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
    addressOld: {
      ...addressUiSchema('addressOld', undefined, () => true),
    },
    wc: titleUI('Web component', {
      classNames: 'vads-u-margin-top--4',
    }),
    addressNew: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      addressOld: fullSchema.properties.veteran.properties.address,
      wc: titleSchema,
      addressNew: addressSchema(),
    },
    required: [],
  },
};
