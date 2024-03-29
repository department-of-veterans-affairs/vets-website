import get from 'platform/utilities/data/get';
import moment from 'moment';

import { externalServices } from 'platform/monitoring/DowntimeNotification';
import FormFooter from 'platform/forms/components/FormFooter';
import GetFormHelp from 'applications/vre/components/GetFormHelp';
import { VA_FORM_IDS } from 'platform/forms/constants';

import ArrayCountWidget from 'platform/forms-system/src/js/widgets/ArrayCountWidget';

import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  getDependentChildTitle,
  getMarriageTitleWithCurrent,
  isMarried,
  submit,
  isHomeAcreageMoreThanTwo,
} from '../helpers';
import HomeAcreageValueInput from '../components/HomeAcreageValueInput';
import HomeAcreageValueReview from '../components/HomeAcreageValueReview';
import ServicePeriodReview from '../components/ServicePeriodReview';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import ErrorText from '../components/ErrorText';
import createHouseholdMemberTitle from '../components/DisclosureTitle';

// chapter-pages
import age from './chapters/03-health-and-employment-information/age';
import applicantInformation from './chapters/01-applicant-information/applicantInformation';
import careExpenses from './chapters/05-financial-information/careExpenses';
import contactInformation from './chapters/01-applicant-information/contactInformation';
import currentEmployment from './chapters/03-health-and-employment-information/currentEmployment';
import marriageHistory from './chapters/04-household-information/marriageHistory';
import currentSpouseAddress from './chapters/04-household-information/currentSpouseAddress';
import currentSpouseFormerMarriages from './chapters/04-household-information/currentSpouseFormerMarriages';
import currentSpouseMaritalHistory from './chapters/04-household-information/currentSpouseMaritalHistory';
import currentSpouseMonthlySupport from './chapters/04-household-information/currentSpouseMonthlySupport';
import dependentChildInformation from './chapters/04-household-information/dependentChildInformation';
import dependentChildAddress from './chapters/04-household-information/dependentChildAddress';
import hasDependents from './chapters/04-household-information/hasDependents';
import dependentChildren from './chapters/04-household-information/dependentChildren';
import documentUpload from './chapters/06-additional-information/documentUpload';
import fasterClaimProcessing from './chapters/06-additional-information/fasterClaimProcessing';
import federalTreatmentHistory from './chapters/03-health-and-employment-information/federalTreatmentHistory';
import generalHistory from './chapters/02-military-history/generalHistory';
import previousNames from './chapters/02-military-history/previousNames';
import generateEmployersSchemas from './chapters/03-health-and-employment-information/employmentHistory';
import generateMedicalCentersSchemas from './chapters/03-health-and-employment-information/medicalCenters';
import hasCareExpenses from './chapters/05-financial-information/hasCareExpenses';
import homeAcreageMoreThanTwo from './chapters/05-financial-information/homeAcreageMoreThanTwo';
import homeOwnership from './chapters/05-financial-information/homeOwnership';
import incomeSources from './chapters/05-financial-information/incomeSources';
import mailingAddress from './chapters/01-applicant-information/mailingAddress';
import maritalStatus from './chapters/04-household-information/maritalStatus';
import medicaidCoverage from './chapters/03-health-and-employment-information/medicaidCoverage';
import medicaidStatus from './chapters/03-health-and-employment-information/medicaidStatus';
import medicalCondition from './chapters/03-health-and-employment-information/medicalCondition';
import hasMedicalExpenses from './chapters/05-financial-information/hasMedicalExpenses';
import medicalExpenses from './chapters/05-financial-information/medicalExpenses';
import netWorthEstimation from './chapters/05-financial-information/netWorthEstimation';
import nursingHome from './chapters/03-health-and-employment-information/nursingHome';
import pow from './chapters/02-military-history/pow';
import reasonForCurrentSeparation from './chapters/04-household-information/reasonForCurrentSeparation';
import receivesIncome from './chapters/05-financial-information/receivesIncome';
import servicePeriod from './chapters/02-military-history/servicePeriod';
import socialSecurityDisability from './chapters/03-health-and-employment-information/socialSecurityDisability';
import specialMonthlyPension from './chapters/03-health-and-employment-information/specialMonthlyPension';
import spouseInfo from './chapters/04-household-information/spouseInfo';
import supportingDocuments from './chapters/06-additional-information/supportingDocuments';
import totalNetWorth from './chapters/05-financial-information/totalNetWorth';
import transferredAssets from './chapters/05-financial-information/transferredAssets';
import vaTreatmentHistory from './chapters/03-health-and-employment-information/vaTreatmentHistory';
import landMarketable from './chapters/05-financial-information/landMarketable';
import {
  usingDirectDeposit,
  directDeposit,
  accountInformation,
  otherPaymentOptions,
} from './chapters/06-additional-information';

