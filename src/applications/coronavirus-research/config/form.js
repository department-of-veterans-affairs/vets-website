import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { uiSchema } from '../pages/covidResearchUISchema';

const { fullName, email, usaPhone, date, usaPostalCode } = definitions;

const checkBoxElements = [
  'healthHistory',
  'transportation',
  'employmentStatus',
  'gender',
  'raceEthnicityOrigin',
];
const NONE_OF_ABOVE = 'NONE_OF_ABOVE';

export const setNoneOfAbove = (form, elementName) => {
  const updatedForm = form;
  Object.keys(updatedForm[elementName]).map((key, _val) => {
    updatedForm[elementName][key] = false;
    updatedForm[elementName][NONE_OF_ABOVE] = true;
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

    // TODO: Refactor - this could probably be done in a better way
    // if no change just return
    if (oldSelectedCount === newSelectedCount) return;
    if (newSelectedCount === 0) updatedForm[elementName][NONE_OF_ABOVE] = true;
    // When there are 2 selected, need to know if the user just selected NONE_OF_ABOVE of a new selection
    else if (newSelectedCount === 2) {
      const oldNoResp = oldForm[elementName][NONE_OF_ABOVE];
      const newNoResp = newForm[elementName][NONE_OF_ABOVE];
      if (oldNoResp !== newNoResp) {
        setNoneOfAbove(updatedForm, elementName);
      } else {
        updatedForm[elementName][NONE_OF_ABOVE] = false;
      }
    } else if (
      // if NONE_OF_ABOVE is selected clear out all others
      newSelectedCount > 2 &&
      newForm[elementName][NONE_OF_ABOVE] === true
    ) {
      setNoneOfAbove(updatedForm, elementName);
    }
  });
  return updatedForm;
}

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/covid-research/volunteer/create`,
  trackingPrefix: 'covid-research-volunteer-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'COVID-RESEARCH-VOLUNTEER',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to sign up for our coronavirus research volunteer list.',
    noAuth:
      'Please sign in again to continue to sign up for our coronavirus research volunteer list.',
  },
  title: 'Sign up for our coronavirus research volunteer list',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Volunteer Information',
      pages: {
        page1: {
          path: 'sign-up',
          title: 'Volunteer Information - Page 1',
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
              closeContactPositive: fullSchema.properties.closeContactPositive,
              hospitalized: fullSchema.properties.hospitalized,
              smokeOrVape: fullSchema.properties.smokeOrVape,
              healthHistory: fullSchema.properties.healthHistory,
              exposureRiskHeaderText: {
                type: 'object',
                properties: {
                  'view:exposureRiskText': {
                    type: 'object',
                    properties: {},
                  },
                },
              },
              employmentStatus: fullSchema.properties.employmentStatus,
              transportation: fullSchema.properties.transportation,
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
              'view:confirmEmail': email,
              phone: usaPhone,
              zipCode: usaPostalCode,
              veteranDateOfBirth: date,
              height: fullSchema.properties.height,
              weight: fullSchema.properties.weight,
              gender: fullSchema.properties.gender,
              raceEthnicityOrigin: fullSchema.properties.raceEthnicityOrigin,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
