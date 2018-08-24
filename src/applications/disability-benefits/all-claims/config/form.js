import environment from '../../../../platform/utilities/environment';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { hasMilitaryRetiredPay } from '../validations';

import {
  hasGuardOrReservePeriod
} from '../utils';

import { veteranInfoDescription } from '../content/veteranDetails';
import {
  uiSchema as alternateNamesUISchema,
  schema as alternateNamesSchema
} from '../pages/alternateNames';

import {
  uiSchema as servicePayUISchema,
  schema as servicePaySchema
} from '../pages/servicePay';

import {
  uiSchema as waiveRetirementPayUISchema,
  schema as waiveRetirementPaySchema
} from '../pages/waiveRetirementPay';

import {
  uiSchema as militaryHistoryUISchema,
  schema as militaryHistorySchema
} from '../pages/militaryHistory';

import {
  uiSchema as reservesNationalGuardUISchema,
  schema as reservesNationalGuardSchema
} from '../pages/reservesNationalGuardService';

import {
  uiSchema as federalOrdersUISchema,
  schema as federalOrdersSchema
} from '../pages/federalOrders';

import {
  uiSchema as prisonerOfWarUISchema,
  schema as prisonerOfWarSchema
} from '../pages/prisonerOfWar';

import fullSchema from './schema';

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
  title: 'Apply for increased disability compensation',
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
          uiSchema: alternateNamesUISchema,
          schema: alternateNamesSchema
        },
        servicePay: {
          title: 'Service Pay',
          path: 'service-pay',
          uiSchema: servicePayUISchema,
          schema: servicePaySchema
        },
        waiveRetirementPay: {
          title: 'Waiving Retirement Pay',
          path: 'waive-retirement-pay',
          depends: hasMilitaryRetiredPay,
          uiSchema: waiveRetirementPayUISchema,
          schema: waiveRetirementPaySchema
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: militaryHistoryUISchema,
          schema: militaryHistorySchema
        },
        reservesNationalGuardService: {
          title: 'Reserves and National Guard Service',
          path: 'review-veteran-details/military-service-history/reserves-national-guard',
          depends: hasGuardOrReservePeriod,
          uiSchema: reservesNationalGuardUISchema,
          schema: reservesNationalGuardSchema
        },
        federalOrders: {
          title: 'Federal orders',
          path: 'review-veteran-details/military-service-history/federal-orders',
          depends: hasGuardOrReservePeriod,
          uiSchema: federalOrdersUISchema,
          schema: federalOrdersSchema
        },
        prisonerOfWar: {
          title: 'Prisoner of War (POW)',
          path: 'review-veteran-details/military-service-history/pow',
          uiSchema: prisonerOfWarUISchema,
          schema: prisonerOfWarSchema
        }
      }
    }
  }
};

export default formConfig;
