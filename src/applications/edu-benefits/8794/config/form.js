import React from 'react';
// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

// import fullSchema from 'vets-json-schema/dist/22-8794-schema.json';

import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { additionalOfficialArrayOptions } from '../helpers';
// const { } = fullSchema.properties;

// const { } = fullSchema.definitions;

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
} from '../pages';

const { fullName, ssn, date, dateRange, usaPhone } = commonDefinitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  // submitUrl: '/v0/api',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'Edu-8794-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
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
      title: 'Add additional certifying officials',
      pages: {
        ...arrayBuilderPages(additionalOfficialArrayOptions, pageBuilder => ({
          additionalOfficialSummary: pageBuilder.summaryPage({
            path: 'additional-certifying-officials',
            title: 'Add additional certifying officials',
            uiSchema: additionalOfficialSummary.uiSchema,
            schema: additionalOfficialSummary.schema,
          }),
          additionalOfficialDetails: pageBuilder.itemPage({
            path: 'additional-certifying-officials/:index',
            title: 'Tell us about your certifying official',
            showPagePerItem: true,
            uiSchema: additionalOfficialDetails.uiSchema,
            schema: additionalOfficialDetails.schema,
          }),
          // conflictOfInterestFileNumber: pageBuilder.itemPage({
          //   path: 'conflict-of-interest/:index/file-number',
          //   title:
          //     'Information on an individual with a potential conflict of interest who receives VA educational benefits',
          //   showPagePerItem: true,
          //   uiSchema: conflictOfInterestFileNumber.uiSchema,
          //   schema: conflictOfInterestFileNumber.schema,
          // }),
          // conflictOfInterestEnrollmentPeriod: pageBuilder.itemPage({
          //   path: 'conflict-of-interest/:index/enrollment-period',
          //   title:
          //     'Information on an individual with a potential conflict of interest who receives VA educational benefits',
          //   showPagePerItem: true,
          //   uiSchema: conflictOfInterestEnrollmentPeriod.uiSchema,
          //   schema: conflictOfInterestEnrollmentPeriod.schema,
          // }),
        })),
      },
    },
  },
};

export default formConfig;
