import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Contact Information Page for Representative Form
 *
 * Simplified version that collects the veteran's contact information.
 * This is a local version to avoid dependencies on all-claims specific imports.
 */

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description':
    'Enter the veteran\u2019s current contact information for claim correspondence.',
  phoneAndEmail: {
    primaryPhone: phoneUI('Primary phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: addressUI({
    labels: {
      street: 'Street address',
      street2: 'Street address line 2',
      street3: 'Street address line 3',
      city: 'City',
      state: 'State',
      postalCode: 'Postal code',
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail: {
      type: 'object',
      required: ['primaryPhone', 'emailAddress'],
      properties: {
        primaryPhone: {
          type: 'string',
          pattern: '^\\d{10}$',
        },
        emailAddress: {
          type: 'string',
          format: 'email',
        },
      },
    },
    mailingAddress: addressSchema(),
  },
};

export default {
  uiSchema,
  schema,
};
