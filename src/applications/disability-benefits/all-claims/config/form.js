import environment from '../../../../platform/utilities/environment';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { hasMilitaryRetiredPay } from '../validations';

import {
  hasGuardOrReservePeriod
} from '../utils';

import disabilityLabels from '../content/disabilityLabels';

import { veteranInfoDescription } from '../content/veteranDetails';
import {
  alternateNames,
  servicePay,
  waiveRetirementPay,
  militaryHistory,
  separationTrainingPay,
  reservesNationalGuardService,
  federalOrders,
  prisonerOfWar,
  addDisabilities,
  newDisabilityFollowUp
} from '../pages';

import fullSchema from './schema';

const ptsdDisabilityIds = new Set([
  5420,
  7290,
  9010,
  9011
]);

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${environment.API_URL}/v0/disability_compensation_form/submit`,
  trackingPrefix: 'disability-526EZ-',
  formId: '21-526EZ-all-claims',
  version: 1,
  migrations: [],
  // prefillTransformer,
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
      title: 'Disabilities',
      pages: {
        newDisabilities: {
          title: 'New disabilities',
          path: 'new-disabilities',
          uiSchema: {
            'ui:description': 'Next, we’ll ask you to tell us what disabilities you’re claiming. Once we have your list of disabilities, we’ll ask you more specific questions about each of them.'
          },
          schema: { type: 'object', properties: {} }
        },
        addDisabilities: {
          title: 'Add a new disability',
          path: 'add-new-disabilities',
          uiSchema: addDisabilities.uiSchema,
          schema: addDisabilities.schema
        },
        followUpDesc: {
          title: 'Follow-up questions',
          path: 'follow-up',
          uiSchema: {
            'ui:description': 'Now we’re going to ask you some follow-up questions about each of your disabilities. We’ll go through them one by one.'
          },
          schema: { type: 'object', properties: {} }
        },
        newDisabilityFollowUp: {
          initialData: {
            disabilities: [
              {
                diagnosticCode: '1',
                name: 'Test name'
              }
            ]
          },
          title: (formData, { pagePerItemIndex }) => disabilityLabels[formData.newDisabilities[pagePerItemIndex].diagnosticCode],
          path: 'follow-up/:index',
          showPagePerItem: true,
          itemFilter: (item) => !ptsdDisabilityIds.has(item.diagnosticCode),
          arrayPath: 'newDisabilities',
          uiSchema: newDisabilityFollowUp.uiSchema,
          schema: newDisabilityFollowUp.schema
        },
      }
    }
  }
};

export default formConfig;
