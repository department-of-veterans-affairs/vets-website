import environment from 'platform/utilities/environment';
// import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';
import fullSchema from './temp-COVID-VACCINE-TRIAL-UPDATE-schema.json';

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

const { date, usaPostalCode } = definitions;

const getSubmissionIdFromUrl = (window, key = 'id') => {
  if (!window) return null;
  if (!window.location) return null;
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get(key);
  if (paramId === null) {
    window.location.replace(`${environment.BASE_URL}/coronavirus-research/`);
  }
  return paramId;
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
  formId: VA_FORM_IDS.FORM_COVID_VACCINE_TRIAL_UPDATE,
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
  title: 'Coronavirus research volunteer list survey update',
  defaultDefinitions: {},
  preSubmitInfo: {
    required: true,
    field: 'consentAgreementAccepted',
    label: ConsentLabel(),
    notice: ConsentNotice(),
    error: ConsentError(),
  },
  submit: (form, config) => {
    return submitForm(form, config, submissionId);
  },
  chapters: {
    chapter1: {
      title: 'Update your information',
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
              vaccinated: fullSchema.properties.vaccinated,
              VACCINATED_PLAN: fullSchema.properties.VACCINATED_PLAN,
              VACCINATED_DETAILS: fullSchema.properties.VACCINATED_DETAILS,
              VACCINATED_DATE1: date,
              VACCINATED_DATE2: date,
              VACCINATED_SECOND: fullSchema.properties.VACCINATED_SECOND,
              diagnosed: fullSchema.properties.diagnosed,
              DIAGNOSED_DETAILS: fullSchema.properties.DIAGNOSED_DETAILS,
              DIAGNOSED_SYMPTOMS: fullSchema.properties.DIAGNOSED_SYMPTOMS,
              ELIGIBLE: fullSchema.properties.ELIGIBLE,
              FACILITY: fullSchema.properties.FACILITY,
              zipCode: usaPostalCode,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
