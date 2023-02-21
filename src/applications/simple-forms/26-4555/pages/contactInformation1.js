import { intersection, pick } from 'lodash';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.address];

export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.address]: addressUiSchema(
        `${[veteranFields.parentObject]}.${[veteranFields.address]}`,
        undefined,
        () => true,
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
