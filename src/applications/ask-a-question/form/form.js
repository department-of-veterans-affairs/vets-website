// Example of an imported schema:
import fullSchema from './0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

import React from 'react';
import IntroductionPage from './introduction/IntroductionPage';
import ConfirmationPage from './confirmation/ConfirmationPage';
import VeteranInformationPage from './veteran/veteranInformationPage';
import ContactInformationPage from './contactInformation/contactInformationPage';
import InquiryPage from './inquiry/inquiryPage';
import * as topic from './inquiry/topic/topic';
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
} from '../constants/labels';

import manifest from '../manifest.json';
import CallMyVA311 from './review/error/CallMyVA311';
import FormFooter from 'platform/forms/components/FormFooter';
import NeedHelpFooter from '../components/NeedHelpFooter';

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
  submitUrl: `${environment.API_URL}/v0/contact_us/inquiries`,
  transformForSubmit: submitTransform,
  footerContent: FormFooter,
  getHelp: NeedHelpFooter,
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
  errorText: () => (
    <p>
      If it still doesn’t work, please <CallMyVA311 />
    </p>
  ),
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
    appType: 'message',
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
          uiSchema: InquiryPage.uiSchema,
          schema: InquiryPage.schema,
          updateFormData: topic.updateFormData,
        },
      },
    },
    veteranInformationChapter: {
      title: veteranInformationChapterTitle,
      pages: {
        [formPages.veteranInformation]: {
          path: 'veteran-information',
          title: veteranInformationPageTitle,
          depends: form => form.veteranStatus.veteranStatus !== 'general',
          uiSchema: VeteranInformationPage.uiSchema,
          schema: VeteranInformationPage.schema,
        },
      },
    },
    contactInformationChapter: {
      title: contactInformationChapterTitle,
      pages: {
        [formPages.contactInformation]: {
          path: 'contact-information',
          title: contactInformationPageTitle,
          uiSchema: ContactInformationPage.uiSchema,
          schema: ContactInformationPage.schema,
        },
      },
    },
  },
};

export default formConfig;
