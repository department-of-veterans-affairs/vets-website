import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/patterns/pattern6/components/IntroductionPage';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';

import currentMaritalStatus from '../pages/currentMaritalStatus';
import currentMaritalStatusSimple from '../pages/currentMaritalStatusSimple';
import marriageType from '../pages/marriageType';
import marriageDateAndLocation from '../pages/marriageDateAndLocation';
import marriageCertificate from '../pages/marriageDocuments';
import spouseDeathInfo from '../pages/widowed/spouseDeathDateLocation';
import divorceDocuments from '../pages/divorced/divorceDocuments';

import spousePersonalInfo from '../pages/spousePersonalInfo';
import previousSpousePersonalInfo from '../pages/divorced/previousSpousePersonalInfo';
import spouseIdentity from '../pages/spouseIdentity';
import spouseMilitaryIdentification from '../pages/spouseMilitaryIdentification';
import spouseContactInfo from '../pages/spouseContactInfo';
import livingSituation from '../pages/livingSituation';
import additionalLivingSituation from '../pages/additionalLivingSituation';

import veteranPreviousMarriages from '../pages/veteranPreviousMarriages';
import veteranPreviousMarriageEndReason from '../pages/veteranMarriageHistory/previousMarriageEndReason';
import veteranPreviousMarriageEndDateLocation from '../pages/veteranMarriageHistory/previousMarriageEndDateLocation';
import veteranPreviousSpouseIdentity from '../pages/veteranMarriageHistory/previousSpouseIdentity';
import veteranPreviousSpouseContactInfo from '../pages/veteranMarriageHistory/previousSpouseContactInfo';
import veteranPreviousMarriageDateAndLocation from '../pages/veteranMarriageHistory/previousMarriageDateAndLocation';
import veteranPreviousMarriageType from '../pages/veteranMarriageHistory/previousMarriageType';

