// config/form.js
import { VA_FORM_IDS } from 'platform/forms/constants';
import manifest from 'applications/_mock-form-ae-design-patterns/manifest.json';
import ConfirmationPage from 'applications/_mock-form-ae-design-patterns/shared/components/pages/Confirmation';
import IntroductionPage from 'applications/_mock-form-ae-design-patterns/patterns/pattern6/components/Introduction';
import { GetFormHelp } from 'applications/_mock-form-ae-design-patterns/shared/components/GetFormHelp';

// Import marital status chapter pages
import currentMaritalStatus from '../chapters/maritalStatus/currentMaritalStatus';
import marriageType from '../chapters/maritalStatus/marriageType';
import marriageLocation from '../chapters/maritalStatus/marriageLocation';
import marriageEnd from '../chapters/maritalStatus/marriageEnd';
import spouseDeathInfo from '../chapters/maritalStatus/spouseDeathInfo';

// Import spouse information chapter pages
import spousePersonalInfo from '../chapters/spouseInformation/spousePersonalInfo';
import spouseVeteranStatus from '../chapters/spouseInformation/spouseVeteranStatus';
import livingArrangements from '../chapters/spouseInformation/livingArrangements';
import financialSupport from '../chapters/spouseInformation/financialSupport';

// Import other marriages chapter pages
import veteranPreviousMarriages from '../chapters/otherMarriages/veteranPreviousMarriages';
import spousePreviousMarriages from '../chapters/otherMarriages/spousePreviousMarriages';
import previousMarriageDetails from '../chapters/otherMarriages/previousMarriageDetails';
import spouseMarriageDetails from '../chapters/otherMarriages/spouseMarriageDetails';

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
          path: 'marital-status/current',
          depends: () => true,
          // Use the imported page configurations once created
          ...currentMaritalStatus,
        },
        marriageType: {
          title: 'What type of marriage do you have?',
          path: 'marital-status/type',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...marriageType,
        },
        marriageLocation: {
          title: 'Date and location of marriage',
          path: 'marital-status/location',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...marriageLocation,
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
        spousePersonalInfo: {
          title: "Your Spouse's Personal Information",
          path: 'spouse-information/personal',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...spousePersonalInfo,
        },
        spouseVeteranStatus: {
          title: 'Is your spouse a Veteran?',
          path: 'spouse-information/veteran-status',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...spouseVeteranStatus,
        },
        livingArrangements: {
          title:
            'Did you live with your spouse for any part of the previous year?',
          path: 'spouse-information/living-arrangements',
          depends: formData => formData?.maritalStatus === 'MARRIED',
          ...livingArrangements,
        },
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
