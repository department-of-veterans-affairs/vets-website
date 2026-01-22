import React from 'react';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import GetFormHelp from '../components/GetFormHelp';

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
import homeHospiceCare from './chapters/02-veteran-information/homeHospiceCare';
import homeHospiceCareAfterDischarge from './chapters/02-veteran-information/homeHospiceCareAfterDischarge';

import separationDocuments from './chapters/03-military-history/separationDocuments';
import uploadDD214 from './chapters/03-military-history/uploadDD214';
import serviceNumber from './chapters/03-military-history/serviceNumber';
import servicePeriod from './chapters/03-military-history/servicePeriod';
import servicePeriods from './chapters/03-military-history/servicePeriods';
import previousNamesQuestion from './chapters/03-military-history/previousNamesQuestion';
import previousNames from './chapters/03-military-history/previousNames';
import { powPages } from './chapters/03-military-history/powPages';

import benefitsSelection from './chapters/04-benefits-selection/benefitsSelection';
import burialAllowancePartOne from './chapters/04-benefits-selection/burialAllowancePartOne';
import burialAllowanceConfirmation from './chapters/04-benefits-selection/burialAllowanceConfirmation';
import burialAllowancePartTwo from './chapters/04-benefits-selection/burialAllowancePartTwo';
import finalRestingPlace from './chapters/04-benefits-selection/finalRestingPlace';
import nationalOrFederalCemetery from './chapters/04-benefits-selection/nationalOrFederalCemetery';
import cemeteryLocationQuestion from './chapters/04-benefits-selection/cemeteryLocationQuestion';
import cemeteryLocation from './chapters/04-benefits-selection/cemeteryLocation';
import tribalLandLocation from './chapters/04-benefits-selection/tribalLandLocation';
import plotAllowancePartOne from './chapters/04-benefits-selection/plotAllowancePartOne';
import plotAllowancePartTwo from './chapters/04-benefits-selection/plotAllowancePartTwo';
import transportationExpenses from './chapters/04-benefits-selection/transportationExpenses';

import createDirectDepositPage from '../components/DirectDeposit';

import supportingDocuments from './chapters/05-additional-information/supportingDocuments';
import fasterClaimProcessing from './chapters/05-additional-information/fasterClaimProcessing';
import deathCertificate from './chapters/05-additional-information/deathCertificate';
import deathCertificateRequired from './chapters/05-additional-information/deathCertificateRequired';
import transportationReceipts from './chapters/05-additional-information/transportationReceipts';
import additionalEvidence from './chapters/05-additional-information/additionalEvidence';

import {
  pageAndReviewTitle,
  generateDeathFacilitySchemas,
  showDeathCertificateRequiredPage,
  showHomeHospiceCarePage,
  showHomeHospiceCareAfterDischargePage,
  showPdfFormAlignment,
} from '../utils/helpers';
import { submit } from './submit';
import manifest from '../manifest.json';
import migrations from '../migrations';

const {
  fullName,
  centralMailVaFile,
  ssn,
  date,
  usaPhone,
  dateRange,
  benefitsIntakeFullName,
} = fullSchemaBurials.definitions;

