// import * as address from 'platform/forms-system/src/js/definitions/address';
import addressUiSchema, {
  updateFormDataAddress,
  COUNTRY_VALUES,
  COUNTRY_NAMES,
} from 'platform/forms-system/src/js/definitions/profileAddress';

// Include this cross-reference if the uiSchema doesn't match the schema
const addressKeys = {
  // addressUiSchema default key : schema key
  isMilitary: 'isMilitary',
  'view:militaryBaseDescription': 'view:militaryBaseDescription',
  country: 'country',
  street: 'street',
  street2: 'street2',
  street3: 'street3',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
};

const contactInformation = {
  uiSchema: {
    address2: addressUiSchema(
      'address2', // path to form data (array or "string.with.path")
      undefined, // Checkbox title (undefined will show default title)
      () => true, // required callback (country, street, city, postal code)
      addressKeys, // address keys in form data
    ),
  },
  schema: {
    type: 'object',
    properties: {
      address2: {
        type: 'object',
        properties: {
          [addressKeys.isMilitary]: {
            type: 'boolean',
          },
          [addressKeys['view:militaryBaseDescription']]: {
            type: 'object',
            properties: {},
          },
          [addressKeys.country]: {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
          [addressKeys.street]: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          [addressKeys.street2]: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          [addressKeys.street3]: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          [addressKeys.city]: {
            type: 'string',
          },
          [addressKeys.state]: {
            type: 'string',
          },
          [addressKeys.postalCode]: {
            type: 'string',
          },
        },
      },
    },
  },

  updateFormData: (oldFormData, formData) => {
    const path = 'address2'; // path to address in formData (array or string)
    const index = null; // index of address inside an array
    return updateFormDataAddress(
      oldFormData,
      formData,
      path,
      index,
      addressKeys,
    );
  },
};

export default contactInformation;
