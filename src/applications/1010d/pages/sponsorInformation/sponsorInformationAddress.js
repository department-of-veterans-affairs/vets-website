import fullSchema from '../../10-10D-schema.json';
import { addressWithAutofillUI } from '../../../caregivers/definitions/UIDefinitions/sharedUI';

const { veteran } = fullSchema.properties;

const veteranFields = {
  address: 'primaryAddress',
};

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
