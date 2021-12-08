import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { uiSchema } from '../pages/covidResearchUISchema';
// import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  ConsentNotice,
  ConsentLabel,
  ConsentError,
} from '../containers/ConsentFormContent';
import submitForm from './submitForm';

import { updateData, transform } from './formHelper';
import manifest from '../manifest.json';

const { fullName, email, usaPhone, date, usaPostalCode } = definitions;

const getSubmissionIdFromUrl = (window, key = 'id') => {
  if (!window) return null;
  if (!window.location) return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
};

const submissionId = getSubmissionIdFromUrl(window);

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/covid-research/volunteer/update`,
  trackingPrefix: 'covid-research-volunteer-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('On Form Loaded. router: ', router);
  // },
  transformForSubmit: transform,

  // TODO - Add new form ID to VA_FORM_IDS
  formId: 'COVID_VACCINE_TRIAL_UPDATE',
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
  title: 'Update your information in our coronavirus research volunteer list',
  defaultDefinitions: {},
  preSubmitInfo: {
    required: true,
    field: 'consentAgreementAccepted',
    label: ConsentLabel(),
    notice: ConsentNotice(),
    error: ConsentError(),
  },
  submit: (form, config) => {
    submitForm(form, config, submissionId);
  },
  chapters: {
    chapter1: {
      title: 'Your information',
      pages: {
        page1: {
          path: 'update-form',
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
