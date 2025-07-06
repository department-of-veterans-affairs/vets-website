import React from 'react';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PrivacyPolicy from '../containers/PrivacyPolicy';

import {
  allProprietaryProfitConflictsArrayOptions,
  proprietaryProfitConflictsArrayOptions,
} from '../helpers';

// pages
import {
  certifyingOfficials,
  aboutYourInstitution,
  institutionDetails,
  isProprietaryProfit,
  conflictOfInterestCertifyingOfficial,
  conflictOfInterestSummary,
  conflictOfInterestFileNumber,
  conflictOfInterestEnrollmentPeriod,
  affiliatedIndividualsSummary,
  affiliatedIndividualsAssociation,
} from '../pages';
import SubmissionInstructions from '../components/SubmissionInstructions';

export const confirmFormLogic = ({ router, route }) => (
  <ConfirmationPage router={router} route={route} />
);

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'Edu-1919-',
  introduction: IntroductionPage,
  confirmation: confirmFormLogic,
  formId: '22-1919',
  useCustomScrollAndFocus: true,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your education benefits application (22-1919) is in progress.',
    //   expired: 'Your saved education benefits application (22-1919) has expired. If you want to apply for education benefits, please start a new application.',
    //   saved: 'Your education benefits application has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for education benefits.',
    noAuth:
      'Please sign in again to continue your application for education benefits.',
  },
  title: 'Conflicting interests certification for proprietary schools',
  subTitle: 'VA Form 22-1919',
  customText: {
    submitButtonText: 'Continue',
    appType: 'form',
  },
  defaultDefinitions: {
    fullName,
    ssn,
    date,
    dateRange,
    usaPhone,
  },
  preSubmitInfo: {
    statementOfTruth: {
      body: PrivacyPolicy,
      heading: 'Certification statement',
      fullNamePath: 'certifyingOfficial',
      messageAriaDescribedBy: 'I have read and accept the privacy policy.',
    },
  },
  chapters: {
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        certifyingOfficial: {
          path: 'applicant-information',
          title: 'Your name and role',
          uiSchema: certifyingOfficials.uiSchema,
          schema: certifyingOfficials.schema,
        },
        aboutYourInstitution: {
          path: 'about-your-institution',
          title: 'About your institution',
          uiSchema: aboutYourInstitution.uiSchema,
          schema: aboutYourInstitution.schema,
        },
        institutionDetails: {
          path: 'institution-information',
          title: 'Institution information',
          uiSchema: institutionDetails.uiSchema,
          schema: institutionDetails.schema,
          depends: formData => {
            return formData?.aboutYourInstitution === true;
          },
        },
      },
    },
    proprietaryProfitChapter: {
      title: 'Proprietary profit schools only',
      pages: {
        isProprietaryProfit: {
          path: 'proprietary-profit',
          title: "Confirm your institution's classification",
          uiSchema: isProprietaryProfit.uiSchema,
          schema: isProprietaryProfit.schema,
        },
        ...arrayBuilderPages(
          proprietaryProfitConflictsArrayOptions,
          pageBuilder => ({
            affiliatedIndividualsSummary: pageBuilder.summaryPage({
              title: 'Individuals with a potential conflict of interest',
              path: 'proprietary-profit-1',
              uiSchema: affiliatedIndividualsSummary.uiSchema,
              schema: affiliatedIndividualsSummary.schema,
            }),
            affiliatedIndividualsAssociation: pageBuilder.itemPage({
              title:
                'Individuals affiliated with both your institution and VA or SAA',
              path: 'proprietary-profit-1/:index/details',
              uiSchema: affiliatedIndividualsAssociation.uiSchema,
              schema: affiliatedIndividualsAssociation.schema,
            }),
          }),
        ),
      },
    },
    allProprietaryProfitChapter: {
      title: 'All proprietary schools',
      pages: {
        ...arrayBuilderPages(
          allProprietaryProfitConflictsArrayOptions,
          pageBuilder => ({
            conflictOfInterestSummary: pageBuilder.summaryPage({
              path: 'conflict-of-interest-summary',
              title:
                'Review the individuals with a potential conflict of interest that receive VA educational benefits',
              uiSchema: conflictOfInterestSummary.uiSchema,
              schema: conflictOfInterestSummary.schema,
            }),
            conflictOfInterestCertifyingOfficial: pageBuilder.itemPage({
              path: 'conflict-of-interest/:index/certifying-official',
              title:
                'Individuals with a potential conflict of interest who receive VA educational benefits',
              showPagePerItem: true,
              uiSchema: conflictOfInterestCertifyingOfficial.uiSchema,
              schema: conflictOfInterestCertifyingOfficial.schema,
            }),
            conflictOfInterestFileNumber: pageBuilder.itemPage({
              path: 'conflict-of-interest/:index/file-number',
              title:
                'Information on an individual with a potential conflict of interest who receives VA educational benefits',
              showPagePerItem: true,
              uiSchema: conflictOfInterestFileNumber.uiSchema,
              schema: conflictOfInterestFileNumber.schema,
            }),
            conflictOfInterestEnrollmentPeriod: pageBuilder.itemPage({
              path: 'conflict-of-interest/:index/enrollment-period',
              title:
                'Information on an individual with a potential conflict of interest who receives VA educational benefits',
              showPagePerItem: true,
              uiSchema: conflictOfInterestEnrollmentPeriod.uiSchema,
              schema: conflictOfInterestEnrollmentPeriod.schema,
            }),
          }),
        ),
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
