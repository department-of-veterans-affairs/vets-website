import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import bankAccountUI from 'platform/forms/definitions/bankAccount';

import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from 'platform/forms/definitions/address';
import _ from 'lodash/fp';
import {
  bankInfoHelpText,
  directDepositAlert,
  directDepositDescription,
} from '../content/directDeposit';

import {
  confirmEligibilityDescription,
  confirmEligibilityNote,
} from '../content/confirmEligibility';

const {
  veteranFullName,
  veteranSocialSecurityNumber,
  dateOfBirth,
  email,
  mobilePhone,
  alternatePhone,
  hasSelectedProgram,
  providerName,
  programName,
  programCity,
  programState,
  learningFormat,
  vrrapConfirmation,
} = fullSchema.properties;

const { bankAccount } = fullSchema.definitions;

const addressUiSchema = addressUISchema('Mailing address', false);
const address = addressSchema(fullSchema, true);
const useDirectDeposit = form => !form?.declineDirectDeposit;

const path = 'form';
const title = 'Application';
const uiSchema = {
  'view:applicantInformation': {
    'ui:title': 'Applicant Information',
    veteranFullName: fullNameUI,
    veteranSocialSecurityNumber: ssnUI,
    dateOfBirth: {
      ...currentOrPastDateUI('Date of birth'),
      'ui:errorMessages': {
        required: 'Please provide a valid date',
        futureDate: 'Please provide a valid date',
      },
    },
  },
  'view:contactInformation': {
    'ui:title': 'Contact Information',
    'view:phoneAndEmail': {
      'ui:title': 'Phone & email',
      mobilePhone: phoneUI('Mobile phone number'),
      alternatePhone: phoneUI('Alternate phone number'),
      email: emailUI(),
      'view:confirmEmail': _.merge(emailUI('Re-enter email address'), {
        'ui:options': {
          hideOnReview: true,
        },
      }),
    },
    mailingAddress: {
      ...addressUiSchema,
      'ui:options': {
        ...addressUiSchema['ui:options'],
      },
      street: {
        ...addressUiSchema.street,
        'ui:title': 'Street address',
      },
      city: addressUiSchema.city,
    },
  },
  'view:directDeposit': {
    'ui:title': 'Direct deposit',
    'ui:description': directDepositDescription,
    bankAccount: {
      'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
      accountType: {
        ...bankAccountUI.accountType,
        'ui:required': useDirectDeposit,
      },
      routingNumber: {
        ...bankAccountUI.routingNumber,
        'ui:title': 'Bank routing number',
        'ui:required': useDirectDeposit,
      },
      accountNumber: {
        ...bankAccountUI.accountNumber,
        'ui:title': 'Bank account number',
        'ui:required': useDirectDeposit,
      },
      'ui:options': {
        classNames: 'vads-u-margin-bottom--3',
        hideIf: form => form?.declineDirectDeposit,
      },
    },
    'view:declineDirectDeposit': {
      'ui:title': "I don't want to use direct deposit",
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    'view:directDespositInfo': {
      'ui:description': directDepositAlert,
    },
    'view:bankInfoHelpText': {
      'ui:description': bankInfoHelpText,
      'ui:options': {
        classNames: 'vads-u-margin-top--4',
      },
    },
  },
  'view:programSelection': {
    'ui:title': 'Program Selection',
    hasSelectedProgram: {
      'ui:title': 'Have you picked a program you’d like to attend using VRRAP?',
      'ui:widget': 'yesNo',
    },
    providerName: {
      'ui:title': "What's the name of the program’s provider?",
    },
    programName: {
      'ui:title': "What's the name of the program?",
    },
    programCity: {
      'ui:title': 'What city is the program in?',
    },
    programState: {
      'ui:title': 'What state is the program in?',
    },
    learningFormat: {
      'ui:title': 'Is it an in-person or online program?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          inPerson: 'In-person',
          online: 'Online',
          onlineAndInPerson: "It's both online and in person",
        },
      },
    },
  },
  'view:confirmEligibility': {
    'ui:title': "Confirm you're eligibile for VRRAP",
    'ui:description': confirmEligibilityDescription,
    vrrapConfirmation: {
      'ui:title':
        'I attest the statements above are true and accurate to the best of my knowledge and belief.',
      'ui:widget': 'yesNo',
    },
    'view:confirmEligibilityNote': {
      'ui:description': confirmEligibilityNote,
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    'view:applicantInformation': {
      type: 'object',
      required: [
        'veteranFullName',
        'dateOfBirth',
        'veteranSocialSecurityNumber',
      ],
      properties: {
        veteranFullName,
        veteranSocialSecurityNumber,
        dateOfBirth,
      },
    },
    'view:contactInformation': {
      type: 'object',
      properties: {
        'view:phoneAndEmail': {
          type: 'object',
          required: ['mobilePhoneNumber', 'email'],
          properties: {
            mobilePhone,
            alternatePhone,
            email,
            'view:confirmEmail': {
              type: 'string',
              format: 'email',
            },
          },
        },
        mailingAddress: address,
        'view:contactInfoNote': {
          type: 'object',
          properties: {},
        },
      },
    },
    'view:directDeposit': {
      type: 'object',
      properties: {
        bankAccount,
        'view:declineDirectDeposit': {
          type: 'boolean',
        },
        'view:directDespositInfo': {
          type: 'object',
          properties: {},
        },
        'view:bankInfoHelpText': {
          type: 'object',
          properties: {},
        },
      },
    },
    'view:programSelection': {
      type: 'object',
      required: ['hasSelectedProgram'],
      properties: {
        hasSelectedProgram,
        providerName,
        programName,
        programCity,
        programState,
        learningFormat,
      },
    },
    'view:confirmEligibility': {
      type: 'object',
      properties: {
        vrrapConfirmation,
      },
    },
  },
};

export { path, title, uiSchema, schema };
