// Example of an imported schema:
import fullSchema from '../0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import { contactInformationPage, inquiryPage } from './pages';

const { fullName, phone } = fullSchema.definitions;

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
  confirmation: ConfirmationPage,
  formId: '0873',
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  title: 'Contact us',
  subTitle: 'Form 0873',
  customText: {
    reviewPageTitle: 'Review your information',
  },
  defaultDefinitions: {
    fullName,
    phone,
  },
  chapters: {
    topicChapter: {
      title: "Share why you're contacting us",
      pages: {
        [formPages.topic]: {
          path: 'topic',
          title: 'Your message',
          uiSchema: inquiryPage.uiSchema,
          schema: inquiryPage.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Tell us about you',
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: 'Contact Information',
          uiSchema: contactInformationPage.uiSchema,
          schema: contactInformationPage.schema,
        },
      },
    },
  },
};

export default formConfig;
