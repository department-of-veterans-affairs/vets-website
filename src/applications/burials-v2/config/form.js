import get from '@department-of-veterans-affairs/platform-forms-system/get';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import GetFormHelp from '@department-of-veterans-affairs/platform-forms/GetPensionOrBurialFormHelp';
import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import preSubmitInfo from '@department-of-veterans-affairs/platform-forms/preSubmitInfo';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

import ErrorText from '../components/ErrorText';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import personalInformation from './chapters/01-claimant-information/personalInformation';
import relationshipToVeteran from './chapters/01-claimant-information/relationshipToVeteran';
import mailingAddress from './chapters/01-claimant-information/mailingAddress';
import contactInformation from './chapters/01-claimant-information/contactInformation';

import veteranInformation from './chapters/02-veteran-information/veteranInformation';
import burialInformation from './chapters/02-veteran-information/burialInformation';
import locationOfDeath from './chapters/02-veteran-information/locationOfDeath';

import separationDocuments from './chapters/03-military-history/separationDocuments';
import uploadDD214 from './chapters/03-military-history/uploadDD214';
import servicePeriods from './chapters/03-military-history/servicePeriods';
import previousNamesQuestion from './chapters/03-military-history/previousNamesQuestion';
import previousNames from './chapters/03-military-history/previousNames';

import benefitsSelection from './chapters/04-benefits-selection/benefitsSelection';
import burialAllowancePartOne from './chapters/04-benefits-selection/burialAllowancePartOne';
import burialAllowancePartTwo from './chapters/04-benefits-selection/burialAllowancePartTwo';
import finalRestingPlace from './chapters/04-benefits-selection/finalRestingPlace';
import nationalOrFederalCemetery from './chapters/04-benefits-selection/nationalOrFederalCemetery';
import cemeteryLocationQuestion from './chapters/04-benefits-selection/cemeteryLocationQuestion';
import cemeteryLocation from './chapters/04-benefits-selection/cemeteryLocation';
import tribalLandLocation from './chapters/04-benefits-selection/tribalLandLocation';
import plotAllowancePartOne from './chapters/04-benefits-selection/plotAllowancePartOne';
import plotAllowancePartTwo from './chapters/04-benefits-selection/plotAllowancePartTwo';
import transportationExpenses from './chapters/04-benefits-selection/transportationExpenses';

import deathCertificate from './chapters/05-additional-information/deathCertificate';
import transportationReceipts from './chapters/05-additional-information/transportationReceipts';

import { submit } from '../utils/helpers';
import manifest from '../manifest.json';

