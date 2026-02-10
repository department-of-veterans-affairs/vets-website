import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';
import { TITLE, SUBTITLE } from '../utils/constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormSavedPage from '../containers/FormSavedPage';
import { defaultDefinitions } from './definitions';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';
import veteranIdentification from './chapters/01-veteran-information/veteranIdentification';
import veteranAdditional from './chapters/01-veteran-information/veteranAdditional';
import veteranName from './chapters/01-veteran-information/veteranName';
import claimantRelationship from './chapters/02-claimant-information/claimantRelationship';
import claimantInformation from './chapters/02-claimant-information/claimantInformation';
import claimantIdentification from './chapters/02-claimant-information/claimantIdentification';
import claimantHistory from './chapters/02-claimant-information/claimantHistory';
import mailingAddress from './chapters/02-claimant-information/mailingAddress';
import contactInformation from './chapters/02-claimant-information/contactInformation';
import benefitType from './chapters/02-claimant-information/benefitType';
import vaBenefits from './chapters/03-military-history/vaBenefits';
import servicePeriod from './chapters/03-military-history/servicePeriod';
import nationalGuardService from './chapters/03-military-history/nationalGuardService';
import nationalGuardServicePeriod from './chapters/03-military-history/nationalGuardServicePeriod';
import nationalGuardUnitAddress from './chapters/03-military-history/nationalGuardUnitAddress';
import { otherServiceNamesPages } from './chapters/03-military-history/serviceNames';
import prisonerOfWarPage from './chapters/03-military-history/prisonerOfWar';
import powPeriodOfTimePage from './chapters/03-military-history/powPeriodOfTime';
import marriageToVeteran from './chapters/04-household-information/marriageToVeteran';
import marriageToVeteranLocation from './chapters/04-household-information/marriageToVeteranLocation';
import marriageToVeteranInfo from './chapters/04-household-information/marriageToVeteranInfo';
import marriageToVeteranEnd from './chapters/04-household-information/marriageToVeteranEnd';
import marriageToVeteranEndInfo from './chapters/04-household-information/marriageToVeteranEndInfo';
import legalStatusOfMarriage from './chapters/04-household-information/legalStatusOfMarriage';
import marriageStatus from './chapters/04-household-information/marriageStatus';
import reasonForSeparation from './chapters/04-household-information/reasonForSeparation';
import separationDetails from './chapters/04-household-information/separationDetails';
import remarriage from './chapters/04-household-information/remarriage';
import remarriageDetails from './chapters/04-household-information/remarriageDetails';
import additionalMarriages from './chapters/04-household-information/additionalMarriages';
import spouseMarriages from './chapters/04-household-information/spouseMarriages';
import { previousMarriagesPages } from './chapters/04-household-information/previousMarriagesPages';
import { veteranMarriagesPages } from './chapters/04-household-information/veteranMarriagesPages';
import veteranChildren from './chapters/04-household-information/veteranChildren';
import dependentsCount from './chapters/04-household-information/dependentsCount';
import dependentsPages from './chapters/04-household-information/dependentsPages';
import dependentsResidence from './chapters/04-household-information/dependentsResidence';
import dependentsAddress from './chapters/04-household-information/dependentsAddress';
import dependentsCustodian from './chapters/04-household-information/dependentsCustodian';
import dicBenefits from './chapters/05-claim-information/dicBenefits';
import nursingHome from './chapters/05-claim-information/nursingHome';
import { treatmentPages } from './chapters/05-claim-information/treatmentPages';
import incomeAndAssets from './chapters/06-financial-information/incomeAndAssets/incomeAndAssets';
import incomeSources from './chapters/06-financial-information/incomeAndAssets/incomeSources';
import { grossMonthlyIncomePages } from './chapters/06-financial-information/incomeAndAssets/grossMonthlyIncomePages';
import { careExpensesPages } from './chapters/06-financial-information/careFacilityExpenses/careExpensesPages';
import { medicalExpensesPages } from './chapters/06-financial-information/medicalExpenses/medicalExpensesPages';
import totalAssets from './chapters/06-financial-information/incomeAndAssets/totalAssets';
import submitSupportingDocs from './chapters/06-financial-information/incomeAndAssets/submitSupportingDocs';
import transferredAssets from './chapters/06-financial-information/incomeAndAssets/transferredAssets';
import homeOwnership from './chapters/06-financial-information/incomeAndAssets/homeOwnership';
import landLotSize from './chapters/06-financial-information/incomeAndAssets/landLotSize';
import additionalLandValue from './chapters/06-financial-information/incomeAndAssets/additionalLandValue';
import marketableLand from './chapters/06-financial-information/incomeAndAssets/marketableLand';
import directDeposit from './chapters/07-additional-information/directDeposit';
import directDepositAccount from './chapters/07-additional-information/directDepositAccount';
import otherPaymentOptions from './chapters/07-additional-information/otherPaymentOptions';
import supportingDocuments from './chapters/07-additional-information/supportingDocuments';
import uploadDocuments from './chapters/07-additional-information/uploadDocuments';
import IncorrectForm from '../containers/IncorrectForm';
// TODO: Will be added after mvp release
// import reviewDocuments from './chapters/07-additional-information/reviewDocuments';
import { transform } from './submit-transformer';
import migrations from '../utils/migrations';
// import prefillTransformer from './prefill-transformer';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/survivors_benefits/v0/form534ez`,
  transformForSubmit: transform,
  trackingPrefix: 'survivors-534ez',
  v3SegmentedProgressBar: true,
  prefillEnabled: true,
  // prefillTransformer,
  dev: {
    disableWindowUnloadInCI: true,
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  formId: VA_FORM_IDS.FORM_21P_534EZ,
  saveInProgress: {
    messages: {
      inProgress: 'Your benefits application (21P-534EZ) is in progress.',
      expired:
        'Your saved benefits application (21P-534EZ) has expired. If you want to apply for benefits, please start a new application.',
      saved: 'Your benefits application has been saved.',
    },
  },
  version: 0,
  migrations,
  formSavedPage: FormSavedPage,
  defaultDefinitions,
  savedFormMessages: {
    notFound: 'Please start over to apply for benefits.',
    noAuth: 'Please sign in again to continue your application for benefits.',
  },
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'claimantFullName',
    },
  },
  title: TITLE,
  subTitle: SUBTITLE,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  // Commenting out to troubleshoot error on staging.
  // showReviewErrors: !environment.isProduction() && !environment.isStaging(),
  chapters: {
    // Chapter 1 - Veteran Information
    veteranInformation: {
      title: 'Veteran’s information',
      pages: {
        veteranName: {
          title: 'Veteran’s name and date of birth',
          path: 'veteran',
          uiSchema: veteranName.uiSchema,
          schema: veteranName.schema,
        },
        veteranIdentification: {
          title: 'Veteran’s identification information',
          path: 'veteran-identification',
          uiSchema: veteranIdentification.uiSchema,
          schema: veteranIdentification.schema,
        },
        veteranIdentificationAdditional: {
          title: 'Additional Veteran information',
          path: 'veteran-additional-information',
          uiSchema: veteranAdditional.uiSchema,
          schema: veteranAdditional.schema,
        },
      },
    },
    // Chapter 2 - Claimant Information
    claimantInformation: {
      title: "Claimant's information",
      pages: {
        claimantRelationship: {
          path: 'claimant-relationship',
          title: 'Claimant’s relationship to the Veteran',
          uiSchema: claimantRelationship.uiSchema,
          schema: claimantRelationship.schema,
        },
        claimantOther: {
          path: 'claimant-other',
          title: 'Claimant’s relationship to the Veteran',
          CustomPage: IncorrectForm,
          CustomPageReview: null,
          uiSchema: {},
          schema: blankSchema,
          depends: formData => formData.claimantRelationship === 'OTHER',
        },
        claimantInformation: {
          path: 'claimant-information',
          title: 'Claimant’s name and date of birth',
          uiSchema: claimantInformation.uiSchema,
          schema: claimantInformation.schema,
        },
        claimantIdentification: {
          path: 'claimant-identification',
          title: 'Claimant’s identification information',
          uiSchema: claimantIdentification.uiSchema,
          schema: claimantIdentification.schema,
        },
        claimantHistory: {
          path: 'claimant-service-history',
          title: 'Claimant’s service history',
          uiSchema: claimantHistory.uiSchema,
          schema: claimantHistory.schema,
        },
        mailingAddress: {
          path: 'claimant-mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          path: 'claimant-contact-information',
          title: 'Email address and phone number',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        benefitType: {
          path: 'claimant-benefit-type',
          title: 'Benefit type',
          uiSchema: benefitType.uiSchema,
          schema: benefitType.schema,
        },
      },
    },
    // Chapter 3 - Military History
    militaryHistory: {
      title: 'Veteran’s military history',
      pages: {
        militaryHistory: {
          path: 'va-benefits',
          title: 'VA benefits',
          uiSchema: vaBenefits.uiSchema,
          schema: vaBenefits.schema,
        },
        servicePeriod: {
          path: 'service-period',
          title: 'Veteran information',
          depends: formData => formData.receivedBenefits === false,
          uiSchema: servicePeriod.uiSchema,
          schema: servicePeriod.schema,
        },
        nationalGuardService: {
          path: 'national-guard-service',
          title: 'National Guard service',
          depends: formData => formData.receivedBenefits === false,
          uiSchema: nationalGuardService.uiSchema,
          schema: nationalGuardService.schema,
        },
        nationalGuardServicePeriod: {
          path: 'national-guard-service-period',
          title: 'National Guard service period',
          depends: formData => formData.nationalGuardActivated === true,
          uiSchema: nationalGuardServicePeriod.uiSchema,
          schema: nationalGuardServicePeriod.schema,
        },
        nationalGuardUnitAddress: {
          path: 'national-guard-unit-address',
          title: 'National Guard Unit address',
          depends: formData => formData.nationalGuardActivated === true,
          uiSchema: nationalGuardUnitAddress.uiSchema,
          schema: nationalGuardUnitAddress.schema,
        },
        ...otherServiceNamesPages,
        prisonerOfWar: {
          path: 'prisoner-of-war',
          title: 'Prisoner of war',
          depends: formData => formData.receivedBenefits === false,
          uiSchema: prisonerOfWarPage.uiSchema,
          schema: prisonerOfWarPage.schema,
        },
        powPeriodOfTime: {
          path: 'prisoner-of-war-period',
          title: 'Prisoner of war period',
          depends: formData => formData?.pow === true,
          uiSchema: powPeriodOfTimePage.uiSchema,
          schema: powPeriodOfTimePage.schema,
        },
      },
    },
    // Chapter 4 - Household Information
    householdInformation: {
      title: 'Household information',
      pages: {
        marriageToVeteran: {
          path: 'household/marriage-to-veteran',
          title: 'Marriage to Veteran',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: marriageToVeteran.uiSchema,
          schema: marriageToVeteran.schema,
        },
        marriageToVeteranLocation: {
          path: 'household/marriage-to-veteran-location',
          title: 'Marriage to Veteran Location',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: marriageToVeteranLocation.uiSchema,
          schema: marriageToVeteranLocation.schema,
        },
        marriageToVeteranInfo: {
          path: 'household/marriage-to-veteran-info',
          title: 'Marriage to Veteran Details',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: marriageToVeteranInfo.uiSchema,
          schema: marriageToVeteranInfo.schema,
        },
        marriageToVeteranEnd: {
          path: 'household/marriage-to-veteran-end',
          title: 'Marriage to Veteran Details',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
            !formData.marriedToVeteranAtTimeOfDeath,
          uiSchema: marriageToVeteranEnd.uiSchema,
          schema: marriageToVeteranEnd.schema,
        },
        marriageToVeteranEndInfo: {
          path: 'household/marriage-to-veteran-end-info',
          title: 'Marriage to Veteran Details',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: marriageToVeteranEndInfo.uiSchema,
          schema: marriageToVeteranEndInfo.schema,
        },
        legalStatusOfMarriage: {
          path: 'household/legal-status-of-marriage',
          title: 'Legal status of marriage',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: legalStatusOfMarriage.uiSchema,
          schema: legalStatusOfMarriage.schema,
        },
        marriageStatus: {
          path: 'household/marriage-status',
          title: 'Marriage status',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: marriageStatus.uiSchema,
          schema: marriageStatus.schema,
        },
        reasonForSeparation: {
          path: 'household/reason-for-separation',
          title: 'Reason for separation',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
            formData.livedContinuouslyWithVeteran === false,
          uiSchema: reasonForSeparation.uiSchema,
          schema: reasonForSeparation.schema,
        },
        separationDetails: {
          path: 'household/separation-details',
          title: 'Separation details',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
            formData.separationDueToAssignedReasons &&
            formData.separationDueToAssignedReasons !== 'OTHER',
          uiSchema: separationDetails.uiSchema,
          schema: separationDetails.schema,
        },
        remarriage: {
          path: 'household/remarriage',
          title: 'Remarriage',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: remarriage.uiSchema,
          schema: remarriage.schema,
        },
        remarriageDetails: {
          path: 'household/remarriage-details',
          title: 'Remarriage details',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
            formData.remarriedAfterVeteralDeath === true,
          uiSchema: remarriageDetails.uiSchema,
          schema: remarriageDetails.schema,
        },
        additionalMarriages: {
          path: 'household/additional-marriages',
          title: 'Additional marriages',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE' &&
            formData.remarriedAfterVeteralDeath === true,
          uiSchema: additionalMarriages.uiSchema,
          schema: additionalMarriages.schema,
        },
        spouseMarriages: {
          path: 'household/spouse-marriage-question',
          title: 'Previous marriages',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE',
          uiSchema: spouseMarriages.uiSchema,
          schema: spouseMarriages.schema,
        },
        ...previousMarriagesPages,
        ...veteranMarriagesPages,
        veteranChildren: {
          path: 'household/children-of-veteran',
          title: 'Children of Veteran',
          depends: formData =>
            formData.claimantRelationship === 'SURVIVING_SPOUSE' ||
            formData.hadPreviousMarriages === true,
          uiSchema: veteranChildren.uiSchema,
          schema: veteranChildren.schema,
        },
        dependentsCount: {
          path: 'household/dependents-count',
          title: 'Number of dependents',
          uiSchema: dependentsCount.uiSchema,
          schema: dependentsCount.schema,
        },
        ...dependentsPages,
        dependentsResidence: {
          path: 'household/dependents-residence',
          title: 'Dependent’s residence',
          depends: formData => {
            if (formData.veteranChildrenCount > 0) {
              const livesWith = formData?.veteransChildren?.findIndex(
                element => element.livesWith === false,
              );
              return livesWith !== -1;
            }
            return false;
          },
          uiSchema: dependentsResidence.uiSchema,
          schema: dependentsResidence.schema,
        },
        dependentsAddress: {
          path: 'household/dependents-address',
          title: 'Dependent’s mailing address',
          depends: formData =>
            formData?.childrenLiveTogetherButNotWithSpouse === true,
          uiSchema: dependentsAddress.uiSchema,
          schema: dependentsAddress.schema,
        },
        dependentsName: {
          path: 'household/dependents-custodian',
          title: 'Dependent’s custodian',
          depends: formData =>
            formData?.childrenLiveTogetherButNotWithSpouse === true,
          uiSchema: dependentsCustodian.uiSchema,
          schema: dependentsCustodian.schema,
        },
      },
    },
    // Chapter 5 - Claim Information
    claimInformation: {
      title: 'Claim information',
      pages: {
        dicBenefits: {
          title: 'D.I.C. benefits',
          path: 'claim-information/dic',
          depends: formData => formData?.claims?.DIC === true,
          uiSchema: dicBenefits.uiSchema,
          schema: dicBenefits.schema,
        },
        ...treatmentPages,
        nursingHome: {
          title: 'Nursing home or increased survivor entitlement',
          path: 'claim-information/nursing-home',
          uiSchema: nursingHome.uiSchema,
          schema: nursingHome.schema,
        },
      },
    },
    // Chapter 6 - Financial Information
    financialInformation: {
      title: 'Financial information',
      pages: {
        incomeAndAssets: {
          title: 'Income and assets',
          path: 'financial-information/income-and-assets',
          depends: formData => formData?.claims?.survivorsPension === true,
          uiSchema: incomeAndAssets.uiSchema,
          schema: incomeAndAssets.schema,
        },
        submitSupportingDocs: {
          title: 'Submit supporting documents',
          path: 'financial-information/submit-supporting-documents',
          depends: formData =>
            formData?.totalNetWorth === true &&
            formData?.claims?.survivorsPension === true,
          uiSchema: submitSupportingDocs.uiSchema,
          schema: submitSupportingDocs.schema,
        },
        totalAssets: {
          title: 'Total assets',
          path: 'financial-information/total-assets',
          depends: formData =>
            formData?.totalNetWorth === false &&
            formData?.claims?.survivorsPension === true,
          uiSchema: totalAssets.uiSchema,
          schema: totalAssets.schema,
        },
        transferredAssets: {
          title: 'Transferred assets',
          path: 'financial-information/transferred-assets',
          depends: formData => formData?.claims?.survivorsPension === true,
          uiSchema: transferredAssets.uiSchema,
          schema: transferredAssets.schema,
        },
        homeOwnership: {
          title: 'Homeownership',
          path: 'financial-information/homeownership',
          depends: formData => formData?.claims?.survivorsPension === true,
          uiSchema: homeOwnership.uiSchema,
          schema: homeOwnership.schema,
        },
        landLotSize: {
          title: 'Land lot size',
          path: 'financial-information/land-lot-size',
          depends: formData =>
            formData?.homeOwnership === true &&
            formData?.claims?.survivorsPension === true,
          uiSchema: landLotSize.uiSchema,
          schema: landLotSize.schema,
        },
        additionalLandValue: {
          title: 'Value of additional land',
          path: 'financial-information/additional-land-value',
          depends: formData =>
            formData?.homeAcreageMoreThanTwo === true &&
            formData?.claims?.survivorsPension === true,
          uiSchema: additionalLandValue.uiSchema,
          schema: additionalLandValue.schema,
        },
        marketableLand: {
          title: 'Marketable land',
          path: 'financial-information/marketable-land',
          depends: formData =>
            formData?.homeAcreageMoreThanTwo === true &&
            formData?.claims?.survivorsPension === true,
          uiSchema: marketableLand.uiSchema,
          schema: marketableLand.schema,
        },
        incomeSources: {
          title: 'Income sources',
          path: 'financial-information/income-sources',
          depends: formData => formData?.claims?.survivorsPension === true,
          uiSchema: incomeSources.uiSchema,
          schema: incomeSources.schema,
        },
        ...grossMonthlyIncomePages,
        ...careExpensesPages,
        ...medicalExpensesPages,
      },
    },
    // Chapter 7 - Additional Information
    additionalInformation: {
      title: 'Additional information',
      pages: {
        directDeposit: {
          title: 'Direct deposit for survivor benefits',
          path: 'additional-information/direct-deposit',
          uiSchema: directDeposit.uiSchema,
          schema: directDeposit.schema,
        },
        directDepositAccount: {
          title: 'Account information for direct deposit',
          path: 'additional-information/direct-deposit/account',
          depends: directDepositAccount.depends,
          uiSchema: directDepositAccount.uiSchema,
          schema: directDepositAccount.schema,
        },
        otherPaymentOptions: {
          title: 'Other payment options',
          path: 'additional-information/other-payment-options',
          depends: otherPaymentOptions.depends,
          uiSchema: otherPaymentOptions.uiSchema,
          schema: otherPaymentOptions.schema,
        },
        supportingDocuments: {
          title: 'Supporting documents',
          path: 'additional-information/supporting-documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        uploadDocuments: {
          title: 'Upload documents',
          path: 'additional-information/upload-documents',
          uiSchema: uploadDocuments.uiSchema,
          schema: uploadDocuments.schema,
        },
        // TODO: Will be added after mvp release
        // reviewDocuments: {
        //   title: 'Review supporting documents',
        //   path: 'additional-information/review-documents',
        //   uiSchema: reviewDocuments.uiSchema,
        //   schema: reviewDocuments.schema,
        // },
      },
    },
  },
};

export default formConfig;
