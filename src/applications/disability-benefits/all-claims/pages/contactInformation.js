import {
  mappedAddressUI,
  mappedAddressSchema,
  updateMappedFormDataAddress,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

import {
  contactInfoDescription,
  contactInfoUpdateHelpDescription,
  phoneEmailViewField,
} from '../content/contactInformation';

const {
  // forwardingAddress,
  phoneAndEmail,
} = fullSchema.properties;

export const updateFormData = (oldFormData, formData) => {
  return updateMappedFormDataAddress(
    oldFormData,
    formData,
    ['mailingAddress'],
    null,
    {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
    },
  );
};

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: mappedAddressUI({
    keyMap: {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
    },
  }),
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress: mappedAddressSchema({
      keyMap: {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
      },
    }),
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
