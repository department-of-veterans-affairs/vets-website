// Example of an imported schema:
import fullSchema from './0873-schema.json';
// In a real app this would be imported from `vets-json-schema`:
// import fullSchema from 'vets-json-schema/dist/0873-schema.json';

import React from 'react';
import IntroductionPage from './introduction/IntroductionPage';
import ExperiencerInformationPage from './experiencerInformation/experiencerInformationPage';
import ConfirmationPage from './confirmation/ConfirmationPage';
import ContactInformationPage from './contactInformation/contactInformationPage';
import InquiryPage from './inquiry/inquiryPage';
import AllegationPage from './allegation/allegationPage';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from 'platform/utilities/environment';
import {
  contactInformationChapterTitle,
  contactInformationPageTitle,
  experiencerInformationChapterTitle,
  allegationChapterTitle,
  allegationPageTitle,
  formTitle,
  inquiryChapterTitle,
  inquiryPageTitle,
  reviewPageTitle,
  savedFormNoAuth,
  savedFormNotFound,
  submitButtonText,
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
  reporterInformation: 'start',
  contactInformation: 'contactInformation',
  experiencerInformation: 'experiencerInformation',
  allegation: 'allegation',
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
    startChapter: {
      title: inquiryChapterTitle,
      pages: {
        [formPages.start]: {
          path: 'start',
          title: inquiryPageTitle,
          uiSchema: InquiryPage.uiSchema,
          schema: InquiryPage.schema,
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
          depends: form => form.anonymousReport !== true,
        },
      },
    },
    experiencerInformationChapter: {
      title: experiencerInformationChapterTitle,
      pages: {
        [formPages.experiencerInformation]: {
          path: 'experiencer',
          title: contactInformationPageTitle,
          uiSchema: ExperiencerInformationPage.uiSchema,
          schema: ExperiencerInformationPage.schema,
          depends: form => form.incidentType !== 'experiencer',
        },
      },
    },
    allegationChapter: {
      title: allegationChapterTitle,
      pages: {
        [formPages.allegation]: {
          path: 'report',
          title: allegationPageTitle,
          uiSchema: AllegationPage.uiSchema,
          schema: AllegationPage.schema,
        },
      },
    },
  },
};

export default formConfig;
