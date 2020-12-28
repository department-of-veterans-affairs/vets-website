import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { uiSchema } from '../pages/covidResearchUISchema';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  ConsentNotice,
  ConsentLabel,
  ConsentError,
} from '../containers/ConsentFormContent';
import submitForm from './submitForm';

import { updateData, transform } from './formHelper';
import manifest from '../manifest.json';

const { fullName, email, usaPhone, date, usaPostalCode } = definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/covid-research/volunteer/create`,
  trackingPrefix: 'covid-research-volunteer-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_COVID_VACCINE_TRIAL,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your [savedFormDescription] is in progress.',
    //   expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
    //   saved: 'Your [benefitType] [appType] has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  customText: {
    reviewPageTitle: 'Review information',
    appType: 'volunteer form',
  },
  savedFormMessages: {
    notFound:
      'Please start over to sign up for our coronavirus research volunteer list.',
    noAuth:
      'Please sign in again to continue to sign up for our coronavirus research volunteer list.',
  },
  title: 'Sign up for our coronavirus research volunteer list',
  defaultDefinitions: {},
  preSubmitInfo: {
    required: true,
    field: 'consentAgreementAccepted',
    label: ConsentLabel(),
    notice: ConsentNotice(),
    error: ConsentError(),
  },
  submit: submitForm,
  chapters: {
    chapter1: {
      title: 'Your information',
      pages: {
        page1: {
          path: 'sign-up',
          title: 'Your information - page 1',
          updateFormData: updateData,
          uiSchema,
          schema: {
            required: fullSchema.required,
            type: 'object',
            properties: {
              descriptionText: {
                type: 'object',
                properties: {
                  'view:descriptionText': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              formCompleteTimeText: {
                type: 'object',
                properties: {
                  'view:formCompleteTimeText': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              healthHeaderText: {
                type: 'object',
                properties: {
                  'view:healthText': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              diagnosed: fullSchema.properties.diagnosed,
              DIAGNOSED_DETAILS: fullSchema.properties.DIAGNOSED_DETAILS,
              closeContactPositive: fullSchema.properties.closeContactPositive,
              hospitalized: fullSchema.properties.hospitalized,
              smokeOrVape: fullSchema.properties.smokeOrVape,
              HEALTH_HISTORY: fullSchema.properties.HEALTH_HISTORY,
              exposureRiskHeaderText: {
                type: 'object',
                properties: {
                  'view:exposureRiskText': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              EMPLOYMENT_STATUS: fullSchema.properties.EMPLOYMENT_STATUS,
              TRANSPORTATION: fullSchema.properties.TRANSPORTATION,
              residentsInHome: fullSchema.properties.residentsInHome,
              closeContact: fullSchema.properties.closeContact,
              contactHeaderText: {
                type: 'object',
                properties: {
                  'view:contactText': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              veteranFullName: fullName,
              email,
              phone: usaPhone,
              zipCode: usaPostalCode,
              veteranDateOfBirth: date,
              VETERAN: fullSchema.properties.VETERAN,
              GENDER: fullSchema.properties.GENDER,
              GENDER_SELF_IDENTIFY_DETAILS:
                fullSchema.properties.GENDER_SELF_IDENTIFY_DETAILS,
              RACE_ETHNICITY: fullSchema.properties.RACE_ETHNICITY,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
