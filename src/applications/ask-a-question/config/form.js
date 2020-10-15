// Example of an imported schema:
import fullSchema from '../0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  contactInformationPage,
  inquiryPage,
  veteranInformationPage,
} from './pages';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from 'platform/utilities/environment';
import {
  contactInformationChapterTitle,
  contactInformationPageTitle,
  formSubTitle,
  formTitle,
  inquiryChapterTitle,
  inquiryPageTitle,
  reviewPageTitle,
  savedFormNoAuth,
  savedFormNotFound,
  submitButtonText,
  veteranInformationChapterTitle,
  veteranInformationPageTitle,
} from '../content/labels';

import manifest from '../manifest.json';

const {
  fullName,
  first,
  last,
  suffix,
  address,
  email,
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
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/ask/asks`,
  transformForSubmit: submitTransform,
  trackingPrefix: 'complex-form-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: '0873',
  saveInProgress: {
    messages: {
      // inProgress: 'Your [savedFormDescription] is in progress.',
      // expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
      // saved: 'Your [benefitType] [appType] has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: savedFormNotFound,
    noAuth: savedFormNoAuth,
  },
  title: formTitle,
  subTitle: formSubTitle,
  customText: {
    submitButtonText,
    reviewPageTitle,
  },
  defaultDefinitions: {
    address,
    fullName,
    first,
    last,
    suffix,
    email,
    phone,
    date,
    ssn,
    veteranServiceNumber,
    dateRange,
  },
  chapters: {
    topicChapter: {
      title: inquiryChapterTitle,
      pages: {
        [formPages.topic]: {
          path: 'topic',
          title: inquiryPageTitle,
          uiSchema: inquiryPage.uiSchema,
          schema: inquiryPage.schema,
        },
      },
    },
    veteranInformationChapter: {
      title: veteranInformationChapterTitle,
      pages: {
        [formPages.veteranInformation]: {
          path: 'veteran-information',
          title: veteranInformationPageTitle,
          uiSchema: veteranInformationPage.uiSchema,
          schema: veteranInformationPage.schema,
        },
      },
    },
    contactInformationChapter: {
      title: contactInformationChapterTitle,
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: contactInformationPageTitle,
          uiSchema: contactInformationPage.uiSchema,
          schema: contactInformationPage.schema,
        },
      },
    },
  },
};

export default formConfig;
