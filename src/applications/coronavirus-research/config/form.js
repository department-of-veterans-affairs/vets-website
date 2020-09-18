import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { uiSchema } from '../pages/covidResearchUISchema';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { VA_FORM_IDS } from 'platform/forms/constants';
import {
  ConsentNotice,
  ConsentLabel,
  ConsentError,
} from '../containers/ConsentFormContent';

const { fullName, email, usaPhone, date, usaPostalCode } = definitions;

const checkBoxElements = [
  'HEALTH_HISTORY',
  'TRANSPORTATION',
  'EMPLOYMENT_STATUS',
  'VETERAN',
  'GENDER',
  'RACE_ETHNICITY',
];
const NONE_OF_ABOVE = 'NONE_OF_ABOVE';

export const setNoneOfAbove = (form, elementName, elementNOA) => {
  const updatedForm = form;
  Object.keys(updatedForm[elementName]).map((key, _val) => {
    updatedForm[elementName][key] = false;
    updatedForm[elementName][elementNOA] = true;
    return updatedForm;
  });
};
function updateData(oldForm, newForm) {
  const updatedForm = newForm;
  checkBoxElements.forEach(elementName => {
    // For each checkBoxGroup in the form, get the number of selected elements before and after the current event
    const oldSelectedCount = Object.keys(oldForm[elementName]).filter(
      val => oldForm[elementName][val] === true,
    ).length;
    const newSelectedCount = Object.keys(newForm[elementName]).filter(
      val => newForm[elementName][val] === true,
    ).length;

    const elementNOA = `${elementName}::${NONE_OF_ABOVE}`;
    // if no change just return
    if (oldSelectedCount === newSelectedCount) return;
    if (newSelectedCount === 0) updatedForm[elementName][elementNOA] = true;
    // When there are 2 selected, need to know if the user just selected NONE_OF_ABOVE of a new selection
    else if (newSelectedCount === 2) {
      const oldNoResp = oldForm[elementName][elementNOA];
      const newNoResp = newForm[elementName][elementNOA];
      if (oldNoResp !== newNoResp) {
        setNoneOfAbove(updatedForm, elementName, elementNOA);
      } else {
        updatedForm[elementName][elementNOA] = false;
      }
    } else if (
      // if NONE_OF_ABOVE is selected clear out all others
      newSelectedCount > 2 &&
      newForm[elementName][elementNOA] === true
    ) {
      setNoneOfAbove(updatedForm, elementName, elementNOA);
    }
  });
  return updatedForm;
}

export function transform(formConfig, form) {
  const transformedForm = form;
  checkBoxElements.forEach(elementName => {
    Object.keys(form.data[elementName])
      .filter(key => form.data[elementName][key] === undefined)
      .forEach(filteredKey => {
        transformedForm.data[elementName][filteredKey] = false;
      });
  });
  return transformForSubmit(formConfig, transformedForm);
}

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/covid-research/volunteer/create`,
  trackingPrefix: 'covid-research-volunteer-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  transformForSubmit: transform,
  formId: VA_FORM_IDS.FORM_COVID_VACCINE_TRIAL,
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
            // required: [],
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
