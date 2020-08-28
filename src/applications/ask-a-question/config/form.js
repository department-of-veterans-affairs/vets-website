import set from 'platform/utilities/data/set';

// Example of an imported schema:
import fullSchema from '../0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { uiSchema as autoSuggestUiSchema } from 'platform/forms-system/src/js/definitions/autosuggest';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { confirmationEmailUI } from '../../caregivers/definitions/caregiverUI';

const {
  topic,
  inquiryType,
  query,
  relationshipToVeteran,
  branchOfService,
} = fullSchema.properties;

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
  preferredContactMethod: 'preferredContactMethod',
  fullName: 'fullName',
  address: 'address',
  email: 'email',
  verifyEmail: 'view:email',
  phoneNumber: 'phoneNumber',
  relationshipToVeteran: 'relationshipToVeteran',
  branchOfService: 'branchOfService',
};

const getOptions = allOptions => {
  return (_input = '') => {
    return Promise.resolve(
      allOptions.map(option => ({ id: option, label: option })),
    );
  };
};

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  topic: 'topic',
  contactInformation: 'contactInformation',
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
    contactInformationChapter: {
      title: 'Contact Information',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: {
            [formFields.fullName]: {
              title: {
                'ui:title': 'Title',
                'ui:options': {
                  widgetClassNames: 'form-select-medium',
                },
              },
              ...fullNameUI,
            },
            [formFields.relationshipToVeteran]: {
              'ui:title': 'I am asking about benefits/services',
            },
            [formFields.branchOfService]: {
              'ui:title': 'Branch of service',
              'ui:required': formData =>
                formData.relationshipToVeteran !==
                relationshipToVeteran.enum.slice(-1)[0],
              'ui:options': {
                expandUnder: 'relationshipToVeteran',
                hideIf: formData =>
                  formData.relationshipToVeteran ===
                  relationshipToVeteran.enum.slice(-1)[0],
              },
            },
            [formFields.preferredContactMethod]: {
              'ui:title': 'How would you like to be contacted?',
              'ui:widget': 'radio',
            },
            [formFields.email]: set(
              'ui:required',
              (formData, _index) => formData.preferredContactMethod === 'email',
              emailUI(),
            ),
            [formFields.verifyEmail]: confirmationEmailUI('', formFields.email),
          },
          schema: {
            type: 'object',
            required: [
              formFields.preferredContactMethod,
              formFields.fullName,
              formFields.relationshipToVeteran,
            ],
            properties: {
              [formFields.fullName]: fullName,
              [formFields.relationshipToVeteran]: relationshipToVeteran,
              [formFields.branchOfService]: branchOfService,
              [formFields.preferredContactMethod]: preferredContactMethod,
              [formFields.email]: email,
              [formFields.verifyEmail]: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    topicChapter: {
      title: 'Topic',
      pages: {
        [formPages.topic]: {
          path: 'topic',
          title: 'What is your Question for the VA?',
          uiSchema: {
            [formFields.topic]: autoSuggestUiSchema(
              'Topic',
              getOptions(topic.enum),
              {
                'ui:options': { queryForResults: true, freeInput: true },
                'ui:errorMessages': {
                  maxLength:
                    'Please enter a name with fewer than 100 characters.',
                  pattern: 'Please enter a valid name.',
                },
              },
            ),
            [formFields.inquiryType]: autoSuggestUiSchema(
              'Inquiry Type',
              getOptions(inquiryType.enum),
              {
                'ui:options': { queryForResults: true, freeInput: true },
                'ui:errorMessages': {
                  maxLength:
                    'Please enter a name with fewer than 100 characters.',
                  pattern: 'Please enter a valid name.',
                },
              },
            ),
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
  },
};

export default formConfig;
