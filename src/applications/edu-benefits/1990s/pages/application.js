import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import directDeposit from 'platform/forms-system/src/js/definitions/directDeposit';

import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from 'platform/forms/definitions/address';
import _ from 'lodash';
import { bankInfoHelpText, directDepositAlert } from '../content/directDeposit';

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
} = fullSchema.properties;

const addressUiSchema = addressUISchema('Mailing address', false);
const address = addressSchema(fullSchema, true);
const bankFieldIsRequired = form =>
  !form['view:directDeposit'].declineDirectDeposit;
const hasNotSelectedProgram = form =>
  !_.get(form['view:programSelection'], 'hasSelectedProgram', true);

const {
  uiSchema: directDepositUiSchema,
  schema: directDepositSchema,
} = directDeposit({
  optionalFields: { bankName: false, declineDirectDeposit: true },
});

const path = 'apply';
const title = 'VRRAP application';
const uiSchema = {
  'view:applicantInformation': {
    'ui:title': 'Applicant information',
    veteranFullName: fullNameUI,
    veteranSocialSecurityNumber: ssnUI,
    dateOfBirth: {
      ...currentOrPastDateUI('Your date of birth'),
      'ui:errorMessages': {
        required: 'Please provide a valid date',
        futureDate: 'Please provide a valid date in the past',
      },
    },
  },
  'view:contactInformation': {
    'ui:title': 'Contact information',
    'view:phoneAndEmail': {
      'ui:title': 'Phone & email',
      mobilePhone: phoneUI('Mobile phone number'),
      alternatePhone: phoneUI('Home phone number'),
      email: emailUI(),
      'view:confirmEmail': _.merge(emailUI('Re-enter email address'), {
        'ui:options': {
          hideOnReview: true,
        },
      }),
    },
    address: {
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
    ...directDepositUiSchema,
    'ui:order': null, // have to null this out and declare properties in correct order
    bankAccount: {
      ...directDepositUiSchema.bankAccount,
      'ui:order': null, // have to null this out and declare properties in correct order
      'ui:options': {
        ...directDepositUiSchema.bankAccount['ui:options'],
        hideIf: form => !bankFieldIsRequired(form),
      },
      'view:paymentText': {
        'ui:description':
          "We make payments only through direct deposit, also called electronic funds transfer (EFT). Please provide your direct deposit information below. We'll pay your housing stipend to this account.",
      },
      accountType: {
        ...directDepositUiSchema.bankAccount.accountType,
        'ui:required': bankFieldIsRequired,
      },
      routingNumber: {
        ...directDepositUiSchema.bankAccount.routingNumber,
        'ui:required': bankFieldIsRequired,
      },
      accountNumber: {
        ...directDepositUiSchema.bankAccount.accountNumber,
        'ui:required': bankFieldIsRequired,
      },
    },
    declineDirectDeposit: directDepositUiSchema.declineDirectDeposit,
    'view:directDespositInfo': {
      ...directDepositUiSchema['view:directDespositInfo'],
      'ui:description': directDepositAlert,
    },
    'view:bankInfoHelpText': {
      ...directDepositUiSchema['view:bankInfoHelpText'],
      'ui:description': bankInfoHelpText,
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
      'ui:options': {
        hideIf: hasNotSelectedProgram,
      },
    },
    programName: {
      'ui:title': "What's the name of the program?",
      'ui:options': {
        hideIf: hasNotSelectedProgram,
      },
    },
    programCity: {
      'ui:title': 'What city is the program in?',
      'ui:options': {
        hideIf: hasNotSelectedProgram,
      },
    },
    programState: {
      'ui:title': 'What state is the program in?',
      'ui:options': {
        hideIf: hasNotSelectedProgram,
      },
    },
    learningFormat: {
      'ui:title': 'Is the program in-person, online or both?',
      'ui:widget': 'radio',
      'ui:options': {
        hideIf: hasNotSelectedProgram,
        labels: {
          inPerson: 'In-person',
          online: 'Online',
          onlineAndInPerson: "It's both online and in person",
        },
      },
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
          required: ['mobilePhone', 'email', 'view:confirmEmail'],
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
        address,
        'view:contactInfoNote': {
          type: 'object',
          properties: {},
        },
      },
    },
    'view:directDeposit': {
      type: 'object',
      properties: {
        bankAccount: {
          type: 'object',
          properties: {
            'view:paymentText':
              directDepositSchema.properties.bankAccount.properties[
                'view:paymentText'
              ],
            accountType:
              directDepositSchema.properties.bankAccount.properties.accountType,
            'view:ddDescription':
              directDepositSchema.properties.bankAccount.properties[
                'view:ddDescription'
              ],
            routingNumber:
              directDepositSchema.properties.bankAccount.properties
                .routingNumber,
            accountNumber:
              directDepositSchema.properties.bankAccount.properties
                .accountNumber,
          },
        },
        declineDirectDeposit: {
          type: 'boolean',
        },
        'view:directDespositInfo':
          directDepositSchema.properties['view:directDespositInfo'],
        'view:bankInfoHelpText':
          directDepositSchema.properties['view:bankInfoHelpText'],
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
  },
};

export { path, title, uiSchema, schema };
