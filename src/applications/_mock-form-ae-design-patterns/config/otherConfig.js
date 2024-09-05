// import emailUI from 'platform/forms-system/src/js/definitions/email';
// import fullSchema from 'vets-json-schema/dist/FEEDBACK-TOOL-schema.json';
// import phoneUI from 'platform/forms-system/src/js/definitions/phone';
// import initialData from '../tests/fixtures/data/test-data.json';
// import contactInformation1 from '../pages/contactInformation1';

import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from '../manifest.json';

import IntroductionPage from '../shared/components/pages/IntroductionPage1010ezr';
import ConfirmationPage from '../shared/components/pages/ConfirmationPage';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: '_mock-form-ae-design-patterns-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your mock form ae design patterns benefits application (00-1234) is in progress.',
    //   expired: 'Your saved mock form ae design patterns benefits application (00-1234) has expired. If you want to apply for mock form ae design patterns benefits, please start a new application.',
    //   saved: 'Your mock form ae design patterns benefits application has been saved.',
    // },
  },
  version: 0,
  prefillTransformer(pages, formData, metadata) {
    const fullName = {
      first: formData.data.attributes.veteran.firstName,
      middle: formData.data.attributes.veteran.middleName,
      last: formData.data.attributes.veteran.lastName,
    };

    const newFormData = { fullName };

    return {
      metadata,
      formData: newFormData,
      pages,
    };
  },
  prefillEnabled: true,
  savedFormMessages: {
    notFound:
      'Please start over to apply for mock form ae design patterns benefits.',
    noAuth:
      'Please sign in again to continue your application for mock form ae design patterns benefits.',
  },
  title: 'OTHER FORM!',
  defaultDefinitions: {},
  chapters: {
    contactInfo: {
      title: 'Contact info',
      pages: {
        contactInfoSettings: {
          title: 'Section Title: Required contact info',
          path: 'contact-info-required',
          uiSchema: {
            'ui:title': 'Required contact info',
            'ui:description':
              'Please provide your preferred contact information.',
            contactInfoSettings: {
              'ui:title': 'Preferred contact information',
              'ui:widget': 'radio',
              'ui:options': {
                hideLabelText: true,
              },
              'ui:required': () => true,
              'ui:validations': [
                {
                  options: { required: true },
                },
              ],
              'ui:errorMessages': {
                required: 'Please select a preferred contact method',
              },
            },
          },
          schema: {
            type: 'object',
            properties: {
              contactInfoSettings: {
                type: 'string',
                enum: ['phone', 'email', 'mail'],
              },
            },
          },
        },
      },
    },
  },
};

export default formConfig;
