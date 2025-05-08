// config/form.js
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import ConfirmationPage from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/patterns/pattern6/components/IntroductionPage';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';

// Import marital status chapter pages
import currentMaritalStatus from '../pages/currentMaritalStatus';
import marriageType from '../pages/marriageType';
import marriageDateAndLocation from '../pages/marriageDateAndLocation';
import marriageEnd from '../pages/marriageEnd';
import spouseDeathInfo from '../pages/spouseDeathInfo';

// Import spouse information chapter pages
import spousePersonalInfo from '../pages/spousePersonalInfo';
import spouseMilitaryHistory from '../pages/spouseMilitaryHistory';
import spouseContactInfo from '../pages/spouseContactInfo';
import livingSituation from '../pages/livingSituation';
import additionalLivingSituation from '../pages/additionalLivingSituation';
import financialSupport from '../pages/financialSupport';

// Import other marriages chapter pages
import veteranPreviousMarriages from '../pages/veteranPreviousMarriages';
import spousePreviousMarriages from '../pages/spousePreviousMarriages';
import previousMarriageDetails from '../pages/previousMarriageDetails';
import spouseMarriageDetails from '../pages/spouseMarriageDetails';

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
          // Use the imported page configurations once created
          ...currentMaritalStatus,
        },
        spousePersonalInfo: {
          title: "Spouse's Personal Information",
          path: 'spouse-personal-information',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...spousePersonalInfo,
        },
        spouseMilitaryHistory: {
          title: 'Spouse’s military history',
          path: 'spouse-military-history',
          depends: formData => formData?.maritalStatus === 'MARRIED',
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
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...additionalLivingSituation,
        },
        spouseContactInfo: {
          title: "Spouse's address and phone number",
          path: 'spouse-contact-information',
          depends: formData => {
            const status = formData?.maritalStatus || 'MARRIED';
            return status === 'MARRIED';
          },
          ...spouseContactInfo,
        },
        marriageDateAndLocation: {
          title: 'Place and date of marriage',
          path: 'marriage-date-location',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...marriageDateAndLocation,
        },
        marriageType: {
          title: 'What type of marriage do you have?',
          path: 'marital-status/type',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...marriageType,
        },
        marriageEnd: {
          title: 'How did your marriage end?',
          path: 'marital-status/end',
          depends: formData => formData?.maritalStatus === 'DIVORCED',
          ...marriageEnd,
        },
        spouseDeathInfo: {
          title: "Date and location of your spouse's death",
          path: 'marital-status/spouse-death',
          depends: formData => formData?.maritalStatus === 'WIDOWED',
          ...spouseDeathInfo,
        },
      },
    },

    // Second chapter - Spouse Information
    spouseInformationChapter: {
      title: 'Spouse Information',
      pages: {
        financialSupport: {
          title:
            'Did you provide any financial support for your spouse in the last year?',
          path: 'spouse-information/financial-support',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...financialSupport,
        },
      },
    },

    // Third chapter - Other Marriages
    otherMarriagesChapter: {
      title: 'Other Marriages',
      pages: {
        veteranPreviousMarriages: {
          title: 'Previous Marriages',
          path: 'other-marriages/veteran-previous',
          depends: formData =>
            ['MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED'].includes(
              formData?.maritalStatus,
            ),
          ...veteranPreviousMarriages,
        },
        veteranMarriageDetails: {
          title: 'Your Former Marriage',
          path: 'other-marriages/veteran-details/:index',
          depends: (formData, index) => {
            // This check allows the page to show in both add and edit modes
            // Add mode - check main property
            if (
              formData['view:completedVeteranFormerMarriage']?.[
                'view:yesNo'
              ] === true
            ) {
              return true;
            }
            // Edit mode - check if items exist in the array
            return (
              formData?.veteranMarriageHistory &&
              index < formData.veteranMarriageHistory.length
            );
          },
          ...previousMarriageDetails,
        },
        spousePreviousMarriages: {
          title: 'Spouse Previous Marriages',
          path: 'other-marriages/spouse-previous',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...spousePreviousMarriages,
        },
        spouseMarriageDetails: {
          title: "Spouse's Former Marriage",
          path: 'other-marriages/spouse-details/:index',
          depends: (formData, index) => {
            // This check allows the page to show in both add and edit modes
            // Add mode - check main property
            if (
              formData['view:completedSpouseFormerMarriage']?.['view:yesNo'] ===
              true
            ) {
              return true;
            }
            // Edit mode - check if items exist in the array
            return (
              formData?.spouseMarriageHistory &&
              index < formData.spouseMarriageHistory.length
            );
          },
          ...spouseMarriageDetails,
        },
      },
    },
  },
};

export default formConfig;
