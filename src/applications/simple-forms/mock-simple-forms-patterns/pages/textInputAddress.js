import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    addressOld: {
      ...addressUiSchema('addressOld', undefined, () => true),
    },
  },
  schema: {
    type: 'object',
    properties: {
      addressOld: fullSchema.properties.veteran.properties.address,
    },
    required: [],
  },
};
