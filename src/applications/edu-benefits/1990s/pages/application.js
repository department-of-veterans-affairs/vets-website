import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import PrefillAlert from '../components/PrefillAlert';
import { validateMatch } from 'platform/forms-system/src/js/validation';
import {
  uiSchema as directDepositUiSchema,
  schema as directDepositSchema,
} from './directDeposit';

import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from 'platform/forms/definitions/address';
import _ from 'lodash';

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

const addressUiSchema = addressUISchema('Mailing address', false, false);
const address = addressSchema(fullSchema, false);
const hasNotSelectedProgram = form =>
  !_.get(form['view:programSelection'], 'hasSelectedProgram', true);

const path = 'apply';
const title = 'VRRAP application';
const uiSchema = {
  'view:alert': {
    'ui:title': PrefillAlert,
  },
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
      'ui:validations': [
        validateMatch('email', 'view:confirmEmail', { ignoreCase: true }),
      ],
      mobilePhone: phoneUI('Mobile phone number'),
      alternatePhone: phoneUI('Home phone number'),
      email: emailUI(),
      'view:confirmEmail': _.merge(emailUI('Confirm email address'), {
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
  'view:directDeposit': directDepositUiSchema,
  'view:programSelection': {
    'ui:title': 'Program information',
    hasSelectedProgram: {
      'ui:title': "Do you know which program you'd like to enroll in?",
      'ui:widget': 'yesNo',
    },
    providerName: {
      'ui:title': "What's the name of the school or training provider?",
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
      'ui:title': 'Which city is the program in?',
      'ui:options': {
        hideIf: hasNotSelectedProgram,
      },
    },
    programState: {
      'ui:title': 'Which state is the program in?',
      'ui:options': {
        hideIf: hasNotSelectedProgram,
      },
    },
    learningFormat: {
      'ui:title': 'Is the program in-person, online, or both?',
      'ui:widget': 'radio',
      'ui:options': {
        hideIf: hasNotSelectedProgram,
        labels: {
          inPerson: 'In-person',
          online: 'Online',
          onlineAndInPerson: 'Both in-person and online',
        },
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    'view:alert': {
      type: 'object',
      properties: {},
    },
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
    'view:directDeposit': directDepositSchema,
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
