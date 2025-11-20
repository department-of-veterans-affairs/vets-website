import React from 'react';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { focusElement } from 'platform/utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';

import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import SubmissionInstructions from '../components/SubmissionInstructions';
import PrivacyPolicy from '../components/PrivacyPolicy';

import {
  additionalOfficialArrayOptions,
  readOnlyCertifyingOfficialArrayOptions,
} from '../helpers';

import testData from '../tests/fixtures/data/maximal-test.json';
import submitForm from './submitForm';
import { transform } from './submit-transformer';
import { SUBMIT_URL } from '../constants';

// pages
import {
  designatingOfficial,
  primaryOfficialDetails,
  institutionDetails,
  institutionDetailsFacility,
  primaryOfficialTraining,
  primaryOfficialBenefitStatus,
  institutionDetailsNoFacilityDescription,
  institutionNameAndAddress,
  additionalOfficialSummary,
  additionalOfficialDetails,
  additionalOfficialTraining,
  additionalOfficialBenefitStatus,
  readOnlyCertifyingOfficialSummaryPage,
  readOnlyCertifyingOfficial,
  remarksPage,
} from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;
const scrollAndFocusTarget = () => {
  scrollToTop('topScrollElement');
  focusElement('h3');
};

export const confirmFormLogic = ({ router, route }) => (
  <ConfirmationPage router={router} route={route} />
);

export const submitFormLogic = (form, formConfig) => {
  if (environment.isDev() || environment.isLocalhost()) {
    return Promise.resolve(testData);
  }
  return submitForm(form, formConfig);
};

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  // submit: () =>
  //   Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  submitUrl: SUBMIT_URL,
  submit: submitFormLogic,
  transformForSubmit: transform,
  trackingPrefix: 'Edu-8794-',
  introduction: IntroductionPage,
  confirmation: confirmFormLogic,
  formId: '22-8794',
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-8794) is in progress.',
    //   expired: 'Your saved education benefits application (22-8794) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body: PrivacyPolicy,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
      fullNamePath: 'designatingOfficial.fullName',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: "Update your institution's list of certifying officials",
  subTitle: () => (
    <p className="vads-u-margin-bottom--0">
      Designation of certifying official(s) (VA Form 22-8794)
    </p>
  ),
  customText: {
    reviewPageTitle: 'Review',
    submitButtonText: 'Continue',
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    finishAppLaterMessage: 'Finish this form later',
    startNewAppButtonText: 'Start a new form',
  },
  useCustomScrollAndFocus: true,
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  chapters: {
    designatingOfficialChapter: {
      title: 'Designating official',
      pages: {
        designatingOfficial: {
          path: 'designating-official',
          title: 'Your information',
          uiSchema: designatingOfficial.uiSchema,
          schema: designatingOfficial.schema,
        },
      },
    },
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        institutionDetails: {
          path: 'institution-details',
          title: 'Institution details',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
          updateFormData: institutionDetails.updateFormData,
        },
        institutionDetailsFacility: {
          path: 'institution-details-3',
          title: 'Institution details',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
          depends: formData =>
            formData.institutionDetails.hasVaFacilityCode === true,
        },
        institutionDetailsNoFacilityDescription: {
          path: 'institution-details-1',
          title: 'Institution details',
          uiSchema: institutionDetailsNoFacilityDescription.uiSchema,
          schema: institutionDetailsNoFacilityDescription.schema,
          depends: formData =>
            formData.institutionDetails.hasVaFacilityCode === false,
        },
        institutionNameAndAddress: {
          path: 'institution-details-2',
          title: 'Institution details',
          uiSchema: institutionNameAndAddress.uiSchema,
          schema: institutionNameAndAddress.schema,
          depends: formData =>
            formData.institutionDetails.hasVaFacilityCode === false,
        },
      },
    },
    primaryOfficialChapter: {
      title: 'Primary certifying official',
      pages: {
        primaryOfficialDetails: {
          path: 'primary-certifying-official',
          title: 'Tell us about your primary certifying official',
          uiSchema: primaryOfficialDetails.uiSchema,
          schema: primaryOfficialDetails.schema,
        },
        primaryOfficialTraining: {
          path: 'primary-certifying-official-1',
          title: 'Section 305 training',
          uiSchema: primaryOfficialTraining.uiSchema,
          schema: primaryOfficialTraining.schema,
        },
        primaryOfficialBenefitStatus: {
          path: 'primary-certifying-official-2',
          title: 'Benefit status',
          uiSchema: primaryOfficialBenefitStatus.uiSchema,
          schema: primaryOfficialBenefitStatus.schema,
        },
      },
    },
    additionalOfficialChapter: {
      title: 'Additional certifying officials',
      pages: {
        ...arrayBuilderPages(additionalOfficialArrayOptions, pageBuilder => ({
          additionalOfficialSummary: pageBuilder.summaryPage({
            path: 'additional-certifying-officials',
            title: 'Add additional certifying officials',
            uiSchema: additionalOfficialSummary.uiSchema,
            schema: additionalOfficialSummary.schema,
            scrollAndFocusTarget,
          }),
          additionalOfficialDetails: pageBuilder.itemPage({
            path: 'additional-certifying-officials/:index',
            title: 'Tell us about your certifying official',
            showPagePerItem: true,
            uiSchema: additionalOfficialDetails.uiSchema,
            schema: additionalOfficialDetails.schema,
          }),
          additionalOfficialTraining: pageBuilder.itemPage({
            path: 'additional-certifying-officials-1/:index',
            title: 'Section 305 training',
            showPagePerItem: true,
            uiSchema: additionalOfficialTraining.uiSchema,
            schema: additionalOfficialTraining.schema,
          }),
          additionalOfficialBenefitStatus: pageBuilder.itemPage({
            path: 'additional-certifying-officials-2/:index',
            title: 'Benefit status',
            showPagePerItem: true,
            uiSchema: additionalOfficialBenefitStatus.uiSchema,
            schema: additionalOfficialBenefitStatus.schema,
          }),
        })),
      },
    },
    readOnlyCertifyingOfficialChapter: {
      title: 'Read-only certifying officials',
      pages: arrayBuilderPages(
        readOnlyCertifyingOfficialArrayOptions,
        pageBuilder => ({
          readOnlyPrimaryOfficialSummary: pageBuilder.summaryPage({
            title: 'Review read-only certifying officials',
            path: 'read-only-certifying-officials/summary',
            uiSchema: readOnlyCertifyingOfficialSummaryPage.uiSchema,
            schema: readOnlyCertifyingOfficialSummaryPage.schema,
            scrollAndFocusTarget,
          }),
          addReadOnlyPrimaryOfficial: pageBuilder.itemPage({
            title: 'Tell us about your read-only school certifying official',
            path: 'read-only-certifying-officials/:index',
            showPagePerItem: true,
            uiSchema: readOnlyCertifyingOfficial.uiSchema,
            schema: readOnlyCertifyingOfficial.schema,
          }),
        }),
      ),
    },
    remarksChapter: {
      title: 'Remarks',
      pages: {
        remarks: {
          path: 'remarks',
          uiSchema: remarksPage.uiSchema,
          schema: remarksPage.schema,
        },
      },
    },
    submissionInstructionsChapter: {
      title: 'Submission instructions',
      hideOnReviewPage: true,
      pages: {
        submissionInstructions: {
          path: 'submission-instructions',
          title: '',
          uiSchema: {
            'ui:description': SubmissionInstructions,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export default formConfig;
