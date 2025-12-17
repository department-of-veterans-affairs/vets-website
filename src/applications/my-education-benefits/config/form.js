import React from 'react';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';

import manifest from '../manifest.json';

import applicantInformation33 from './chapters/33/applicantInfo/applicantInfo';
import contactInfo33 from './chapters/33/contactInfo/contactInfo';
import mailingAddress33 from './chapters/33/contactInfo/mailingAddress';
import contactMethod33 from './chapters/33/contactInfo/contactMethod';
import newContactMethod33 from './chapters/33/contactInfo/newContactMethod';
import serviceHistory33 from './chapters/33/serviceHistory/serviceHistory';
import additionalConsiderations33 from './chapters/33/additionalConsiderations/additionalConsiderations';
import directDeposit33 from './chapters/33/bankAccountInfo/directDeposit';

import benefitSelection from './chapters/benefitSelection';

import ApplicantInformationReviewPage from '../components/ApplicantInformationReviewPage';
import AdditionalConsiderationsReviewPage from '../components/AdditionalConsiderationsReviewPage';
import BenefitSelectionReviewPage from '../components/BenefitSelectionReviewPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ContactInformationReviewPanel from '../components/ContactInformationReviewPanel';

import GetFormHelp from '../components/GetFormHelp';
import IntroductionPage from '../containers/IntroductionPage';

import CustomPreSubmitInfo from '../components/PreSubmitInfo';

import { prefillTransformer, formPages } from '../helpers';

import { createSubmissionForm } from '../utils/form-submit-transform';

const { fullName, date, dateRange, usaPhone } = commonDefinitions;

function transform(metaData, form) {
  const submission = createSubmissionForm(form.data, form.formId);
  return JSON.stringify(submission);
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/meb_api/v0/submit_claim`,
  transformForSubmit: transform,
  trackingPrefix: 'my-education-benefits-',
  // Fix double headers (only show v3)
  v3SegmentedProgressBar: true,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_1990EZ,
  saveInProgress: {
    messages: {
      inProgress:
        'Your my education benefits application (22-1990) is in progress.',
      expired:
        'Your saved my education benefits application (22-1990) has expired. If you want to apply for my education benefits, please start a new application.',
      saved: 'Your my education benefits application has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  prefillTransformer,
  savedFormMessages: {
    notFound: 'Please start over to apply for my education benefits.',
    noAuth:
      'Please sign in again to continue your application for my education benefits.',
  },
  title: 'Apply for VA education benefits',
  subTitle: 'Equal to VA Form 22-1990 (Application for VA Education Benefits)',
  defaultDefinitions: {
    fullName,
    date,
    dateRange,
    usaPhone,
  },
  footerContent: FormFooter,
  getHelp: () => <GetFormHelp />, // Wrapping in a function to skirt failing platform unit test
  preSubmitInfo: {
    CustomComponent: CustomPreSubmitInfo,
    required: true,
    field: 'privacyAgreementAccepted',
  },
  chapters: {
    benefitSelectionChapter: {
      title: 'Benefit selection',
      pages: {
        [formPages.benefitSelection]: {
          path: 'benefit-selection',
          title: 'Benefit selection',
          subTitle: 'You’re applying for education benefits',
          uiSchema: benefitSelection.uiSchema,
          schema: benefitSelection.schema,
          CustomPageReview: BenefitSelectionReviewPage,
        },
      },
    },
    applicantInformationChapter: {
      title: 'Your information',
      pages: {
        [formPages.applicantInformation]: {
          title: 'Your information',
          path: 'applicant-information/personal-information',
          subTitle: 'Your information',
          CustomPageReview: ApplicantInformationReviewPage,
          instructions:
            'This is the personal information we have on file for you.',
          uiSchema: applicantInformation33.uiSchema,
          schema: applicantInformation33.schema,
        },
      },
    },
    contactInformationChapter: {
      title: 'Contact information',
      pages: {
        [formPages.contactInformation.contactInformation]: {
          title: 'Phone numbers and email address',
          path: 'contact-information/email-phone',
          CustomPageReview: ContactInformationReviewPanel,
          uiSchema: contactInfo33.uiSchema,
          schema: contactInfo33.schema,
        },
        [formPages.contactInformation.mailingAddress]: {
          title: 'Mailing address',
          path: 'contact-information/mailing-address',
          uiSchema: mailingAddress33.uiSchema,
          schema: mailingAddress33.schema,
        },
        [formPages.contactInformation.preferredContactMethod]: {
          depends: formData => !formData?.meb160630Automation,
          title: 'Contact preferences',
          path: 'contact-information/contact-preferences',
          uiSchema: contactMethod33.uiSchema,
          schema: contactMethod33.schema,
        },
        [formPages.contactInformation.newPreferredContactMethod]: {
          depends: formData => formData?.meb160630Automation,
          title: 'Contact preferences',
          path: 'contact-information/contact-preference-selection',
          uiSchema: newContactMethod33.uiSchema,
          schema: newContactMethod33.schema,
        },
      },
    },
    serviceHistoryChapter: {
      title: 'Service history',
      pages: {
        [formPages.serviceHistory]: {
          path: 'service-history',
          title: 'Service history',
          uiSchema: serviceHistory33.uiSchema,
          schema: serviceHistory33.schema,
        },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional considerations',
      CustomPageReview: AdditionalConsiderationsReviewPage,
      pages: {
        ...additionalConsiderations33,
      },
    },
    bankAccountInfoChapter: {
      title: 'Direct deposit',
      pages: {
        directDeposit: {
          path: 'direct-deposit',
          title: 'Direct deposit',
          uiSchema: directDeposit33.uiSchema,
          schema: directDeposit33.schema,
        },
      },
    },
  },
};

export default formConfig;
