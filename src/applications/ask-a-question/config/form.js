// Example of an imported schema:
import fullSchema from '../0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

import ConfirmationPage from '../containers/ConfirmationPage';
import {
  contactInformationPage,
  inquiryPage,
  veteranInformationPage,
} from './pages';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from 'platform/utilities/environment';

const {
  fullName,
  phone,
  date,
  ssn,
  veteranServiceNumber,
  dateRange,
} = fullSchema.definitions;

// Define all the form pages to help ensure uniqueness across all form chapters
const formPages = {
  topic: 'topic',
  veteranInformation: 'veteranInformation',
  contactInformation: 'contactInformation',
};

const submitTransform = (formConfig, form) => {
  const formData = transformForSubmit(formConfig, form);

  return JSON.stringify({
    inquiry: {
      form: formData,
    },
  });
};

const formConfig = {
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/ask/asks`,
  transformForSubmit: submitTransform,
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
    date,
    ssn,
    veteranServiceNumber,
    dateRange,
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
    veteranInformationChapter: {
      title: 'Tell us about the Veteran',
      pages: {
        [formPages.veteranInformation]: {
          path: 'veteran-information',
          title: 'Veteran Information',
          uiSchema: veteranInformationPage.uiSchema,
          schema: veteranInformationPage.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Tell us about yourself',
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
