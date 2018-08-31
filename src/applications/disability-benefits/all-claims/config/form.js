import environment from '../../../../platform/utilities/environment';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import {
  hasMilitaryRetiredPay,
  hasRatedDisabilities
} from '../validations';

import {
  hasGuardOrReservePeriod,
  prefillTransformer
} from '../utils';

import { veteranInfoDescription } from '../content/veteranDetails';
import { disabilitiesOrientation } from '../content/disabilitiesOrientation';
import {
  alternateNames,
  servicePay,
  waiveRetirementPay,
  militaryHistory,
  separationTrainingPay,
  reservesNationalGuardService,
  federalOrders,
  prisonerOfWar,
  ratedDisabilities
} from '../pages';

import fullSchema from './schema';

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${environment.API_URL}/v0/disability_compensation_form/submit`,
  trackingPrefix: 'disability-526EZ-',
  // formId: '21-526EZ-all-claims',
  formId: '21-526EZ', // To test prefill, we'll use the 526 increase form ID for now
  version: 1,
  migrations: [],
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  savedFormMessages: {
    notFound: 'Please start over to apply for disability claims increase.',
    noAuth: 'Please sign in again to resume your application for disability claims increase.'
  },
  // transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  // footerContent: FormFooter,
  // getHelp: GetFormHelp,
  defaultDefinitions: {
    ...fullSchema.definitions
  },
  title: 'Apply for disability compensation',
  subTitle: 'Form 21-526EZ',
  chapters: {
    veteranDetails: {
      title: (isReviewPage) => `${isReviewPage ? 'Review ' : ''}Veteran Details`,
      pages: {
        veteranInformation: {
          title: 'Veteran Information',
          path: 'veteran-information',
          uiSchema: { 'ui:description': veteranInfoDescription },
          schema: { type: 'object', properties: {} }
        },
        alternateNames: {
          title: 'Service under another name',
          path: 'alternate-names',
          uiSchema: alternateNames.uiSchema,
          schema: alternateNames.schema
        },
        servicePay: {
          title: 'Service Pay',
          path: 'service-pay',
          uiSchema: servicePay.uiSchema,
          schema: servicePay.schema
        },
        waiveRetirementPay: {
          title: 'Waiving Retirement Pay',
          path: 'waive-retirement-pay',
          depends: hasMilitaryRetiredPay,
          uiSchema: waiveRetirementPay.uiSchema,
          schema: waiveRetirementPay.schema
        },
        separationTrainingPay: {
          title: 'Separation, Severance or Training Pay',
          path: 'separation-training-pay',
          uiSchema: separationTrainingPay.uiSchema,
          schema: separationTrainingPay.schema
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema
        },
        reservesNationalGuardService: {
          title: 'Reserves and National Guard Service',
          path: 'review-veteran-details/military-service-history/reserves-national-guard',
          depends: form => hasGuardOrReservePeriod(form.serviceInformation),
          uiSchema: reservesNationalGuardService.uiSchema,
          schema: reservesNationalGuardService.schema
        },
        federalOrders: {
          title: 'Federal orders',
          path: 'review-veteran-details/military-service-history/federal-orders',
          depends: form => hasGuardOrReservePeriod(form.serviceInformation),
          uiSchema: federalOrders.uiSchema,
          schema: federalOrders.schema
        },
        prisonerOfWar: {
          title: 'Prisoner of War (POW)',
          path: 'review-veteran-details/military-service-history/pow',
          uiSchema: prisonerOfWar.uiSchema,
          schema: prisonerOfWar.schema
        }
      }
    },
    disabilities: {
      title: 'Disabilities', // this probably needs to change
      pages: {
        disabilitiesOrientation: {
          title: '',
          path: 'disabilities/orientation',
          uiSchema: { 'ui:description': disabilitiesOrientation },
          schema: { type: 'object', properties: {} }
        },
        ratedDisabilities: {
          title: 'Existing Conditions (Rated Disabilities)',
          path: 'disabilities/rated-disabilities',
          depends: hasRatedDisabilities,
          uiSchema: ratedDisabilities.uiSchema,
          schema: ratedDisabilities.schema
        }
      }
    }
  }
};

export default formConfig;
