// import fullSchema from 'vets-json-schema/dist/00-1234-schema.json';

import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
// import emailUI from 'platform/forms-system/src/js/definitions/email';
// import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
// import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
// import initialData from '../tests/fixtures/data/test-data.json';
// import contactInformation1 from '../pages/contactInformation1';
// import {
//   conditionallyShowPrefillMessage,
//   PREFILL_FLAGS,
//   validateMatch,
// } from '../helpers';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import applicantInformation from '../pages/applicantInformation';
import contactInfoSettings from '../pages/contactInfoSettings';
import prefillTransformer from '../prefill-transformer';

// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

// const {
//   address: applicantAddress,
//   applicantEmail,
//   phone,
// } = fullSchema.properties;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '_mock-form-ae-design-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: 'mock-form-ae-design-patterns',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer,
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  title: 'Mock Form AE Design Patterns',
  defaultDefinitions: {},
  chapters: {
    applicantInformationChapter: {
      title: 'Chapter Title: Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Section Title: Applicant Information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
          initialData: {},
        },
      },
    },
    contactInfo: {
      title: 'Contact info',
      pages: {
        contactInfoSettings: {
          title: 'Section Title: Required contact info',
          path: 'contact-info-required',
          uiSchema: contactInfoSettings.uiSchema,
          schema: contactInfoSettings.schema,
        },
        ...profileContactInfo({
          contactInfoPageKey: 'confirmContactInfo3',
          contactPath: 'contact-info-with-home-phone',
          contactInfoRequiredKeys: ['mailingAddress', 'email', 'homePhone'],
          included: ['homePhone', 'mailingAddress', 'email'],
          depends: formData => formData.contactInfoSettings === 'home',
        }),
      },
    },

    // tried to input the contact info section from the edu-benefits feedback tool to show an example of the Prefill Message
    // contactInformationChapter: {
    //   title: 'Chapter: Contact Information',
    //   pages: {
    //     path: 'contact-information',
    //     title: 'Contact Information',
    //     // depends: formData => formData.onBehalfOf !== anonymous,
    //     uiSchema: {
    //       'ui:description': data =>
    //         conditionallyShowPrefillMessage(
    //           PREFILL_FLAGS.CONTACT_INFORMATION,
    //           data,
    //           PrefillMessage,
    //         ),
    //       address: {
    //         street: {
    //           'ui:title': 'Address line 1',
    //         },
    //         street2: {
    //           'ui:title': 'Address line 2',
    //         },
    //         city: {
    //           'ui:title': 'City',
    //           'ui:errorMessages': {
    //             required: 'Please fill in a valid city',
    //           },
    //         },
    //         state: {
    //           'ui:title': 'State',
    //           'ui:errorMessages': {
    //             required: 'Please fill in a valid state',
    //           },
    //         },
    //         country: {
    //           'ui:title': 'Country',
    //           'ui:errorMessages': {
    //             required: 'Please fill in a valid country',
    //           },
    //         },
    //         postalCode: {
    //           'ui:title': 'Postal code',
    //           'ui:errorMessages': {
    //             pattern: 'Please fill in a valid 5-digit postal code',
    //             required: 'Please fill in a valid 5-digit postal code',
    //           },
    //           'ui:options': {
    //             widgetClassNames: 'va-input-medium-large',
    //           },
    //         },
    //       },
    //       'ui:validations': [
    //         validateMatch(
    //           'applicantEmail',
    //           'view:applicantEmailConfirmation',
    //           'email',
    //         ),
    //       ],
    //       applicantEmail: emailUI(),
    //       'view:applicantEmailConfirmation': emailUI('Re-enter email address'),
    //       phone: phoneUI('Phone number'),
    //     },
    //     schema: {
    //       type: 'object',
    //       required: [
    //         'address',
    //         'applicantEmail',
    //         'view:applicantEmailConfirmation',
    //       ],
    //       properties: {
    //         address: applicantAddress,
    //         applicantEmail,
    //         'view:applicantEmailConfirmation': applicantEmail,
    //         phone,
    //       },
    //     },
    //   },
    // },
    // contactInformationChapter: {
    //   title: 'Chapter Title: Contact Information',
    //   pages: {
    //     contactInformation1: {
    //       path: 'contact-information-with-email-and-phone',
    //       title: 'Section Title: Contact Information',
    //       uiSchema: contactInformation1.uiSchema,
    //       schema: contactInformation1.schema,
    //     },
    //   },
    // },
  },
};

export default formConfig;
