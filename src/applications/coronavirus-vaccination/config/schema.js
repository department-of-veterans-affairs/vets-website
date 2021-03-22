import { buildAddressSchema } from '../../disability-benefits/686c-674/config/address-schema';

const addressSchema = buildAddressSchema(false);

export default {
  type: 'object',
  required: [
    'firstName',
    'lastName',
    'email',
    'phone',
    'zipCode',
    'vaccineInterest',
    'locationDetails',
  ],
  properties: {
    isIdentityVerified: {
      type: 'boolean',
    },
    isNewRegistration: {
      type: 'boolean',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    birthDate: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    },
    ssn: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    phone: {
      type: 'string',
      pattern: '\\(?\\d{3}\\)?-?\\d{3}-?\\d{4}$',
    },
    address: addressSchema,
    zipCode: {
      type: 'string',
      pattern: '^\\d{5}(-\\d{4})?$',
    },
    locationDetails: {
      type: 'string',
      enum: ['Yes', 'No', 'Unsure'],
    },
    vaccineInterest: {
      type: 'string',
      enum: ['INTERESTED', 'NOT_INTERESTED', 'UNDECIDED', 'PREFER_NO_ANSWER'],
    },
  },
};
