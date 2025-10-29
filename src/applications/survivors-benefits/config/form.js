import { externalServices } from 'platform/monitoring/DowntimeNotification';
import environment from 'platform/utilities/environment';
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { TITLE, SUBTITLE } from '../utils/constants';
import manifest from '../manifest.json';
import IntroductionPage from '../containers/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import FormSavedPage from '../containers/FormSavedPage';
import { submit } from './submit';
import { defaultDefinitions } from './definitions';
import GetFormHelp from '../components/GetFormHelp';
import ErrorText from '../components/ErrorText';

import {
  vetIdentification,
  vetIdentificationAdditional,
} from './chapters/01-veteran-information/veteranInformation';
import veteranName from './chapters/01-veteran-information/veteranName';
import claimantInformationPage from './chapters/02-claimant-information/claimantInformation';
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
import legalStatusOfMarriage from './chapters/04-household-information/legalStatusOfMarriage';
import marriageStatus from './chapters/04-household-information/marriageStatus';
import reasonForSeparation from './chapters/04-household-information/reasonForSeparation';
import separationDetails from './chapters/04-household-information/separationDetails';
import dicBenefits from './chapters/05-claim-information/dicBenefits';
import nursingHome from './chapters/05-claim-information/nursingHome';
import { treatmentPages } from './chapters/05-claim-information/treatmentPages';
import directDeposit from './chapters/07-additional-information/directDeposit';
import directDepositAccount from './chapters/07-additional-information/directDepositAccount';
import otherPaymentOptions from './chapters/07-additional-information/otherPaymentOptions';
import supportingDocuments from './chapters/07-additional-information/supportingDocuments';
import uploadDocuments from './chapters/07-additional-information/uploadDocuments';
import reviewDocuments from './chapters/07-additional-information/reviewDocuments';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: '/v0/api',
  submit,
  trackingPrefix: 'survivors-534ez',
  v3SegmentedProgressBar: true,
  prefillEnabled: true,
  dev: {
    disableWindowUnloadInCI: true,
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/supporting-forms-for-claims/apply-form-21p-534ez',
        label: 'Survivors benefits',
      },
    ],
  }),
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
      fullNamePath: 'veteranFullName',
    },
  },
  title: TITLE,
  subTitle: SUBTITLE,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  showReviewErrors: !environment.isProduction() && !environment.isStaging(),
  chapters: {
    // Chapter 1 - Veteran Information
    veteranInformation: {
      title: "Veteran's information",
      pages: {
        veteranName,
        vetIdentification: {
          title: "Veteran's identification information",
          path: 'veteran/identification',
          uiSchema: vetIdentification.uiSchema,
          schema: vetIdentification.schema,
        },
        vetIdentificationAdditional: {
          title: 'Additional veteran information',
          path: 'veteran/identification-additional',
          uiSchema: vetIdentificationAdditional.uiSchema,
          schema: vetIdentificationAdditional.schema,
        },
      },
    },
    // Chapter 2 - Claimant Information
    claimantInformation: {
      title: "Claimant's information",
      pages: {
        claimantInformation: {
          path: 'claimant/information',
          title: 'Claimant information',
          uiSchema: claimantInformationPage.uiSchema,
          schema: claimantInformationPage.schema,
        },
        mailingAddress: {
          path: 'claimant/mailing-address',
          title: 'Mailing address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          path: 'claimant/contact-information',
          title: 'Contact information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        benefitType: {
          path: 'claimant/benefit-type',
          title: 'Benefit type',
          uiSchema: benefitType.uiSchema,
          schema: benefitType.schema,
        },
      },
    },
    // Chapter 3 - Military History
    militaryHistory: {
      title: "Veteran's military history",
      pages: {
        militaryHistory: {
          path: 'veteran/va-benefits',
          title: 'VA benefits',
          uiSchema: vaBenefits.uiSchema,
          schema: vaBenefits.schema,
        },
        servicePeriod: {
          path: 'veteran/service-period',
          title: 'Veteran information',
          depends: formData => formData.receivedBenefits === false,
          uiSchema: servicePeriod.uiSchema,
          schema: servicePeriod.schema,
        },
        nationalGuardService: {
          path: 'veteran/national-guard-service',
          title: 'National Guard service',
          depends: formData => formData.receivedBenefits === false,
          uiSchema: nationalGuardService.uiSchema,
          schema: nationalGuardService.schema,
        },
        nationalGuardServicePeriod: {
          path: 'veteran/national-guard-service-period',
          title: 'National Guard service period',
          depends: formData => formData.nationalGuardActivated === true,
          uiSchema: nationalGuardServicePeriod.uiSchema,
          schema: nationalGuardServicePeriod.schema,
        },
        nationalGuardUnitAddress: {
          path: 'veteran/national-guard-unit-address',
          title: 'National Guard unit address',
          depends: formData => formData.nationalGuardActivated === true,
          uiSchema: nationalGuardUnitAddress.uiSchema,
          schema: nationalGuardUnitAddress.schema,
        },
        ...otherServiceNamesPages,
        prisonerOfWar: {
          path: 'veteran/prisoner-of-war',
          title: 'Prisoner of war',
          depends: formData => formData.receivedBenefits === false,
          uiSchema: prisonerOfWarPage.uiSchema,
          schema: prisonerOfWarPage.schema,
        },
        powPeriodOfTime: {
          path: 'veteran/prisoner-of-war-period',
          title: 'Prisoner of war period',
          depends: formData => formData?.prisonerOfWar === true,
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
          depends: formData => formData.claimantRelationship === 'SPOUSE',
          uiSchema: marriageToVeteran.uiSchema,
          schema: marriageToVeteran.schema,
        },
        legalStatusOfMarriage: {
          path: 'household/legal-status-of-marriage',
          title: 'Legal status of marriage',
          depends: formData => formData.claimantRelationship === 'SPOUSE',
          uiSchema: legalStatusOfMarriage.uiSchema,
          schema: legalStatusOfMarriage.schema,
        },
        marriageStatus: {
          path: 'household/marriage-status',
          title: 'Marriage status',
          depends: formData => formData.claimantRelationship === 'SPOUSE',
          uiSchema: marriageStatus.uiSchema,
          schema: marriageStatus.schema,
        },
        reasonForSeparation: {
          path: 'household/reason-for-separation',
          title: 'Reason for separation',
          depends: formData =>
            formData.claimantRelationship === 'SPOUSE' &&
            formData.livedContinuouslyWithVeteran === false,
          uiSchema: reasonForSeparation.uiSchema,
          schema: reasonForSeparation.schema,
        },
        separationDetails: {
          path: 'household/separation-details',
          title: 'Separation details',
          depends: formData =>
            formData.claimantRelationship === 'SPOUSE' &&
            (formData.separationReason === 'RELATIONSHIP_DIFFERENCES' ||
              formData.separationReason === 'OTHER'),
          uiSchema: separationDetails.uiSchema,
          schema: separationDetails.schema,
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
        reviewDocuments: {
          title: 'Review supporting documents',
          path: 'additional-information/review-documents',
          uiSchema: reviewDocuments.uiSchema,
          schema: reviewDocuments.schema,
        },
      },
    },
  },
};

export default formConfig;
