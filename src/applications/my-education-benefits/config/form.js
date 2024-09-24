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
import serviceHistory33 from './chapters/33/serviceHistory/serviceHistory';
import benefitSelection33 from './chapters/33/benefitSelection/benefitSelectionLegacy';
import additionalConsiderations33 from './chapters/33/additionalConsiderations/additionalConsiderations';
import directDeposit33 from './chapters/33/bankAccountInfo/directDeposit';
import preFilledDirectDeposit33 from './chapters/33/bankAccountInfo/preFilledDirectDeposit';

import benefitSelection from './chapters/benefitSelection';

import ApplicantInformationReviewPage from '../components/ApplicantInformationReviewPage';
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
    required: false,
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
          depends: formData => formData?.meb160630Automation,
          uiSchema: benefitSelection.uiSchema,
          schema: benefitSelection.schema,
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
          title: 'Contact preferences',
          path: 'contact-information/contact-preferences',
          uiSchema: contactMethod33.uiSchema,
          schema: contactMethod33.schema,
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
    benefitSelectionLegacyChapter: {
      title: 'Legacy Benefit selection',
      pages: {
        [formPages.benefitSelectionLegacy]: {
          path: 'benefit-selection-legacy',
          title: 'Legacy Benefit selection',
          subTitle: 'You’re applying for the Post-9/11 GI Bill®',
          depends: formData => {
            // If the dgiRudisillHideBenefitsSelectionStep feature flag is turned on, hide the page
            if (formData.dgiRudisillHideBenefitsSelectionStep) {
              return false;
            }

            // If the meb160630Automation feature flag is turned on, hide the page
            if (formData?.meb160630Automation) {
              return false;
            }

            // If the showMebEnhancements09 feature flag is turned on, show the page
            if (formData.showMebEnhancements09) {
              return true;
            }

            // If the feature flag is not turned on, check the eligibility length
            return Boolean(formData.eligibility?.length);
          },
          uiSchema: benefitSelection33.uiSchema,
          schema: benefitSelection33.schema,
        },
      },
    },
    additionalConsiderationsChapter: {
      title: 'Additional considerations',
      pages: {
        ...additionalConsiderations33,
      },
    },
    bankAccountInfoChapter: {
      title: 'Direct deposit',
      pages: {
        standardDirectDeposit: {
          path: 'direct-deposit',
          title: 'Direct deposit',
          depends: formData => !formData.showDgiDirectDeposit1990EZ,
          uiSchema: directDeposit33.uiSchema,
          schema: directDeposit33.schema,
        },
        preFilledDirectDeposit: {
          path: 'direct-deposit/review',
          title: 'Direct deposit',
          depends: formData => formData.showDgiDirectDeposit1990EZ,
          uiSchema: preFilledDirectDeposit33.uiSchema,
          schema: preFilledDirectDeposit33.schema,
        },
      },
    },
  },
};

export default formConfig;
