import environment from '../../../../platform/utilities/environment';

import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';
import { hasMilitaryRetiredPay, hasRatedDisabilities } from '../validations';

import {
  hasGuardOrReservePeriod,
  getDisabilityName,
  prefillTransformer,
  hasVAEvidence,
  hasPrivateEvidence,
} from '../utils';

import { veteranInfoDescription } from '../content/veteranDetails';
import { disabilitiesOrientation } from '../content/disabilitiesOrientation';
import { supportingEvidenceOrientation } from '../content/supportingEvidenceOrientation';
import {
  alternateNames,
  servicePay,
  waiveRetirementPay,
  militaryHistory,
  separationTrainingPay,
  reservesNationalGuardService,
  federalOrders,
  prisonerOfWar,
  ratedDisabilities,
  contactInformation,
  addDisabilities,
  newDisabilityFollowUp,
  vaMedicalRecords,
  privateMedicalRecords,
  paymentInformation,
  evidenceTypes,
  claimExamsInfo,
  homelessOrAtRisk,
} from '../pages';

import fullSchema from './schema';

const ptsdDisabilityIds = new Set([5420, 7290, 9010, 9011]);

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
    noAuth:
      'Please sign in again to resume your application for disability claims increase.',
  },
  // transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  // footerContent: FormFooter,
  // getHelp: GetFormHelp,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  title: 'Apply for disability compensation',
  subTitle: 'Form 21-526EZ',
  preSubmitInfo,
  chapters: {
    veteranDetails: {
      title: isReviewPage => `${isReviewPage ? 'Review ' : ''}Veteran Details`,
      pages: {
        veteranInformation: {
          title: 'Veteran Information',
          path: 'veteran-information',
          uiSchema: { 'ui:description': veteranInfoDescription },
          schema: { type: 'object', properties: {} },
        },
        alternateNames: {
          title: 'Service under another name',
          path: 'alternate-names',
          uiSchema: alternateNames.uiSchema,
          schema: alternateNames.schema,
        },
        servicePay: {
          title: 'Service Pay',
          path: 'service-pay',
          uiSchema: servicePay.uiSchema,
          schema: servicePay.schema,
        },
        waiveRetirementPay: {
          title: 'Waiving Retirement Pay',
          path: 'waive-retirement-pay',
          depends: hasMilitaryRetiredPay,
          uiSchema: waiveRetirementPay.uiSchema,
          schema: waiveRetirementPay.schema,
        },
        separationTrainingPay: {
          title: 'Separation, Severance or Training Pay',
          path: 'separation-training-pay',
          uiSchema: separationTrainingPay.uiSchema,
          schema: separationTrainingPay.schema,
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema,
        },
        reservesNationalGuardService: {
          title: 'Reserves and National Guard Service',
          path:
            'review-veteran-details/military-service-history/reserves-national-guard',
          depends: form => hasGuardOrReservePeriod(form.serviceInformation),
          uiSchema: reservesNationalGuardService.uiSchema,
          schema: reservesNationalGuardService.schema,
        },
        federalOrders: {
          title: 'Federal orders',
          path:
            'review-veteran-details/military-service-history/federal-orders',
          depends: form => hasGuardOrReservePeriod(form.serviceInformation),
          uiSchema: federalOrders.uiSchema,
          schema: federalOrders.schema,
        },
        prisonerOfWar: {
          title: 'Prisoner of War (POW)',
          path: 'review-veteran-details/military-service-history/pow',
          uiSchema: prisonerOfWar.uiSchema,
          schema: prisonerOfWar.schema,
        },
      },
    },
    disabilities: {
      title: 'Disabilities', // this probably needs to change
      pages: {
        disabilitiesOrientation: {
          title: '',
          path: 'disabilities/orientation',
          uiSchema: { 'ui:description': disabilitiesOrientation },
          schema: { type: 'object', properties: {} },
        },
        ratedDisabilities: {
          title: 'Existing Conditions (Rated Disabilities)',
          path: 'disabilities/rated-disabilities',
          depends: hasRatedDisabilities,
          uiSchema: ratedDisabilities.uiSchema,
          schema: ratedDisabilities.schema,
        },
        newDisabilities: {
          title: 'New disabilities',
          path: 'new-disabilities',
          uiSchema: {
            'ui:title': 'New disabilities',
            'ui:description':
              'Now we’ll ask you about your new service-connected disabilities or conditions.',
          },
          schema: { type: 'object', properties: {} },
        },
        addDisabilities: {
          title: 'Add a new disability',
          path: 'new-disabilities/add',
          uiSchema: addDisabilities.uiSchema,
          schema: addDisabilities.schema,
        },
        followUpDesc: {
          title: 'Follow-up questions',
          depends: form => form['view:newDisabilities'] === true,
          path: 'new-disabilities/follow-up',
          uiSchema: {
            'ui:description':
              'Now we’re going to ask you some follow-up questions about each of your disabilities. We’ll go through them one by one.',
          },
          schema: { type: 'object', properties: {} },
        },
        newDisabilityFollowUp: {
          title: formData => getDisabilityName(formData.condition),
          path: 'new-disabilities/follow-up/:index',
          showPagePerItem: true,
          itemFilter: item => !ptsdDisabilityIds.has(item.diagnosticCode),
          arrayPath: 'newDisabilities',
          uiSchema: newDisabilityFollowUp.uiSchema,
          schema: newDisabilityFollowUp.schema,
        },
      },
    },
    supportingEvidence: {
      title: 'Supporting Evidence',
      pages: {
        orientation: {
          title: '',
          path: 'supporting-evidence/orientation',
          uiSchema: { 'ui:description': supportingEvidenceOrientation },
          schema: { type: 'object', properties: {} },
        },
        evidenceTypes: {
          title: 'Supporting evidence types',
          path: 'supporting-evidence/evidence-types',
          uiSchema: evidenceTypes.uiSchema,
          schema: evidenceTypes.schema,
        },
        vaMedicalRecords: {
          title: 'VA Medical Records',
          path: 'supporting-evidence/va-medical-records',
          depends: hasVAEvidence,
          uiSchema: vaMedicalRecords.uiSchema,
          schema: vaMedicalRecords.schema,
        },
        privateMedicalRecords: {
          title: 'Private Medical Records',
          path: 'supporting-evidence/private-medical-records',
          depends: hasPrivateEvidence,
          uiSchema: privateMedicalRecords.uiSchema,
          schema: privateMedicalRecords.schema,
        },
        howClaimsWork: {
          title: 'How claim exams work',
          path: 'how-claim-exams-work',
          uiSchema: claimExamsInfo.uiSchema,
          schema: claimExamsInfo.schema,
        },
      },
    },
    additionalInformation: {
      title: 'Additional information',
      pages: {
        contactInformation: {
          title: 'Veteran contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        paymentInformation: {
          title: 'Payment information',
          path: 'payment-information',
          uiSchema: paymentInformation.uiSchema,
          schema: paymentInformation.schema,
        },
        homelessOrAtRisk: {
          title: 'Housing situation',
          path: 'housing-situation',
          uiSchema: homelessOrAtRisk.uiSchema,
          schema: homelessOrAtRisk.schema,
        },
      },
    },
  },
};

export default formConfig;