const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submit,
  trackingPrefix: 'burials-530-',
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  v3SegmentedProgressBar: true,
  formId: VA_FORM_IDS.FORM_21P_530EZ,
  formOptions: {
    useWebComponentForNavigation: true,
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your burial benefits application (21P-530EZ) is in progress.',
      expired:
        'Your saved burial benefits application (21P-530EZ) has expired. If you want to apply for a Veterans burial allowance and transportation benefits, please start a new application.',
      saved: 'Your burial benefits application has been saved.',
    },
  },
  version: 3,
  migrations,
  prefillEnabled: true,
  dev: {
    disableWindowUnloadInCI: true,
  },
  downtime: {
    dependencies: [externalServices.icmhs],
  },
  savedFormMessages: {
    notFound:
      'Please start over to apply for a Veterans burial allowance and transportation benefits.',
    noAuth:
      'Please sign in again to resume your application for burial benefits.',
  },
  title: 'Apply for a Veterans burial allowance and transportation benefits',
  subTitle: 'Application for Burial Benefits (VA Form 21P-530EZ)',
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
    benefitsIntakeFullName,
  },
  chapters: {
    claimantInformation: {
      title: 'Your Information',
      pages: {
        relationshipToVeteran: {
          title: 'Relationship to Veteran',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Relationship to Veteran
            </span>
          ),
          path: 'claimant-information/relationship-to-veteran',
          uiSchema: relationshipToVeteran.uiSchema,
          schema: relationshipToVeteran.schema,
        },
        personalInformation: {
          title: 'Personal information',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Personal Information</span>
          ),
          path: 'claimant-information/personal-information',
          uiSchema: personalInformation.uiSchema,
          schema: personalInformation.schema,
        },
        mailingAddress: {
          title: 'Mailing address',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Mailing address</span>
          ),
          path: 'claimant-information/mailing-address',
          uiSchema: mailingAddress.uiSchema,
          schema: mailingAddress.schema,
        },
        contactInformation: {
          title: 'Contact information',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Contact information</span>
          ),
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
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Deceased Veteran information
            </span>
          ),
          path: 'veteran-information',
          uiSchema: veteranInformation.uiSchema,
          schema: veteranInformation.schema,
        },
        burialInformation: {
          title: 'Burial dates',
          path: 'veteran-information/burial',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Burial dates</span>
          ),
          uiSchema: burialInformation.uiSchema,
          schema: burialInformation.schema,
        },
        locationOfDeath: {
          title: 'Veteran death location',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Veteran death location</span>
          ),
          path: 'veteran-information/location-of-death',
          uiSchema: locationOfDeath.uiSchema,
          schema: locationOfDeath.schema,
        },
        homeHospiceCare: {
          ...pageAndReviewTitle('Home hospice care'),
          path: 'veteran-information/location-of-death/home-hospice-care',
          depends: showHomeHospiceCarePage,
          uiSchema: homeHospiceCare.uiSchema,
          schema: homeHospiceCare.schema,
        },
        homeHospiceCareAfterDischarge: {
          ...pageAndReviewTitle('Home hospice care after discharge'),
          path:
            'veteran-information/location-of-death/hme-hospice-care-after-discharge',
          depends: showHomeHospiceCareAfterDischargePage,
          uiSchema: homeHospiceCareAfterDischarge.uiSchema,
          schema: homeHospiceCareAfterDischarge.schema,
        },
        nursingHomeUnpaid: {
          title: 'Veteran death location details',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Veteran death location details
            </span>
          ),
          path: 'veteran-information/location-of-death/nursing-home-unpaid',
          depends: form =>
            get('locationOfDeath.location', form) === 'nursingHomeUnpaid',
          ...generateDeathFacilitySchemas(
            'nursingHomeUnpaid',
            'nursing home or facility',
          ),
        },
        nursingHomePaid: {
          title: 'Veteran death location details',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Veteran death location details
            </span>
          ),
          path: 'veteran-information/location-of-death/nursing-home-paid',
          depends: form =>
            get('locationOfDeath.location', form) === 'nursingHomePaid',
          ...generateDeathFacilitySchemas(
            'nursingHomePaid',
            'nursing home or facility',
          ),
        },
        vaMedicalCenter: {
          title: 'Veteran death location details',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Veteran death location details
            </span>
          ),
          path: 'veteran-information/location-of-death/va-medical-center',
          depends: form =>
            get('locationOfDeath.location', form) === 'vaMedicalCenter',
          ...generateDeathFacilitySchemas(
            'vaMedicalCenter',
            'VA medical center',
          ),
        },
        stateVeteransHome: {
          title: 'Veteran death location details',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Veteran death location details
            </span>
          ),
          path: 'veteran-information/location-of-death/state-veterans-home',
          depends: form =>
            get('locationOfDeath.location', form) === 'stateVeteransHome',
          ...generateDeathFacilitySchemas(
            'stateVeteransHome',
            'state Veterans facility',
          ),
        },
      },
    },
    militaryHistory: {
      title: 'Military history',
      pages: {
        separationDocuments: {
          title: 'DD214 or other separation documents',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              DD214 or other separation documents
            </span>
          ),
          path: 'military-history/separation-documents',
          uiSchema: separationDocuments.uiSchema,
          schema: separationDocuments.schema,
        },
        uploadDD214: {
          title: 'Veteran’s DD214',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Veteran’s DD214</span>
          ),
          path: 'military-history/separation-documents/upload',
          depends: form => get('view:separationDocuments', form),
          uiSchema: uploadDD214.uiSchema,
          schema: uploadDD214.schema,
        },
        serviceNumber: {
          title: 'Service number',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Service number</span>
          ),
          path: 'military-history/service-number',
          depends: form => !get('view:separationDocuments', form),
          uiSchema: serviceNumber.uiSchema,
          schema: serviceNumber.schema,
        },
        servicePeriod: {
          title: 'Service period',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Service period</span>
          ),
          path: 'military-history/service-period',
          depends: form =>
            showPdfFormAlignment() && !get('view:separationDocuments', form),
          uiSchema: servicePeriod.uiSchema,
          schema: servicePeriod.schema,
        },
        servicePeriods: {
          title: 'Service periods',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Service periods</span>
          ),
          path: 'military-history/service-periods',
          depends: form =>
            !showPdfFormAlignment() && !get('view:separationDocuments', form),
          uiSchema: servicePeriods.uiSchema,
          schema: servicePeriods.schema,
        },
        previousNamesQuestion: {
          title: 'Veteran’s previous names',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Veteran’s previous names
            </span>
          ),
          path: 'military-history/previous-names',
          uiSchema: previousNamesQuestion.uiSchema,
          schema: previousNamesQuestion.schema,
        },
        previousNames: {
          title: 'Veteran’s previous names',
          reviewTitle: ' ',
          path: 'military-history/previous-names/add',
          depends: form => get('view:servedUnderOtherNames', form),
          uiSchema: previousNames.uiSchema,
          schema: previousNames.schema,
        },
        ...powPages,
      },
    },
    benefitsSelection: {
      title: 'Benefits selection',
      pages: {
        benefitsSelection: {
          title: 'Benefits selection',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Benefits selection</span>
          ),
          path: 'benefits/selection',
          uiSchema: benefitsSelection.uiSchema,
          schema: benefitsSelection.schema,
        },
        burialAllowancePartOne: {
          title: 'Burial allowance',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Burial allowance</span>
          ),
          path: 'benefits/burial-allowance/additional-information',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: burialAllowancePartOne.uiSchema,
          schema: burialAllowancePartOne.schema,
        },
        burialAllowanceConfirmation: {
          title: 'Burial allowance',
          reviewTitle: ' ',
          path: 'benefits/burial-allowance/statement-of-truth',
          depends: form => {
            const burialsSelected = get(
              'view:claimedBenefits.burialAllowance',
              form,
            );
            const unclaimedSelected = get(
              'burialAllowanceRequested.unclaimed',
              form,
            );
            return burialsSelected && unclaimedSelected;
          },
          uiSchema: burialAllowanceConfirmation.uiSchema,
          schema: burialAllowanceConfirmation.schema,
        },
        burialAllowancePartTwo: {
          title: 'Burial allowance',
          path: 'benefits/burial-allowance/allowance-and-expense',
          reviewTitle: ' ',
          depends: form => get('view:claimedBenefits.burialAllowance', form),
          uiSchema: burialAllowancePartTwo.uiSchema,
          schema: burialAllowancePartTwo.schema,
        },
        finalRestingPlace: {
          title: 'Final resting place',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Final resting place</span>
          ),
          path: 'benefits/final-resting-place',
          depends: form => get('view:claimedBenefits.plotAllowance', form),
          uiSchema: finalRestingPlace.uiSchema,
          schema: finalRestingPlace.schema,
        },
        nationalOrFederalCemetery: {
          title: 'Cemetery location',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Cemetery location</span>
          ),
          path: 'benefits/cemetery-type',
          depends: form => get('view:claimedBenefits.plotAllowance', form),
          uiSchema: nationalOrFederalCemetery.uiSchema,
          schema: nationalOrFederalCemetery.schema,
        },
        cemeteryLocationQuestion: {
          title: 'Cemetery location',
          reviewTitle: ' ',
          path: 'benefits/cemetery-location',
          depends: form =>
            get('view:claimedBenefits.plotAllowance', form) &&
            !get('nationalOrFederal', form),
          uiSchema: cemeteryLocationQuestion.uiSchema,
          schema: cemeteryLocationQuestion.schema,
        },
        cemeteryLocation: {
          title: 'Cemetery location',
          reviewTitle: ' ',
          path: 'benefits/cemetery-location/add',
          depends: form =>
            get('view:claimedBenefits.plotAllowance', form) &&
            get('cemetaryLocationQuestion', form) === 'cemetery',
          uiSchema: cemeteryLocation.uiSchema,
          schema: cemeteryLocation.schema,
        },
        tribalLandLocation: {
          title: 'Cemetery location',
          reviewTitle: ' ',
          path: 'benefits/cemetery-location/tribal-land/add',
          depends: form =>
            get('view:claimedBenefits.plotAllowance', form) &&
            get('cemetaryLocationQuestion', form) === 'tribalLand',
          uiSchema: tribalLandLocation.uiSchema,
          schema: tribalLandLocation.schema,
        },
        plotAllowancePartOne: {
          title: 'Plot or interment allowance',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Plot or interment allowance
            </span>
          ),
          path: 'benefits/plot-allowance/contributions',
          depends: form => get('view:claimedBenefits.plotAllowance', form),
          uiSchema: plotAllowancePartOne.uiSchema,
          schema: plotAllowancePartOne.schema,
        },
        plotAllowancePartTwo: {
          title: 'Plot or interment allowance',
          reviewTitle: ' ',
          path: 'benefits/plot-allowance/expense-responsibility',
          depends: form => get('view:claimedBenefits.plotAllowance', form),
          uiSchema: plotAllowancePartTwo.uiSchema,
          schema: plotAllowancePartTwo.schema,
        },
        transportationExpenses: {
          title: 'Transportation allowance',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Transportation allowance
            </span>
          ),
          path: 'benefits/transportation-reimbursement',
          depends: form => get('view:claimedBenefits.transportation', form),
          uiSchema: transportationExpenses.uiSchema,
          schema: transportationExpenses.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        directDeposit: createDirectDepositPage(),
        supportingDocuments: {
          title: 'Supporting Documents',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Supporting Documents</span>
          ),
          path: 'additional-information/supporting-documents',
          uiSchema: supportingDocuments.uiSchema,
          schema: supportingDocuments.schema,
        },
        deathCertificate: {
          title: 'Death certificate',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Death certificate</span>
          ),
          path: 'additional-information/upload-death-certificate',
          depends: form => !showDeathCertificateRequiredPage(form),
          uiSchema: deathCertificate.uiSchema,
          schema: deathCertificate.schema,
        },
        deathCertificateRequired: {
          title: 'Death certificate',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Death certificate</span>
          ),
          path: 'additional-information/upload-death-certificate-required',
          depends: form => showDeathCertificateRequiredPage(form),
          uiSchema: deathCertificateRequired.uiSchema,
          schema: deathCertificateRequired.schema,
        },
        transportationReceipts: {
          title: 'Transportation receipts',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Transportation receipts
            </span>
          ),
          path: 'additional-information/transportation-receipts',
          depends: form => get('transportationExpenses', form),
          uiSchema: transportationReceipts.uiSchema,
          schema: transportationReceipts.schema,
        },
        additionalEvidence: {
          title: 'Additional evidence',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">Additional evidence</span>
          ),
          path: 'additional-information/additional-evidence',
          uiSchema: additionalEvidence.uiSchema,
          schema: additionalEvidence.schema,
        },
        fasterClaimProcessing: {
          title: 'Faster claim processing',
          reviewTitle: () => (
            <span className="vads-u-font-size--h3">
              Faster claim processing
            </span>
          ),
          path: 'additional-information/fdc-program',
          depends: () => !showPdfFormAlignment(),
          uiSchema: fasterClaimProcessing.uiSchema,
          schema: fasterClaimProcessing.schema,
        },
      },
    },
  },
};

export default formConfig;