import migrations from '../migrations';

import manifest from '../manifest.json';

import { marriages, defaultDefinitions } from './definitions';

const vaMedicalCenters = generateMedicalCentersSchemas(
  'vaMedicalCenters',
  'VA medical centers',
  'Enter all VA medical centers where you have received treatment',
  'VA medical center',
  'VA medical centers',
);

const federalMedicalCenters = generateMedicalCentersSchemas(
  'federalMedicalCenters',
  'Federal medical facilities',
  'Enter all federal medical facilities where you have received treatment within the last year',
  'Federal medical center',
  'Federal medical centers',
);

const currentEmployers = generateEmployersSchemas(
  'currentEmployers',
  'Current employment',
  'Enter all your current jobs',
  'What kind of work do you currently do?',
  'How many hours per week do you work on average?',
  'Job title',
  'Current employers',
);

const previousEmployers = generateEmployersSchemas(
  'previousEmployers',
  'Previous employment',
  'Enter all the previous jobs you held the last time you worked',
  'What kind of work did you do?',
  'How many hours per week did you work on average?',
  'What was your job title?',
  'Previous employers',
  4,
  true,
);

export function isUnder65(formData, currentDate) {
  const today = currentDate || moment();
  return (
    today
      .startOf('day')
      .subtract(65, 'years')
      .isBefore(formData.veteranDateOfBirth) || !formData.isOver65
  );
}

export function showSpouseAddress(formData) {
  return (
    isMarried(formData) &&
    (formData.maritalStatus === 'SEPARATED' ||
      get(['view:liveWithSpouse'], formData) === false)
  );
}

export function isSeparated(formData) {
  return formData.maritalStatus === 'SEPARATED';
}

export function currentSpouseHasFormerMarriages(formData) {
  return isMarried(formData) && formData.currentSpouseMaritalHistory === 'YES';
}

export function hasNoSocialSecurityDisability(formData) {
  return formData.socialSecurityDisability === false;
}

export function isInNursingHome(formData) {
  return formData.nursingHome === true;
}

export function medicaidDoesNotCoverNursingHome(formData) {
  return formData.nursingHome === true && formData.medicaidCoverage === false;
}

export function ownsHome(formData) {
  return formData.homeOwnership === true;
}

export function hasVaTreatmentHistory(formData) {
  return formData.vaTreatmentHistory === true;
}

export function hasFederalTreatmentHistory(formData) {
  return formData.federalTreatmentHistory === true;
}

export function isEmployedUnder65(formData) {
  return formData.currentEmployment === true && isUnder65(formData);
}

export function isUnemployedUnder65(formData) {
  return formData.currentEmployment === false && isUnder65(formData);
}

export function doesHavePreviousNames(formData) {
  return formData.serveUnderOtherNames === true;
}

export function doesReceiveIncome(formData) {
  return formData.receivesIncome === true;
}

export function doesHaveCareExpenses(formData) {
  return formData.hasCareExpenses === true;
}

export function doesHaveMedicalExpenses(formData) {
  return formData.hasMedicalExpenses === true;
}

