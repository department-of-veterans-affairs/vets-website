import _ from 'lodash';
import environment from 'platform/utilities/environment';
import fullSchema from '../schema/schemaTemp.json';
// import fullSchema from 'vets-json-schema/dist/COVID-VACCINE-TRIAL-schema.json';
import uiSchemaDefinitions from '../schema/covid-vaccine-trial-ui-schema.json';

import definitions from 'vets-json-schema/dist/definitions.json';

import fullNameUI from 'platform/forms/definitions/fullName';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  validateMatch,
  validateBooleanGroup,
} from 'platform/forms-system/src/js/validation';

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
  residentsInHome,
  closeContact,
  contactHeaderText,
  confirmationEmailUI,
  zipCode,
  // height,
  weight,
  genderNoteText,
  genderTitleText,
  gender,
  raceEthnicityOrigin,
} = uiSchemaDefinitions;

const { fullName, email, usaPhone, date, usaPostalCode } = definitions;
const { set } = dataUtils;
const selectBoxGroupConfig = {
  'ui:validations': [validateBooleanGroup],
  'ui:options': {
    showFieldLabel: true,
    classNames: 'schemaform-block-title schemaform-block-subtitle',
    updateSchema: (form, pageSchema) => {
      const newForm = form;
      const NONE_OF_ABOVE = 'NONE_OF_ABOVE';

      const name = pageSchema.name;
      const selectedCount = Object.keys(form[name]).filter(
        val => form[name][val] === true,
      ).length;

      // edge case fails with two items selected one of them NONE

      if (selectedCount === 2) {
        newForm[name][NONE_OF_ABOVE] = false;
      } else if (selectedCount > 2 && form[name][NONE_OF_ABOVE] === true) {
        Object.keys(form[name]).map((key, val) => {
          newForm[name][key] = false;
          newForm[name][NONE_OF_ABOVE] = true;
          return newForm;
        });
      }
      return newForm;
    },
  },
  'ui:errorMessages': {
    atLeastOne: 'Please select at least one',
  },
};

function updateData(oldForm, newForm) {
  // console.log('Old Form Data: ', oldForm);
  // console.log('New Form Data: ', newForm);

  return newForm;
}
const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/covid-vaccine/screener/create`,
  trackingPrefix: 'covid-vaccine-trial-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'COVID-VACCINE-TRIAL',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to volunteer for vaccine trial participation.',
    noAuth:
      'Please sign in again to continue to volunteer for vaccine trial participation.',
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
          updateFormData: updateData,
          uiSchema: {
            descriptionText,
            infoSharingText,
            healthHeaderText,
            diagnosed,
            closeContactPositive,
            hospitalized,
            smokeOrVape,
            healthHistory: {
              ...healthHistory,
              ...selectBoxGroupConfig,
            },
            exposureRiskHeaderText,
            employmentStatus: {
              ...employmentStatus,
              ...selectBoxGroupConfig,
            },
            transportation: {
              ...transportation,
              ...selectBoxGroupConfig,
            },
            residentsInHome,
            closeContact,
            contactHeaderText,
            veteranFullName: _.merge(fullNameUI, {
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
            email: emailUI(),
            'view:confirmEmail': emailUI('Re-enter email address'),
            zipCode,
            phone: phoneUI(),
            veteranDateOfBirth: currentOrPastDateUI(
              'Date of birth (Note: You must be at least 18 years old to participate in research.)',
            ),
            // height,
            weight,
            genderTitleText,
            genderNoteText,
            gender: {
              ...gender,
              ...selectBoxGroupConfig,
            },
            raceEthnicityOrigin: {
              ...raceEthnicityOrigin,
              ...selectBoxGroupConfig,
            },
            'ui:validations': [validateMatch('email', 'view:confirmEmail')],
          },
          schema: {
            required: fullSchema.required,
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
              residentsInHome: fullSchema.properties.residentsInHome,
              closeContact: fullSchema.properties.closeContact,
              contactHeaderText: fullSchema.properties.contactHeaderText,
              // veteranFullName: set('required', ['first', 'last'], fullName),
              veteranFullName: fullName,
              email,
              // [viewConfirmationEmailField]: email,
              'view:confirmEmail': email,
              phone: usaPhone,
              zipCode: usaPostalCode,
              veteranDateOfBirth: date,
              // height: fullSchema.properties.height,
              weight: fullSchema.properties.weight,
              'view:genderTitleText': {
                type: 'object',
                properties: {},
              },
              genderTitleText: fullSchema.properties.genderTitleText,
              genderNoteText: fullSchema.properties.genderNoteText,
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
