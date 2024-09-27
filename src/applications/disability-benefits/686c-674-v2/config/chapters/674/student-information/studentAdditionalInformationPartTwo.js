import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { StudentAddressH3 } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    studentInformation: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          address: addressSchema(),
        },
      },
    },
  },
};

export const uiSchema = {
  studentInformation: {
    items: {
      'ui:title': StudentAddressH3,
      address: addressUI({
        labels: {
          militaryCheckbox:
            'They receive mail outside of the United States on a U.S. military base.',
        },
      }),
    },
  },
};
