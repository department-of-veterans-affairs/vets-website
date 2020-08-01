import _ from 'lodash';

// import test from 'vets-json-schema/dist/'
// import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';
import fullSchema from '../schema/covid-vaccine-trial-schema_temp.json';
import uiSchemaDefinitions from '../schema/covid-vaccine-trial-ui-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import dataUtils from 'platform/utilities/data/index';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const { fullName } = definitions;
const { get, omit, set } = dataUtils;

export function validateEmailsMatch(errors, pageData) {
  const { email, confirmEmail } = pageData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
  }
}
export function validatePhone(errors, pageData) {
  const { phone } = pageData;
  if (phone && !/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(phone)) {
    errors.phone.addError('Please enter a valid 10-digit phone number');
  }
}
const formConfig = {
  urlPrefix: '/',
  submitUrl: '/v0/api',
  trackingPrefix: 'covid-vaccine-trial-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '12345',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for vaccine trial participation.',
    noAuth:
      'Please sign in again to continue your application for vaccine trial participation.',
  },
  title: 'Covid Vaccine Trial',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'covid-vaccine-trial',
          title: 'Personal Information - Page 1',
          uiSchema: {
            'ui:description': uiSchemaDefinitions.descriptionText, // todo - figure out how to get this to use formatting
            diagnosed: uiSchemaDefinitions.diagnosed,
            hospitalized: uiSchemaDefinitions.hospitalized,
            smokeOrVape: uiSchemaDefinitions.smokeOrVape,
            healthHistory: uiSchemaDefinitions.healthHistory,
            employmentStatus: uiSchemaDefinitions.employmentStatus,
            transportation: uiSchemaDefinitions.transportation,
            residents: uiSchemaDefinitions.residents,
            closeContact: uiSchemaDefinitions.closeContact,
            'view:contactInfoDescription': {
              'ui:description':
                'Your contact information (all fields required)',
            },
            'ui:validations': [validateEmailsMatch, validatePhone],
            fullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'Your first name',
              },
              last: {
                'ui:title': 'Your last name',
              },
              middle: {
                'ui:title': 'Your middle name',
              },
              suffix: {
                'ui:title': 'Your suffix',
              },
              'ui:order': ['first', 'middle', 'last', 'suffix'],
            }),
            email: emailUI(),
            confirmEmail: emailUI('Confirm email address'),
            phone: phoneUI(),
          },
          schema: {
            required: ['phone'],
            type: 'object',
            properties: {
              diagnosed: {
                type: 'boolean',
              },
              hospitalized: {
                type: 'boolean',
              },
              smokeOrVape: {
                type: 'boolean',
              },
              healthHistory: fullSchema.properties.healthHistory,
              employmentStatus: fullSchema.properties.employmentStatus,
              transportation: fullSchema.properties.transportation,
              residents: fullSchema.properties.residentsInHome,
              closeContact: fullSchema.properties.closeContact,
              'view:contactInfoDescription': {
                type: 'object',
                properties: {},
              },
              fullName: set('required', ['first', 'last'], fullName),
              email: {
                type: 'string',
                format: 'email',
              },
              confirmEmail: {
                type: 'string',
                format: 'email',
              },
              phone: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
