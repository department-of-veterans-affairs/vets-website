import { addressWithAutofillUI } from '../../../caregivers/definitions/UIDefinitions/sharedUI';
import { veteranFields } from '../../../caregivers/definitions/constants';

import fullSchema from '../../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    [veteranFields.address]: addressWithAutofillUI,
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.address]: veteran.properties.address,
    },
  },
};
