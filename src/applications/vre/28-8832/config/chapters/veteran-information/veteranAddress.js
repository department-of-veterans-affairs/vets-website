import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  buildAddressSchema,
  addressUISchema,
} from '../../../../../disability-benefits/686c-674/config/address-schema';
import { isVeteran } from '../../helpers';

const veteranAddress = buildAddressSchema(true);
// reset boolean type for checkbox
veteranAddress.properties['view:livesOnMilitaryBase'] = {
  type: 'boolean',
};

export const schema = {
  type: 'object',
  properties: {
    veteranAddress,
    phone: {
      type: 'string',
      minLength: 10,
    },
    emailAddress: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
      pattern:
        '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
    },
  },
};

export const uiSchema = {
  veteranAddress: addressUISchema(true, 'veteranAddress', () => true),
  phone: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': formData => isVeteran(formData),
    'ui:title': 'Phone number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  emailAddress: emailUI(),
};
