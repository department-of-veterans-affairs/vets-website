import React from 'react';
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import ConfirmationPage from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/patterns/pattern6/components/IntroductionPage';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
// import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { arrayBuilderPages } from 'applications/_mock-form-ae-design-patterns/patterns/pattern6/array-builder/arrayBuilder';
import {
  titleUI,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
// Import marital status chapter pages
import currentMaritalStatus from '../pages/currentMaritalStatus';
import marriageType from '../pages/marriageType';
import marriageDateAndLocation from '../pages/marriageDateAndLocation';
import marriageCertificate from '../pages/marriageCertificate';
import marriageTermination from '../pages/divorced/marriageEnd';
import spouseDeathInfo from '../pages/widowed/spouseDeathDateLocation';
import divorceDocuments from '../pages/divorced/divorceDocuments';

// Import spouse information chapter pages
import spousePersonalInfo from '../pages/spousePersonalInfo';
import previousSpousePersonalInfo from '../pages/divorced/previousSpousePersonalInfo';
import deceasedSpousePersonalInfo from '../pages/widowed/deceasedSpousePersonalInfo';
import spouseIdentity from '../pages/spouseIdentity';
import spouseMilitaryHistory from '../pages/spouseMilitaryHistory';
import spouseContactInfo from '../pages/spouseContactInfo';
import livingSituation from '../pages/livingSituation';
import additionalLivingSituation from '../pages/additionalLivingSituation';
import financialSupport from '../pages/financialSupport';

import veteranPreviousMarriages from '../pages/veteranPreviousMarriages';
import spousePreviousMarriages from '../pages/spousePreviousMarriages';
import previousMarriageDetails from '../pages/previousMarriageDetails';
import {
  spouseFormerMarriagePersonalInfo,
  buildSpouseFormerMarriageUiSchema,
  spouseFormerMarriageSchema,
} from '../pages/marriageHistory/spouseFormerMarriagePersonalInfo';
import spouseFormerMarriageDateLocation from '../pages/marriageHistory/spouseFormerMarriageDateLocation';
import spouseFormerMarriageEndReason from '../pages/marriageHistory/spouseFormerMarriageEndReason';
import spouseFormerMarriageEndDateLocation from '../pages/marriageHistory/spouseFormerMarriageEndDateLocation';
import { spouseMarriageHistoryOptions } from '../pages/marriageHistoryConfig';
import { description } from 'platform';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/6/marital-status/',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'marital-status',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress: {},
  version: 0,
  prefillTransformer(pages, formData, metadata) {
    const transformedData = {
      ssn: formData?.veteranSocialSecurityNumber || null,
      vaFileNumber: formData?.veteranVAFileNumber || null,
    };
    return {
      metadata,
      formData: transformedData,
      pages,
    };
  },
  prefillEnabled: true,
  title: 'Marital Status Form Pattern',
  subTitle: 'Pattern 6 - Marital Status',
  // Disable the review page
  hideFromReview: [
    'formSpouseName',
    'formMarriageDate',
    'formMarriageLocation',
    'formMarriageEndDate',
    'formMarriageEndReason',
    'previousMarriages',
  ],
  chapters: {
    // First chapter - Marital Status
    maritalStatusChapter: {
      title: 'Marital Status',
      pages: {
        currentMaritalStatus: {
          title: "What's your current marital status?",
          path: 'current-marital-status',
          depends: () => true,
          ...currentMaritalStatus,
        },
        spousePersonalInfo: {
          title: "Spouse's Personal Information",
          path: '/spouse-personal-information',
          depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
          ...spousePersonalInfo,
        },
        spouseIdentity: {
          title: "Spouse's identification information",
          path: '/spouse-identity',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...spouseIdentity,
        },
        spouseMilitaryHistory: {
          title: 'Spouse’s military history',
          path: 'spouse-military-history',
          depends: formData => formData?.isSpouseVeteran,
          ...spouseMilitaryHistory,
        },
        livingSituation: {
          title: 'Living Situation',
          path: 'living-situation',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...livingSituation,
        },
        additionalLivingSituation: {
          title: 'Additional Living Situation Information',
          path: 'additional-living-situation',
          depends: formData => !formData?.currentlyLiveWithSpouse,
          ...additionalLivingSituation,
        },
        spouseContactInfo: {
          title: "Spouse's address and phone number",
          path: 'spouse-contact-information',
          depends: formData =>
            formData?.maritalStatus !== 'NEVER_MARRIED' &&
            !formData?.currentlyLiveWithSpouse,
          ...spouseContactInfo,
        },
        marriageDateAndLocation: {
          title: 'Place and date of marriage',
          path: 'marriage-date-location',
          depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
          ...marriageDateAndLocation,
        },
        marriageType: {
          title: 'What type of marriage do you have?',
          path: '/marriage-type',
          depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
          ...marriageType,
        },
        marriageTermination: {
          title: 'Place and date of marriage termination',
          path: 'marriage-end-date-location',
          depends: formData => formData?.maritalStatus === 'DIVORCED',
          ...marriageTermination,
        },
        spouseDeathInfo: {
          title: "Place and date of spouse's death",
          path: 'spouse-death-information',
          depends: formData => formData?.maritalStatus === 'WIDOWED',
          ...spouseDeathInfo,
        },
        marriageCertificate: {
          title: 'Marriage certificate',
          path: 'marriage-certificate',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...marriageCertificate,
        },
        divorceDocuments: {
          title: 'Divorce documents',
          path: 'divorce-documents',
          depends: formData => formData?.maritalStatus === 'DIVORCED',
          ...divorceDocuments,
        },
        ...arrayBuilderPages(spouseMarriageHistoryOptions, pageBuilder => ({
          spousePreviousMarriages: pageBuilder.summaryPage({
            title: 'Spouse’s marital history',
            path: 'current-spouse-marriage-history',
            uiSchema: spousePreviousMarriages.uiSchema,
            schema: spousePreviousMarriages.schema,
            depends: formData =>
              formData?.maritalStatus !== 'NEVER_MARRIED' &&
              formData?.maritalStatus !== 'WIDOWED',
          }),
          spouseMarriageHistoryPartOne: pageBuilder.itemPage({
            title: 'Previous spouse’s name and date of birth',
            path:
              'current-spouse-marriage-history/:index/former-spouse-information',
            uiSchema: buildSpouseFormerMarriageUiSchema(),
            schema: spouseFormerMarriageSchema,
            depends: formData => formData['view:completedSpouseFormerMarriage'],
          }),
          spouseMarriageHistoryPartTwo: pageBuilder.itemPage({
            title: 'Place and date of former marriage',
            path:
              'current-spouse-marriage-history/:index/former-marriage-date-location',
            uiSchema: spouseFormerMarriageDateLocation.uiSchema,
            schema: spouseFormerMarriageDateLocation.schema,
            depends: formData => formData['view:completedSpouseFormerMarriage'],
          }),
          spouseMarriageHistoryPartThree: pageBuilder.itemPage({
            title: 'Reason former marriage ended',
            path:
              'current-spouse-marriage-history/:index/reason-former-marriage-ended',
            uiSchema: spouseFormerMarriageEndReason.uiSchema,
            schema: spouseFormerMarriageEndReason.schema,
            depends: formData => formData['view:completedSpouseFormerMarriage'],
          }),
          spouseMarriageHistoryPartFour: pageBuilder.itemPage({
            title: 'Place and date of former marriage termination',
            path:
              'current-spouse-marriage-history/:index/former-marriage-end-date-location',
            uiSchema: spouseFormerMarriageEndDateLocation.uiSchema,
            schema: spouseFormerMarriageEndDateLocation.schema,
            depends: (formData, index, context) =>
              context?.edit ||
              context?.review ||
              formData['view:completedSpouseFormerMarriage'],
            // depends: formData => formData['view:completedSpouseFormerMarriage'],
          }),
        })),
      },
    },
  },
};

export default formConfig;