export function isCurrentMarriage(formData, index) {
  const numMarriages =
    formData && formData.marriages ? formData.marriages.length : 0;
  return isMarried(formData) && numMarriages - 1 === index;
}

export function doesHaveDependents(formData) {
  return get(['view:hasDependents'], formData) === true;
}

export function dependentIsOutsideHousehold(formData, index) {
  // if 'view:hasDependents' is false,
  // all checks requiring dependents must be false
  return (
    doesHaveDependents(formData) &&
    !get(['dependents', index, 'childInHousehold'], formData)
  );
}

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'pensions-527EZ-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: VA_FORM_IDS.FORM_21P_527EZ,
  saveInProgress: {
    messages: {
      inProgress: 'Your Veterans pension benefits is in progress.',
      expired:
        'Your saved Veterans pension benefits has expired. If you want to apply for Veterans pension benefits application (21-527EZ), please start a new application.',
      saved: 'Your Veterans pension benefits application has been saved.',
    },
  },
  version: 7,
  migrations,
  prefillEnabled: true,
  // verifyRequiredPrefill: true,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  // beforeLoad: props => { console.log('form config before load', props); },
  // onFormLoaded: ({ formData, savedForms, returnUrl, formConfig, router }) => {
  //   console.log('form loaded', formData, savedForms, returnUrl, formConfig, router);
  // },
  savedFormMessages: {
    notFound: 'Please start over to apply for pension benefits.',
    noAuth:
      'Please sign in again to resume your application for pension benefits.',
  },
  title: 'Apply for Veterans Pension benefits',
  subTitle: 'VA Form 21P-527EZ',
  preSubmitInfo: {
    statementOfTruth: {
      body:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      messageAriaDescribedby:
        'I confirm that the identifying information in this form is accurate and has been represented correctly.',
      fullNamePath: 'veteranFullName',
    },
  },
  // showReviewErrors: true,
  // when true, initial focus on page to H3s by default, and enable page
  // scrollAndFocusTarget (selector string or function to scroll & focus)
  useCustomScrollAndFocus: false,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions,
  chapters: {
    applicantInformation: {
      title: 'Applicant information',
      pages: {
        applicantInformation: {
          path: 'applicant/information',
          title: 'Applicant information',
          uiSchema: applicantInformation.uiSchema,
          schema: applicantInformation.schema,
          updateFormData: applicantInformation.updateFormData,
        },
        mailingAddress: {
          title: 'Mailing address',
          path: 'applicant/mail-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Contact information',
          path: 'applicant/contact',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        servicePeriod: {
          path: 'military/history',
          title: 'Service period',
          uiSchema: servicePeriod.uiSchema,
          schema: servicePeriod.schema,
          CustomPageReview: ServicePeriodReview,
        },
        general: {
          path: 'military/general',
          title: 'General history',
          uiSchema: generalHistory.uiSchema,
          schema: generalHistory.schema,
        },
        previousNames: {
          path: 'military/general/add',
          title: 'Previous names',
          depends: doesHavePreviousNames,
          uiSchema: previousNames.uiSchema,
          schema: previousNames.schema,
        },
        pow: {
          path: 'military/pow',
          title: 'POW status',
          uiSchema: pow.uiSchema,
          schema: pow.schema,
        },
      },
    },
    healthAndEmploymentInformation: {
      title: 'Health and employment information',
      pages: {
        age: {
          title: 'Age',
          path: 'medical/history/age',
          uiSchema: age.uiSchema,
          schema: age.schema,
        },
        socialSecurityDisability: {
          title: 'Social Security disability',
          path: 'medical/history/social-security-disability',
          depends: formData => !formData.isOver65,
          uiSchema: socialSecurityDisability.uiSchema,
          schema: socialSecurityDisability.schema,
        },
        medicalCondition: {
          title: 'Medical condition',
          path: 'medical/history/condition',
          depends: hasNoSocialSecurityDisability,
          uiSchema: medicalCondition.uiSchema,
          schema: medicalCondition.schema,
        },
        nursingHome: {
          title: 'Nursing home information',
          path: 'medical/history/nursing-home',
          uiSchema: nursingHome.uiSchema,
          schema: nursingHome.schema,
        },
        medicaidCoverage: {
          title: 'Medicaid coverage',
          path: 'medical/history/nursing/medicaid',
          depends: isInNursingHome,
          uiSchema: medicaidCoverage.uiSchema,
          schema: medicaidCoverage.schema,
        },
        medicaidStatus: {
          title: 'Medicaid application status',
          path: 'medical/history/nursing/medicaid/status',
          depends: medicaidDoesNotCoverNursingHome,
          uiSchema: medicaidStatus.uiSchema,
          schema: medicaidStatus.schema,
        },
        specialMonthlyPension: {
          title: 'Special monthly pension',
          path: 'medical/history/monthly-pension',
          uiSchema: specialMonthlyPension.uiSchema,
          schema: specialMonthlyPension.schema,
          pageClass: 'special-monthly-pension-question',
        },
        vaTreatmentHistory: {
          title: 'Treatment from a VA medical center',
          path: 'medical/history/va-treatment',
          uiSchema: vaTreatmentHistory.uiSchema,
          schema: vaTreatmentHistory.schema,
        },
        vaMedicalCenters: {
          title: 'VA medical centers',
          path: 'medical/history/va-treatment/medical-centers',
          depends: hasVaTreatmentHistory,
          uiSchema: vaMedicalCenters.uiSchema,
          schema: vaMedicalCenters.schema,
        },
        federalTreatmentHistory: {
          title: 'Treatment from federal medical facilities',
          path: 'medical/history/federal-treatment',
          uiSchema: federalTreatmentHistory.uiSchema,
          schema: federalTreatmentHistory.schema,
        },
        federalMedicalCenters: {
          title: 'Federal medical facilities',
          path: 'medical/history/federal-treatment/medical-centers',
          depends: hasFederalTreatmentHistory,
          uiSchema: federalMedicalCenters.uiSchema,
          schema: federalMedicalCenters.schema,
        },
        currentEmployment: {
          title: 'Current employment',
          path: 'employment/current',
          depends: isUnder65,
          uiSchema: currentEmployment.uiSchema,
          schema: currentEmployment.schema,
        },
        currentEmploymentHistory: {
          title: 'Current employment',
          path: 'employment/current/history',
          depends: isEmployedUnder65,
          uiSchema: currentEmployers.uiSchema,
          schema: currentEmployers.schema,
        },
        previousEmploymentHistory: {
          title: 'Previous employment',
          path: 'employment/previous/history',
          depends: isUnemployedUnder65,
          uiSchema: previousEmployers.uiSchema,
          schema: previousEmployers.schema,
        },
      },
    },
    householdInformation: {
      title: 'Household information',
      pages: {
        maritalStatus: {
          title: 'Marital status',
          path: 'household/marital-status',
          uiSchema: maritalStatus.uiSchema,
          schema: maritalStatus.schema,
        },
        marriageInfo: {
          title: 'Marriage history',
          path: 'household/marriage-info',
          depends: isMarried,
          uiSchema: {
            marriages: {
              ...titleUI('How many times have you been married?'),
              'ui:widget': ArrayCountWidget,
              'ui:field': 'StringField',
              'ui:options': {
                showFieldLabel: 'label',
                keepInPageOnReview: true,
                useDlWrap: true,
              },
              'ui:errorMessages': {
                required: 'You must enter at least 1 marriage',
              },
            },
          },
          schema: {
            type: 'object',
            required: ['marriages'],
            properties: {
              marriages,
            },
          },
        },
        marriageHistory: {
          title: (form, { pagePerItemIndex } = { pagePerItemIndex: 0 }) =>
            getMarriageTitleWithCurrent(form, pagePerItemIndex),
          path: 'household/marriages/:index',
          depends: isMarried,
          showPagePerItem: true,
          arrayPath: 'marriages',
          uiSchema: marriageHistory.uiSchema,
          schema: marriageHistory.schema,
        },
        spouseInfo: {
          title: 'Spouse information',
          path: 'household/spouse-info',
          depends: isMarried,
          uiSchema: spouseInfo.uiSchema,
          schema: spouseInfo.schema,
        },
        reasonForCurrentSeparation: {
          title: 'Reason for separation',
          path: 'household/marital-status/separated',
          depends: isSeparated,
          uiSchema: reasonForCurrentSeparation.uiSchema,
          schema: reasonForCurrentSeparation.schema,
        },
        currentSpouseAddress: {
          title: 'Spouse address',
          path: 'household/marital-status/separated/spouse-address',
          depends: showSpouseAddress,
          uiSchema: currentSpouseAddress.uiSchema,
          schema: currentSpouseAddress.schema,
        },
        currentSpouseMonthlySupport: {
          title: 'Financial support for your spouse',
          path: 'household/marital-status/separated/spouse-monthly-support',
          depends: isSeparated,
          uiSchema: currentSpouseMonthlySupport.uiSchema,
          schema: currentSpouseMonthlySupport.schema,
        },
        currentSpouseMaritalHistory: {
          title: 'Current spouse marital history',
          path: 'household/marital-status/spouse-marital-history',
          depends: isMarried,
          uiSchema: currentSpouseMaritalHistory.uiSchema,
          schema: currentSpouseMaritalHistory.schema,
        },
        spouseMarriageHistory: {
          title: 'Spouse’s former marriages',
          path: 'household/marital-status/spouse-marriages',
          depends: currentSpouseHasFormerMarriages,
          uiSchema: currentSpouseFormerMarriages.uiSchema,
          schema: currentSpouseFormerMarriages.schema,
        },
        hasDependents: {
          title: 'Dependents',
          path: 'household/dependents',
          uiSchema: hasDependents.uiSchema,
          schema: hasDependents.schema,
        },
        dependents: {
          title: 'Dependent children',
          path: 'household/dependents/add',
          depends: doesHaveDependents,
          uiSchema: dependentChildren.uiSchema,
          schema: dependentChildren.schema,
        },
        dependentChildInformation: {
          path: 'household/dependents/children/information/:index',
          title: item => getDependentChildTitle(item, 'information'),
          depends: doesHaveDependents,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: dependentChildInformation.schema,
          uiSchema: dependentChildInformation.uiSchema,
        },
        dependentChildInHousehold: {
          path: 'household/dependents/children/inhousehold/:index',
          title: item => getDependentChildTitle(item, 'household'),
          depends: doesHaveDependents,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: {
            type: 'object',
            properties: {
              dependents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['childInHousehold'],
                  properties: {
                    childInHousehold: yesNoSchema,
                  },
                },
              },
            },
          },
          uiSchema: {
            dependents: {
              items: {
                ...titleUI(createHouseholdMemberTitle('fullName', 'household')),
                childInHousehold: yesNoUI({
                  title: 'Does your child live with you?',
                }),
              },
            },
          },
        },
        dependentChildAddress: {
          path: 'household/dependents/children/address/:index',
          title: item => getDependentChildTitle(item, 'address'),
          depends: dependentIsOutsideHousehold,
          showPagePerItem: true,
          arrayPath: 'dependents',
          schema: dependentChildAddress.schema,
          uiSchema: dependentChildAddress.uiSchema,
        },
      },
    },
    financialInformation: {
      title: 'Financial information',
      pages: {
        totalNetWorth: {
          title: 'Total net worth',
          path: 'financial/total-net-worth',
          uiSchema: totalNetWorth.uiSchema,
          schema: totalNetWorth.schema,
        },
        netWorthEstimation: {
          title: 'Net worth estimation',
          path: 'financial/net-worth-estimation',
          depends: formData => formData.totalNetWorth === false,
          uiSchema: netWorthEstimation.uiSchema,
          schema: netWorthEstimation.schema,
        },
        transferredAssets: {
          title: 'Transferred assets',
          path: 'financial/transferred-assets',
          uiSchema: transferredAssets.uiSchema,
          schema: transferredAssets.schema,
        },
        homeOwnership: {
          title: 'Home ownership',
          path: 'financial/home-ownership',
          uiSchema: homeOwnership.uiSchema,
          schema: homeOwnership.schema,
        },
        homeAcreageMoreThanTwo: {
          title: 'Home acreage size',
          path: 'financial/home-ownership/acres',
          depends: ownsHome,
          uiSchema: homeAcreageMoreThanTwo.uiSchema,
          schema: homeAcreageMoreThanTwo.schema,
        },
        homeAcreageValue: {
          title: 'Home acreage value',
          path: 'financial/home-ownership/acres/value',
          depends: isHomeAcreageMoreThanTwo,
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {
              homeAcreageValue: {
                type: 'number',
              },
            },
          },
          CustomPage: HomeAcreageValueInput,
          CustomPageReview: HomeAcreageValueReview,
        },
        landMarketable: {
          title: 'Land marketable',
          path: 'financial/land-marketable',
          depends: isHomeAcreageMoreThanTwo,
          uiSchema: landMarketable.uiSchema,
          schema: landMarketable.schema,
        },
        receivesIncome: {
          title: 'Receives income',
          path: 'financial/receives-income',
          uiSchema: receivesIncome.uiSchema,
          schema: receivesIncome.schema,
        },
        incomeSources: {
          title: 'Gross monthly income',
          path: 'financial/income-sources',
          depends: doesReceiveIncome,
          uiSchema: incomeSources.uiSchema,
          schema: incomeSources.schema,
        },
        hasCareExpenses: {
          path: 'financial/care-expenses',
          title: 'Care expenses',
          uiSchema: hasCareExpenses.uiSchema,
          schema: hasCareExpenses.schema,
        },
        careExpenses: {
          path: 'financial/care-expenses/add',
          title: 'Unreimbursed care expenses',
          depends: doesHaveCareExpenses,
          uiSchema: careExpenses.uiSchema,
          schema: careExpenses.schema,
        },
        hasMedicalExpenses: {
          path: 'financial/medical-expenses',
          title: 'Medical expenses and other unreimbursed expenses',
          uiSchema: hasMedicalExpenses.uiSchema,
          schema: hasMedicalExpenses.schema,
        },
        medicalExpenses: {
          path: 'financial/medical-expenses/add',
          title: 'Medical expenses and other unreimbursed expenses',
          depends: doesHaveMedicalExpenses,
          uiSchema: medicalExpenses.uiSchema,
          schema: medicalExpenses.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        directDeposit: {
          title: 'Direct deposit for Veterans Pension benefits',
          path: 'additional-information/direct-deposit',
          initialData: {},
          ...directDeposit,
        },
        accountInformation: {
          title: 'Account information for direct deposit',
          path: 'additional-information/account-information',
          initialData: {},
          depends: usingDirectDeposit,
          ...accountInformation,
        },
        otherPaymentOptions: {
          title: 'Other payment options',
          path: 'additional-information/other-payment-options',
          initialData: {},
          depends: formData => !usingDirectDeposit(formData),
          ...otherPaymentOptions,
        },
        aidAttendance: {
          title: 'Supporting documents',
          path: 'additional-information/supporting-documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        documentUpload: {
          title: 'Document upload',
          path: 'additional-information/document-upload',
          uiSchema: documentUpload.uiSchema,
          schema: documentUpload.schema,
        },
        expedited: {
          title: 'Faster claim processing',
          path: 'additional-information/faster-claim-processing',
          uiSchema: fasterClaimProcessing.uiSchema,
          schema: fasterClaimProcessing.schema,
        },
      },
    },
  },
};

export default formConfig;