const {
  fullName,
  centralMailVaFile,
  ssn,
  date,
  usaPhone,
  dateRange,
} = fullSchemaBurials.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'burials-530-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: VA_FORM_IDS.FORM_21P_530V2,
  saveInProgress: {
    messages: {
      inProgress: 'Your burial benefits application (21-530) is in progress.',
      expired:
        'Your saved burial benefits application (21-530) has expired. If you want to apply for burial benefits, please start a new application.',
      saved: 'Your burial benefits application has been saved.',
    },
  },
  version: 1,
  migrations: [],
  prefillEnabled: true,
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  savedFormMessages: {
    notFound: 'Please start over to apply for burial benefits.',
    noAuth:
      'Please sign in again to resume your application for burial benefits.',
  },
  title: 'Apply for burial benefits',
  subTitle: 'Form 21P-530',
  preSubmitInfo,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    fullName,
    centralMailVaFile,
    ssn,
    date,
    usaPhone,
    dateRange,
  },
  chapters: {
    claimantInformation: {
      title: 'Your Information',
      pages: {
        relationshipToVeteran: {
          title: 'Your information',
          path: 'claimant-information/relationship-to-veteran',
          uiSchema: relationshipToVeteran.uiSchema,
          schema: relationshipToVeteran.schema,
        },
        personalInformation: {
          title: 'Your information',
          path: 'claimant-information/personal-information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        mailingAddress: {
          title: 'Your information',
          path: 'claimant-information/mailing-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Your information',
          path: 'claimant-information/contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
      },
    },
    veteranInformation: {
      title: 'Deceased Veteran information',
      pages: {
        veteranInformation: {
          title: 'Deceased Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        burialInformation: {
          title: 'Burial dates',
          path: 'veteran-information/burial',
          uiSchema: burialInformation.uiSchema,
          schema: burialInformation.schema,
        },
        locationOfDeath: {
          title: 'Veteran death location',
          path: 'veteran-information/location-of-death',
          uiSchema: locationOfDeath.uiSchema,
          schema: locationOfDeath.schema,
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        separationDocuments: {
          title: 'Separation Documents',
          path: 'military-history/separation-documents',
          uiSchema: separationDocuments.uiSchema,
          schema: separationDocuments.schema,
        },
        uploadDD214: {
          title: 'Separation Documents',
          path: 'military-history/separation-documents/upload',
          depends: form => get('view:separationDocuments', form),
          uiSchema: uploadDD214.uiSchema,
          schema: uploadDD214.schema,
        },
        servicePeriods: {
          title: 'Service periods',
          path: 'military-history/service-periods',
          depends: form => !get('view:separationDocuments', form),
          uiSchema: servicePeriods.uiSchema,
          schema: servicePeriods.schema,
        },
        previousNamesQuestion: {
          title: 'Previous names',
          path: 'military-history/previous-names',
          uiSchema: previousNamesQuestion.uiSchema,
          schema: previousNamesQuestion.schema,
        },
        previousNames: {
          title: 'Previous names',
          path: 'military-history/previous-names/add',
          depends: form => get('view:servedUnderOtherNames', form),
          uiSchema: previousNames.uiSchema,
          schema: previousNames.schema,
        },
      },
    },
    benefitsSelection: {
      title: 'Benefits selection',
      pages: {
        benefitsSelection: {
          title: 'Benefits selection',
          path: 'benefits/selection',
          uiSchema: benefitsSelection.uiSchema,
          schema: benefitsSelection.schema,
        },
        burialAllowancePartOne: {
          title: 'Burial allowance',
          path: 'benefits/burial-allowance/additional-information',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: burialAllowancePartOne.uiSchema,
          schema: burialAllowancePartOne.schema,
        },
        burialAllowancePartTwo: {
          title: 'Burial allowance',
          path: 'benefits/burial-allowance/allowance-and-expense',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: burialAllowancePartTwo.uiSchema,
          schema: burialAllowancePartTwo.schema,
        },
        finalRestingPlace: {
          title: 'Final resting place',
          path: 'benefits/final-resting-place',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: finalRestingPlace.uiSchema,
          schema: finalRestingPlace.schema,
        },
        nationalOrFederalCemetery: {
          title: 'Cemetery location',
          path: 'benefits/cemetery-type',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: nationalOrFederalCemetery.uiSchema,
          schema: nationalOrFederalCemetery.schema,
        },
        cemeteryLocationQuestion: {
          title: 'Cemetery location',
          path: 'benefits/cemetery-location',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: cemeteryLocationQuestion.uiSchema,
          schema: cemeteryLocationQuestion.schema,
        },
        cemeteryLocation: {
          title: 'Cemetery location',
          path: 'benefits/cemetery-location/add',
          depends: form =>
            get('view:claimedBenefits.burialAllowance', form) &&
            get('cemetaryLocationQuestion', form) === 'cemetery',
          uiSchema: cemeteryLocation.uiSchema,
          schema: cemeteryLocation.schema,
        },
        tribalLandLocation: {
          title: 'Cemetery location',
          path: 'benefits/cemetery-location/tribal-land/add',
          depends: form =>
            get('view:claimedBenefits.burialAllowance', form) &&
            get('cemetaryLocationQuestion', form) === 'tribalLand',
          uiSchema: tribalLandLocation.uiSchema,
          schema: tribalLandLocation.schema,
        },
        plotAllowancePartOne: {
          title: 'Plot or interment allowance',
          path: 'benefits/plot-allowance/contributions',
          depends: form => get('view:claimedBenefits.plotAllowance', form),
          uiSchema: plotAllowancePartOne.uiSchema,
          schema: plotAllowancePartOne.schema,
        },
        plotAllowancePartTwo: {
          title: 'Plot or interment allowance',
          path: 'benefits/plot-allowance/expense-responsibility',
          depends: form => get('view:claimedBenefits.plotAllowance', form),
          uiSchema: plotAllowancePartTwo.uiSchema,
          schema: plotAllowancePartTwo.schema,
        },
        transportationExpenses: {
          title: 'Transportation allowance',
          path: 'benefits/transportation-allowance',
          depends: form => get('view:claimedBenefits.transportation', form),
          uiSchema: transportationExpenses.uiSchema,
          schema: transportationExpenses.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        deathCertificate: {
          title: 'Death certificate',
          path: 'additional-information/death-certificate',
          uiSchema: deathCertificate.uiSchema,
          schema: deathCertificate.schema,
        },
        transportationReceipts: {
          title: 'Transportation Receipts',
          path: 'additional-information/transportation-receipts',
          depends: form => get('transportationExpenses', form),
          uiSchema: transportationReceipts.uiSchema,
          schema: transportationReceipts.schema,
        },
      },
    },
  },
};

export default formConfig;
