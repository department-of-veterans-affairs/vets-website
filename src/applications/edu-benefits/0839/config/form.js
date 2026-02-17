import footerContent from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import submitForm from './submitForm';
import transform from './transform';
import { TITLE, SUBTITLE, SUBMIT_URL } from '../constants';
import manifest from '../manifest.json';

import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import PrivacyPolicy from '../components/PrivacyPolicy';
import SubmissionInstructions from '../components/SubmissionInstructions';
import {
  authorizedOfficial,
  agreementType,
  acknowledgements,
  institutionDetailsFacility,
  additionalInstitutionDetailsSummary,
  additionalInstitutionDetailsItem,
  additionalInstitutionDetailsItemWithdrawal,
  additionalInstitutionDetailsSummaryWithdrawal,
  yellowRibbonProgramRequest,
  eligibleIndividualsSupported,
  yellowRibbonProgramRequestSummary,
  contributionLimitsAndDegreeLevel,
  foreignContributionLimitsAndDegreeLevel,
  pointsOfContanct,
  additionalPointsOfContact,
} from '../pages';
import {
  additionalInstitutionDetailsArrayOptions,
  showAdditionalPointsOfContact,
  arrayBuilderOptions,
  CustomReviewTopContent,
} from '../helpers';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: SUBMIT_URL,
  submit: submitForm,
  trackingPrefix: 'edu-0839-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  formId: VA_FORM_IDS.FORM_22_0839,
  saveInProgress: {
    messages: {
      inProgress: 'Your form (22-0839) is in progress.',
      expired:
        'Your saved form (22-0839) has expired. Please start a new form.',
      saved: 'Your form has been saved.',
    },
  },
  version: 0,
  prefillEnabled: true,
  preSubmitInfo: {
    statementOfTruth: {
      heading: 'Certification statement',
      body: PrivacyPolicy,
      messageAriaDescribedby: 'I have read and accept the privacy policy.',
      fullNamePath: 'authorizedOfficial.fullName',
    },
  },
  savedFormMessages: {
    notFound: 'Please start over.',
    noAuth: 'Please sign in again to continue your form.',
  },
  title: TITLE,
  subTitle: SUBTITLE,
  CustomReviewTopContent,
  defaultDefinitions: {},
  customText: {
    appSavedSuccessfullyMessage: 'We’ve saved your form.',
    appType: 'form',
    continueAppButtonText: 'Continue your form',
    finishAppLaterMessage: 'Finish this form later',
    startNewAppButtonText: 'Start a new form',
    reviewPageTitle: 'Review form',
    submitButtonText: 'Continue',
  },
  useCustomScrollAndFocus: true,
  transformForSubmit: transform,
  chapters: {
    personalInformationChapter: {
      title: 'Personal details of authorized official',
      pages: {
        authorizedOfficial: {
          path: 'authorized-official',
          title: 'Authorized Official',
          uiSchema: authorizedOfficial.uiSchema,
          schema: authorizedOfficial.schema,
        },
      },
    },
    agreementTypeChapter: {
      title: 'Agreement type',
      pages: {
        agreementType: {
          path: 'agreement-type',
          title: 'Agreement type',
          uiSchema: agreementType.uiSchema,
          schema: agreementType.schema,
          onNavForward: ({ formData, goPath }) => {
            if (formData.agreementType === 'withdrawFromYellowRibbonProgram') {
              goPath('institution-details-facility');
            } else {
              goPath('acknowledgements');
            }
          },
          updateFormData: agreementType.updateFormData,
        },
      },
    },
    acknowledgementsChapter: {
      title: 'Acknowledgements of Yellow Ribbon Program terms',
      pages: {
        acknowledgements: {
          path: 'acknowledgements',
          title: 'Acknowledgements of Yellow Ribbon Program terms',
          uiSchema: acknowledgements.uiSchema,
          schema: acknowledgements.schema,
          pageClass: 'acknowledgements-page',
          depends: formData =>
            formData?.agreementType !== 'withdrawFromYellowRibbonProgram',
        },
      },
    },
    institutionDetailsChapter: {
      title: 'Institution details',
      pages: {
        institutionDetailsFacility: {
          path: 'institution-details-facility',
          title: 'Institution details',
          uiSchema: institutionDetailsFacility.uiSchema,
          schema: institutionDetailsFacility.schema,
          onNavBack: ({ formData, goPath }) => {
            if (formData.agreementType === 'withdrawFromYellowRibbonProgram') {
              goPath('/agreement-type');
            } else {
              goPath('/acknowledgements');
            }
          },
        },
      },
    },
    additionalInstitutionDetailsChapter: {
      title: 'Additional locations',
      pages: {
        // ADD FLOW
        ...arrayBuilderPages(
          additionalInstitutionDetailsArrayOptions,
          pageBuilder => ({
            additionalInstitutionDetailsSummary: pageBuilder.summaryPage({
              path: 'additional-institution-details',
              title: 'Additional institution details',
              uiSchema: additionalInstitutionDetailsSummary.uiSchema,
              schema: additionalInstitutionDetailsSummary.schema,
              depends: formData =>
                formData?.agreementType !== 'withdrawFromYellowRibbonProgram',
            }),
            additionalInstitutionDetailsItem: pageBuilder.itemPage({
              path: 'additional-institution-details/:index',
              title:
                "Enter the VA facility code for the additional location you'd like to add",
              showPagePerItem: true,
              uiSchema: additionalInstitutionDetailsItem.uiSchema,
              schema: additionalInstitutionDetailsItem.schema,
              depends: formData =>
                formData?.agreementType !== 'withdrawFromYellowRibbonProgram',
            }),
          }),
        ),

        // WITHDRAW FLOW
        ...arrayBuilderPages(
          additionalInstitutionDetailsArrayOptions,
          pageBuilder => ({
            additionalInstitutionDetailsSummaryWithdrawal:
              pageBuilder.summaryPage({
                path: 'additional-institution-details-withdrawal',
                title: 'Additional institution details',
                uiSchema:
                  additionalInstitutionDetailsSummaryWithdrawal.uiSchema,
                schema: additionalInstitutionDetailsSummaryWithdrawal.schema,
                depends: formData =>
                  formData?.agreementType === 'withdrawFromYellowRibbonProgram',
              }),
            additionalInstitutionDetailsItemWithdrawal: pageBuilder.itemPage({
              path: 'additional-institution-details-withdrawal/:index',
              title:
                "Enter the VA facility code for the additional location you'd like to withdraw",
              showPagePerItem: true,
              uiSchema: additionalInstitutionDetailsItemWithdrawal.uiSchema,
              schema: additionalInstitutionDetailsItemWithdrawal.schema,
              depends: formData =>
                formData?.agreementType === 'withdrawFromYellowRibbonProgram',
            }),
          }),
        ),
      },
    },

    yellowRibbonProgramRequestChapter: {
      title: 'Yellow Ribbon Program contributions',
      pages: {
        ...arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
          yellowRibbonProgramRequestIntro: pageBuilder.introPage({
            title: 'Yellow Ribbon Program contributions',
            path: 'yellow-ribbon-program-request',
            uiSchema: yellowRibbonProgramRequest.uiSchema,
            schema: yellowRibbonProgramRequest.schema,
            depends: formData =>
              formData?.agreementType !== 'withdrawFromYellowRibbonProgram',
          }),
          yellowRibbonProgramRequestSummary: pageBuilder.summaryPage({
            title: 'Yellow Ribbon Program contributions',
            path: 'yellow-ribbon-program-request/summary',
            uiSchema: yellowRibbonProgramRequestSummary.uiSchema,
            schema: yellowRibbonProgramRequestSummary.schema,
            depends: formData =>
              formData?.agreementType !== 'withdrawFromYellowRibbonProgram',
          }),
          yellowRibbonProgramContribution: pageBuilder.itemPage({
            title: 'Add a Yellow Ribbon Program contribution',
            path: 'yellow-ribbon-program-request/:index',
            uiSchema: eligibleIndividualsSupported.uiSchema,
            schema: eligibleIndividualsSupported.schema,
            depends: (formData, index) =>
              formData?.agreementType !== 'withdrawFromYellowRibbonProgram' &&
              index < 1,
          }),
          contributionLimitsAndDegreeLevel: pageBuilder.itemPage({
            title: 'Contribution limits and degree level',
            path: 'yellow-ribbon-program-request/:index/contribution-limits',
            uiSchema: contributionLimitsAndDegreeLevel.uiSchema,
            schema: contributionLimitsAndDegreeLevel.schema,
            depends: formData =>
              formData?.agreementType !== 'withdrawFromYellowRibbonProgram' &&
              !!formData?.institutionDetails?.isUsaSchool,
            pageClass: 'ypr-no-expander-border',
          }),
          foreignContributionLimitsAndDegreeLevel: pageBuilder.itemPage({
            title: 'Contribution limits and degree level',
            path: 'yellow-ribbon-program-request/:index/contribution-limits-foreign',
            uiSchema: foreignContributionLimitsAndDegreeLevel.uiSchema,
            schema: foreignContributionLimitsAndDegreeLevel.schema,
            depends: formData => {
              return (
                formData?.agreementType !== 'withdrawFromYellowRibbonProgram' &&
                formData?.institutionDetails?.isUsaSchool === false
              );
            },
            pageClass: 'ypr-no-expander-border',
          }),
        })),
      },
    },
    pointsOfContactChapter: {
      title: 'Points of contact',
      pages: {
        pointsOfContanct: {
          path: 'points-of-contact',
          title: 'Points of contact',
          uiSchema: pointsOfContanct.uiSchema,
          schema: pointsOfContanct.schema,
          depends: formData =>
            formData?.agreementType !== 'withdrawFromYellowRibbonProgram',
        },
        additionalPointsOfContact: {
          path: 'additional-points-of-contact',
          title: 'additional points of contact',
          uiSchema: additionalPointsOfContact.uiSchema,
          schema: additionalPointsOfContact.schema,
          depends: formData =>
            formData?.agreementType !== 'withdrawFromYellowRibbonProgram' &&
            showAdditionalPointsOfContact(formData),
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
  footerContent,
};

export default formConfig;
