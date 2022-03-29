// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import * as address from 'platform/forms-system/src/js/definitions/address';
import bankAccountUI from 'platform/forms-system/src/js/definitions/bankAccount';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

import fullSchema from '../00-1234-schema.json';
import { hasDirectDeposit, directDepositWarning } from '../helpers';

const { usaPhone, bankAccount } = commonDefinitions;

const additionalInformationChapter = {
  title: 'Chapter Title: Additional Information (manual method)',
  pages: {
    contactInformation: {
      path: 'contact-information',
      title: 'Section Title: Contact Information',
      uiSchema: {
        address: address.uiSchema('Mailing address'),
        email: {
          'ui:title': 'Primary email',
        },
        altEmail: {
          'ui:title': 'Secondary email',
        },
        phoneNumber: phoneUI('Daytime phone'),
      },
      schema: {
        type: 'object',
        properties: {
          address: address.schema(fullSchema, true),
          email: {
            type: 'string',
            format: 'email',
          },
          altEmail: {
            type: 'string',
            format: 'email',
          },
          phoneNumber: usaPhone,
        },
      },
    },

    directDeposit: {
      path: 'direct-deposit',
      title: 'Section Title: Direct Deposit',
      uiSchema: {
        'ui:title': 'Direct deposit',
        viewNoDirectDeposit: {
          'ui:title': 'I don’t want to use direct deposit',
        },
        bankAccount: {
          ...bankAccountUI,
          'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
          'ui:options': {
            hideIf: formData => !hasDirectDeposit(formData),
          },
          accountType: {
            'ui:required': hasDirectDeposit,
          },
          accountNumber: {
            'ui:required': hasDirectDeposit,
          },
          routingNumber: {
            'ui:required': hasDirectDeposit,
          },
        },
        viewStopWarning: {
          'ui:description': directDepositWarning,
          'ui:options': {
            hideIf: hasDirectDeposit,
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          viewNoDirectDeposit: {
            type: 'boolean',
          },
          bankAccount,
          viewStopWarning: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default additionalInformationChapter;
