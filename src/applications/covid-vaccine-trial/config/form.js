import _ from 'lodash';
import environment from 'platform/utilities/environment';

// import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';
import fullSchema from '../schema/covid-vaccine-trial-schema_temp.json';
import uiSchemaDefinitions from '../schema/covid-vaccine-trial-ui-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import dataUtils from 'platform/utilities/data/index';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const {
  descriptionText,
  infoSharingText,
  healthHeaderText,
  diagnosed,
  closeContactPositive,
  hospitalized,
  smokeOrVape,
  healthHistory,
  exposureRiskHeaderText,
  employmentStatus,
  transportation,
  residents,
  closeContact,
  contactHeaderText,
  zipCode,
  height,
  weight,
  gender,
  raceEthnicityOrigin,
  // closingText,
} = uiSchemaDefinitions;

const { fullName, email, usaPhone, date } = definitions;
const { set } = dataUtils;

export function validateEmailsMatch(errors, pageData) {
  const { primaryEmail, confirmEmail } = pageData;
  if (primaryEmail !== confirmEmail) {
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
  submitUrl: `${environment.API_URL}/covid-vaccine/screener/create`,
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
  title: 'Volunteer for COVID-19 research',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Personal Information',
      pages: {
        page1: {
          path: 'covid-vaccine-trial',
          title: 'Personal Information - Page 1',
          uiSchema: {
            descriptionText,
            infoSharingText,
            healthHeaderText,
            diagnosed,
            closeContactPositive,
            hospitalized,
            smokeOrVape,
            healthHistory,
            exposureRiskHeaderText,
            employmentStatus,
            transportation,
            residents,
            closeContact,
            contactHeaderText,
            // closingText,
            'ui:validations': [validateEmailsMatch, validatePhone],
            fullName: _.merge(fullNameUI, {
              first: {
                'ui:title': 'First name',
              },
              last: {
                'ui:title': 'Last name',
              },
              middle: {
                'ui:title': 'Middle name',
              },
              suffix: {
                'ui:title': 'Suffix',
              },
              'ui:order': ['first', 'middle', 'last', 'suffix'],
            }),
            primaryEmail: emailUI(),
            confirmEmail: emailUI('Confirm email address'),
            zipCode,
            phone: phoneUI(),
            dateOfBirth: currentOrPastDateUI(
              'Date of birth (Note: You must be at least 18 years old to participate in research.)',
            ),
            height,
            weight,
            gender,
            raceEthnicityOrigin,
          },
          schema: {
            required: ['phone'],
            type: 'object',
            properties: {
              descriptionText: fullSchema.properties.descriptionText,
              infoSharingText: fullSchema.properties.infoSharingText,
              healthHeaderText: fullSchema.properties.healthHeaderText,
              diagnosed: fullSchema.properties.diagnosed,
              closeContactPositive: fullSchema.properties.closeContactPositive,
              hospitalized: fullSchema.properties.hospitalized,
              smokeOrVape: fullSchema.properties.smokeOrVape,
              healthHistory: fullSchema.properties.healthHistory,
              exposureRiskHeaderText:
                fullSchema.properties.exposureRiskHeaderText,
              employmentStatus: fullSchema.properties.employmentStatus,
              transportation: fullSchema.properties.transportation,
              residents: fullSchema.properties.residentsInHome,
              closeContact: fullSchema.properties.closeContact,
              contactHeaderText: fullSchema.properties.contactHeaderText,
              fullName: set('required', ['first', 'last'], fullName),
              primaryEmail: email,
              confirmEmail: email,
              phone: usaPhone,
              zipCode: fullSchema.properties.zipCode,
              dateOfBirth: date,
              height: fullSchema.properties.height,
              weight: fullSchema.properties.weight,
              gender: fullSchema.properties.gender,
              raceEthnicityOrigin: fullSchema.properties.raceEthnicityOrigin,
              // closingText: fullSchema.properties.closingText,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
