import _ from 'lodash/fp';
import set from 'platform/utilities/data/set';

// Example of an imported schema:
import fullSchema from '../0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import * as address from 'platform/forms-system/src/js/definitions/address';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

const { topic, inquiryType, query } = fullSchema.properties;

const {
  fullName,
  phone,
  email,
  preferredContactMethod,
} = fullSchema.definitions;

// Define all the fields in the form to aid reuse
const formFields = {
  topic: 'topic',
  inquiryType: 'inquiryType',
  query: 'query',
  preferredResponseType: 'preferredResponseType',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  phoneNumber: 'phoneNumber',
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  topic: 'topic',
  whoAmI: 'whoAmI',
  contactInformation: 'contactInformation',
  serviceInformation: 'serviceInformation',
};

const formConfig = {
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0873',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Ask a Question',
  defaultDefinitions: {
    fullName,
    phone,
  },
  chapters: {
    topicChapter: {
      title: 'Topic',
      pages: {
        [formPages.topic]: {
          path: 'topic',
          title: 'What is your Question for the VA?',
          uiSchema: {
            [formFields.topic]: {
              'ui:title': 'Topic',
            },
            [formFields.inquiryType]: {
              'ui:title': 'Inquiry Type',
            },
            [formFields.query]: {
              'ui:title': 'Question',
            },
          },
          schema: {
            type: 'object',
            required: [
              formFields.topic,
              formFields.inquiryType,
              formFields.query,
            ],
            properties: {
              [formFields.topic]: topic,
              [formFields.inquiryType]: inquiryType,
              [formFields.query]: query,
            },
          },
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact Information',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            [formFields.preferredResponseType]: {
              'ui:title': 'Preferred Response Type',
            },
            [formFields.fullName]: fullNameUI,
            [formFields.email]: set(
              'ui:required',
              (formData, index) => formData.preferredResponseType === 'email',
              emailUI(),
            ),
            [formFields.phoneNumber]: set(
              'ui:required',
              (formData, index) => formData.preferredResponseType === 'phone',
              phoneUI(),
            ),
            [formFields.address]: address.uiSchema(
              'Mailing address',
              false,
              (formData, index) => {
                return formData.preferredResponseType === 'mail';
              },
              false,
            ),
          },
          schema: {
            type: 'object',
            required: [formFields.preferredResponseType, formFields.fullName],
            properties: {
              [formFields.preferredResponseType]: preferredContactMethod,
              [formFields.fullName]: fullName,
              [formFields.email]: email,
              [formFields.phoneNumber]: phone,
              [formFields.address]: address.schema(fullSchema, true),
            },
          },
        },
      },
    },
  },
};

export default formConfig;