import spousePreviousMarriages from '../pages/spousePreviousMarriages';
import {
  buildSpouseFormerMarriageUiSchema,
  spouseFormerMarriageSchema,
} from '../pages/spouseMarriageHistory/spouseFormerMarriagePersonalInfo';
import spouseFormerMarriageDateLocation from '../pages/spouseMarriageHistory/spouseFormerMarriageDateLocation';
import spouseFormerMarriageEndReason from '../pages/spouseMarriageHistory/spouseFormerMarriageEndReason';
import spouseFormerMarriageEndDateLocation from '../pages/spouseMarriageHistory/spouseFormerMarriageEndDateLocation';
import {
  spouseMarriageHistoryOptions,
  veteranMarriageHistoryOptions,
} from '../pages/marriageHistoryConfig';
import { saveInProgress, savedFormMessages } from '../content/saveInProgress';

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/6/marital-information/',
  submit: () =>
    Promise.resolve({ attributes: { confirmationNumber: '123123123' } }),
  trackingPrefix: 'marital-information',
  introduction: IntroductionPage,
  confirmation: ({ router }) => {
    router.push('/6/marital-information/introduction');
    return null;
  },
  formId: VA_FORM_IDS.FORM_MOCK_AE_DESIGN_PATTERNS,
  getHelp: GetFormHelp,
  saveInProgress,
  savedFormMessages,
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
  title: 'Marital Information Pattern',
  subTitle: 'Pattern 6 - Marital Information',
  chapters: {
    maritalStatusChapter: {
      title: 'Marital information',
      pages: {
        currentMaritalStatus: {
          title: "What's your marital status?",
          path: 'current-marital-status',
          depends: () => true,
          onNavForward: ({ formData, goPath }) => {
            if (formData?.maritalStatus === 'DIVORCED') {
              // Divorced users go directly to veteran marriage history list & loop
              goPath(
                '/6/marital-information/veteran-marriage-history/0/former-spouse-information?add=true',
              );
            } else if (
              formData?.maritalStatus === 'MARRIED' ||
              formData?.maritalStatus === 'SEPARATED' ||
              formData?.maritalStatus === 'WIDOWED'
            ) {
              // Users with current/deceased spouses go to spouse info first
              goPath('/6/marital-information/spouse-personal-information');
            } else if (formData?.maritalStatus === 'NEVER_MARRIED') {
              // Never married users skip everything and go to review
              goPath('/6/marital-information/review-and-submit');
            }
          },
          ...currentMaritalStatus,
        },
        currentMaritalStatusSimple: {
          title: "What's your marital status?",
          path: 'current-marital-status-simple',
          depends: () => false,
          ...currentMaritalStatusSimple,
        },
        spousePersonalInfo: {
          title: "Spouse's Personal Information",
          path: 'spouse-personal-information',
          depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
          ...spousePersonalInfo,
        },
        spouseIdentity: {
          title: "Spouse's identification information",
          path: 'spouse-identity',
          depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
          ...spouseIdentity,
        },
        spouseMilitaryIdentification: {
          title: 'Spouse’s military identification information',
          path: 'spouse-military-identification',
          depends: formData => formData?.isSpouseVeteran,
          ...spouseMilitaryIdentification,
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
          depends: formData => formData?.currentlyLiveWithSpouse === false,
          ...additionalLivingSituation,
        },
        spouseContactInfo: {
          title: "Spouse's address and phone number",
          path: 'spouse-contact-information',
          depends: formData =>
            (formData?.maritalStatus === 'MARRIED' ||
              formData?.maritalStatus === 'SEPARATED') &&
            !formData?.currentlyLiveWithSpouse,
          ...spouseContactInfo,
        },
        marriageDateAndLocation: {
          title: 'Place and date of marriage',
          path: 'marriage-date-location',
          depends: formData =>
            formData?.maritalStatus === 'MARRIED' ||
            formData?.maritalStatus === 'SEPARATED' ||
            formData?.maritalStatus === 'WIDOWED',
          ...marriageDateAndLocation,
        },
        marriageType: {
          title: 'Type of marriage',
          path: 'marriage-type',
          depends: formData =>
            formData?.maritalStatus === 'MARRIED' ||
            formData?.maritalStatus === 'SEPARATED' ||
            formData?.maritalStatus === 'WIDOWED',
          ...marriageType,
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
          depends: formData =>
            formData?.maritalStatus === 'MARRIED' ||
            formData?.maritalStatus === 'SEPARATED',
          ...marriageCertificate,
        },
        ...arrayBuilderPages(spouseMarriageHistoryOptions, pageBuilder => ({
          spousePreviousMarriages: pageBuilder.summaryPage({
            title: 'Spouse’s marital history',
            path: 'current-spouse-marriage-history',
            uiSchema: spousePreviousMarriages.uiSchema,
            schema: spousePreviousMarriages.schema,
            depends: formData =>
              formData?.maritalStatus !== 'NEVER_MARRIED' &&
              formData?.maritalStatus !== 'WIDOWED' &&
              formData?.maritalStatus !== 'DIVORCED',
            onNavForward: ({ formData, goPath }) => {
              const hasSpousePreviousMarriages =
                formData?.['view:completedSpouseFormerMarriage'];

              if (hasSpousePreviousMarriages === false) {
                goPath('/6/marital-information/veteran-marriage-history');
                return;
              }

              // If user said "yes" to previous marriages
              const spouseHistory = formData?.spouseMarriageHistory || [];
              const nextIndex = spouseHistory.length; // e.g. 0 if none yet, 1 if one exists

              goPath(
                `/6/marital-information/current-spouse-marriage-history/${nextIndex}/former-spouse-information?add=true`,
              );
            },
          }),
          spouseMarriageHistoryPartOne: pageBuilder.itemPage({
            title: 'Previous spouse’s name and date of birth',
            path:
              'current-spouse-marriage-history/:index/former-spouse-information',
            uiSchema: buildSpouseFormerMarriageUiSchema(),
            schema: spouseFormerMarriageSchema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedSpouseFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          spouseMarriageHistoryPartTwo: pageBuilder.itemPage({
            title: 'Place and date of former marriage',
            path:
              'current-spouse-marriage-history/:index/former-marriage-date-location',
            uiSchema: spouseFormerMarriageDateLocation.uiSchema,
            schema: spouseFormerMarriageDateLocation.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedSpouseFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          spouseMarriageHistoryPartThree: pageBuilder.itemPage({
            title: 'Reason former marriage ended',
            path:
              'current-spouse-marriage-history/:index/reason-former-marriage-ended',
            uiSchema: spouseFormerMarriageEndReason.uiSchema,
            schema: spouseFormerMarriageEndReason.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedSpouseFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
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
          }),
        })),
        ...arrayBuilderPages(veteranMarriageHistoryOptions, pageBuilder => ({
          veteranPreviousMarriages: pageBuilder.summaryPage({
            title: 'Marital history',
            path: 'veteran-marriage-history',
            uiSchema: veteranPreviousMarriages.uiSchema,
            schema: veteranPreviousMarriages.schema,
            depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
          }),
          veteranMarriageHistoryPartOne: pageBuilder.itemPage({
            title: "Previous spouse's name and date of birth",
            path: 'veteran-marriage-history/:index/former-spouse-information',
            uiSchema: previousSpousePersonalInfo.uiSchema,
            schema: previousSpousePersonalInfo.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedVeteranFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartTwo: pageBuilder.itemPage({
            title: "Previous spouse's identification information",
            path: 'veteran-marriage-history/:index/previous-spouse-identity',
            uiSchema: veteranPreviousSpouseIdentity.uiSchema,
            schema: veteranPreviousSpouseIdentity.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedVeteranFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartThree: pageBuilder.itemPage({
            title: "Previous spouse's address and phone number",
            path:
              'veteran-marriage-history/:index/previous-spouse-contact-information',
            uiSchema: veteranPreviousSpouseContactInfo.uiSchema,
            schema: veteranPreviousSpouseContactInfo.schema,
            depends: (formData, index) => {
              const marriageItem = formData?.veteranMarriageHistory?.[index];
              return (
                !marriageItem?.['view:previousSpouseIsDeceased'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartFour: pageBuilder.itemPage({
            title: 'Place and date of previous marriage',
            path:
              'veteran-marriage-history/:index/previous-marriage-date-location',
            uiSchema: veteranPreviousMarriageDateAndLocation.uiSchema,
            schema: veteranPreviousMarriageDateAndLocation.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedVeteranFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartFive: pageBuilder.itemPage({
            title: 'Type of marriage',
            path: 'veteran-marriage-history/:index/previous-marriage-type',
            uiSchema: veteranPreviousMarriageType.uiSchema,
            schema: veteranPreviousMarriageType.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedVeteranFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartSix: pageBuilder.itemPage({
            title: 'Reason previous marriage ended',
            path:
              'veteran-marriage-history/:index/reason-previous-marriage-ended',
            uiSchema: veteranPreviousMarriageEndReason.uiSchema,
            schema: veteranPreviousMarriageEndReason.schema,
            depends: (formData, index) => {
              const marriageItem = formData?.veteranMarriageHistory?.[index];
              return (
                !marriageItem?.['view:previousSpouseIsDeceased'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartSeven: pageBuilder.itemPage({
            title: 'Place and date of previous marriage termination',
            path:
              'veteran-marriage-history/:index/former-marriage-end-date-location',
            uiSchema: veteranPreviousMarriageEndDateLocation.uiSchema,
            schema: veteranPreviousMarriageEndDateLocation.schema,
            depends: (formData, index, context) => {
              return (
                formData['view:completedVeteranFormerMarriage'] ||
                context?.edit === true ||
                context?.add === true
              );
            },
          }),
          veteranMarriageHistoryPartEight: pageBuilder.itemPage({
            title: 'Divorce documents',
            path: 'veteran-marriage-history/:index/divorce-documents',
            uiSchema: divorceDocuments.uiSchema,
            schema: divorceDocuments.schema,
            depends: (formData, index, context) => {
              const marriageItem = formData?.veteranMarriageHistory?.[index];
              return (
                marriageItem?.reasonMarriageEnded === 'Divorce' ||
                (formData?.maritalStatus === 'DIVORCED' &&
                  formData?.veteranMarriageHistory?.length > 1) ||
                context?.edit === true ||
                (context?.add === true && formData?.maritalStatus !== 'MARRIED')
              );
            },
          }),
        })),
      },
    },
  },
};

export default formConfig;
