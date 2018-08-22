import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';

import environment from '../../../../platform/utilities/environment';

import ServicePeriodView from '../../../../platform/forms/components/ServicePeriodView';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import { veteranInfoDescription } from '../content/veteranDetails';
import {
  uiSchema as alternateNamesUISchema,
  schema as alternateNamesSchema
} from '../pages/alternateNames';

import fullSchema from '../config/schema';

const {
  serviceInformation: {
    properties: { servicePeriods }
  },
} = fullSchema.properties;

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
  defaultDefinitions: {},
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
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: {
            servicePeriods: {
              'ui:title': 'Military service history',
              'ui:description': 'This is the military service history we have on file for you.',
              'ui:options': {
                itemName: 'Service Period',
                viewField: ServicePeriodView,
                reviewMode: true
              },
              items: {
                serviceBranch: {
                  'ui:title': 'Branch of service'
                },
                dateRange: dateRangeUI(
                  'Service start date',
                  'Service end date',
                  'End of service must be after start of service'
                )
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              servicePeriods,
              'view:militaryHistoryNote': {
                type: 'object',
                properties: {}
              }
            }
          }
        },
        reservesNationalGuardService: {
          title: 'Reserves and National Guard Service',
          path: 'review-veteran-details/military-service-history/reserves-national-guard',
          depends: hasGuardOrReservePeriod,
          uiSchema: reservesNationalGuardUISchema,
          schema: reservesNationalGuardSchema
        },
        alternateNames: {
          title: 'Service under another name',
          path: 'alternate-names',
          uiSchema: alternateNamesUISchema,
          schema: alternateNamesSchema
        }
      }
    }
  }
};

export default formConfig;
