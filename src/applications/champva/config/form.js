// import fullSchema from 'vets-json-schema/dist/10-10D-schema.json';
import get from 'platform/utilities/data/get';

import {
  fullNameSchema,
  fullNameUI,
  ssnSchema,
  ssnUI,
  vaFileNumberSchema,
  vaFileNumberUI,
  addressSchema,
  addressUI,
  phoneSchema,
  phoneUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  dateOfDeathSchema,
  dateOfDeathUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

/** @type {PageSchema} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'champva-10-10d-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '10-10D',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your CHAMPVA benefits application (10-10D) is in progress.',
    //   expired: 'Your saved CHAMPVA benefits application (10-10D) has expired. If you want to apply for CHAMPVA benefits, please start a new application.',
    //   saved: 'Your CHAMPVA benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for CHAMPVA benefits.',
    noAuth:
      'Please sign in again to continue your application for CHAMPVA benefits.',
  },
  title: 'Application for CHAMPVA Benefits',
  defaultDefinitions: {},
  chapters: {
    chapter1: {
      title: 'Sponsor Information',
      pages: {
        page1: {
          path: 'name',
          title: 'Name',
          uiSchema: {
            veteransFullName: fullNameUI(),
          },
          schema: {
            type: 'object',
            properties: {
              veteransFullName: fullNameSchema,
            },
          },
        },
        page2: {
          path: 'sponsor-ssn',
          title: 'Social Security Number',
          uiSchema: {
            ssn: ssnUI(),
          },
          schema: {
            type: 'object',
            required: ['ssn'],
            properties: {
              ssn: ssnSchema,
            },
          },
        },
        page3: {
          path: 'va-file-number',
          title: 'VA File Number',
          uiSchema: {
            vaFileNumber: vaFileNumberUI(),
          },
          schema: {
            type: 'object',
            required: ['vaFileNumber'],
            properties: {
              vaFileNumber: vaFileNumberSchema,
            },
          },
        },
        page4: {
          path: 'sponsor-address',
          title: 'Address',
          uiSchema: {
            sponsorAddress: addressUI({
              labels: {
                militaryCheckbox:
                  'Sponsor lives on a U.S. military base outside the U.S.',
              },
            }),
          },
          schema: {
            type: 'object',
            properties: {
              sponsorAddress: addressSchema(),
            },
          },
        },
        page5: {
          path: 'sponsor-phone-number',
          title: 'Sponsor Phone Number',
          uiSchema: {
            sponsorPhone: phoneUI(),
          },
          schema: {
            type: 'object',
            required: ['sponsorPhone'],
            properties: {
              sponsorPhone: phoneSchema,
            },
          },
        },
        page6: {
          // TODO:
          // - verify that date of death is not before date of birth
          path: 'sponsor-dob',
          title: 'Sponsor Dates',
          schema: {
            type: 'object',
            required: ['sponsorDOB', 'sponsorIsDeceased'],
            properties: {
              sponsorDOB: dateOfBirthSchema,
              sponsorIsDeceased: yesNoSchema,
              sponsorDOD: dateOfDeathSchema,
              sponsorDeathConditions: yesNoSchema,
            },
          },
          uiSchema: {
            sponsorDOB: dateOfBirthUI(),
            sponsorIsDeceased: yesNoUI({
              title: 'Is the Veteran deceased?',
              description: 'Select one',
            }),
            sponsorDOD: {
              ...dateOfDeathUI(),
              'ui:options': {
                hideIf: formData => !get('sponsorIsDeceased', formData),
              },
              'ui:required': formData => formData.sponsorIsDeceased,
            },
            sponsorDeathConditions: {
              ...yesNoUI({
                title: 'Did the Veteran die while on active military service?',
                description: 'Select one',
              }),
              'ui:options': {
                hideIf: formData => !get('sponsorIsDeceased', formData),
              },
              'ui:required': formData => formData.sponsorIsDeceased,
            },
          },
        },
      },
    },
  },
};

export default formConfig;
