import environment from '../../../../platform/utilities/environment';

import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';
import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPoll from '../components/ConfirmationPoll';
import {
  hasMilitaryRetiredPay,
  hasRatedDisabilities,
  hasNewPtsdDisability,
} from '../validations';

import {
  hasGuardOrReservePeriod,
  getDisabilityName,
  prefillTransformer,
  hasVAEvidence,
  hasPrivateEvidence,
  hasOtherEvidence,
  needsToEnter781,
  needsToEnter781a,
  isUploadingPtsdForm,
  servedAfter911,
  isNotUploadingPrivateMedical,
  transform,
} from '../utils';

import { veteranInfoDescription } from '../content/veteranDetails';
import { disabilitiesOrientation } from '../content/disabilitiesOrientation';
import { supportingEvidenceOrientation } from '../content/supportingEvidenceOrientation';
import {
  alternateNames,
  servicePay,
  waiveRetirementPay,
  militaryHistory,
  servedInCombatZone,
  separationTrainingPay,
  trainingPayWaiver,
  reservesNationalGuardService,
  federalOrders,
  prisonerOfWar,
  ratedDisabilities,
  contactInformation,
  addDisabilities,
  newDisabilityFollowUp,
  newPTSDFollowUp,
  choosePtsdType,
  ptsdWalkthroughChoice781,
  uploadPtsdDocuments,
  ptsdWalkthroughChoice781a,
  uploadPersonalPtsdDocuments,
  summaryOfDisabilities,
  vaMedicalRecords,
  additionalDocuments,
  privateMedicalRecords,
  privateMedicalRecordsRelease,
  paymentInformation,
  evidenceTypes,
  claimExamsInfo,
  homelessOrAtRisk,
  vaEmployee,
  summaryOfEvidence,
  fullyDevelopedClaim,
  unemployabilityStatus,
  unemployabilityFormIntro,
} from '../pages';

import { PTSD } from '../constants';

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
    noAuth:
      'Please sign in again to resume your application for disability claims increase.',
  },
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPoll,
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
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema,
        },
        servedInCombatZone: {
          title: 'Combat status',
          path: 'review-veteran-details/combat-status',
          depends: servedAfter911,
          uiSchema: servedInCombatZone.uiSchema,
          schema: servedInCombatZone.schema,
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
          depends: form => form['view:newDisabilities'] === true,
          path: 'new-disabilities/follow-up/:index',
          showPagePerItem: true,
          itemFilter: item =>
            item.condition && !item.condition.toLowerCase().includes(PTSD),
          arrayPath: 'newDisabilities',
          uiSchema: newDisabilityFollowUp.uiSchema,
          schema: newDisabilityFollowUp.schema,
        },
        // Consecutive `showPagePerItem` pages that have the same arrayPath
        // will force each item in the array to be evaluated by both pages
        // before the next item is evaluated (e.g., if PTSD was entered first,
        // it would still show first even though the first page was skipped).
        // This break between the two `showPagePerItem`s ensures PTSD is sorted
        // behind non-PTSD conditions in the form flow.
        // TODO: forms system PR to make showPagePerItem behavior configurable
        followUpPageBreak: {
          title: '',
          depends: () => false,
          path: 'new-disabilities/page-break',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        newPTSDFollowUp: {
          title: formData => getDisabilityName(formData.condition),
          path: 'new-disabilities/ptsd-intro',
          depends: hasNewPtsdDisability,
          uiSchema: newPTSDFollowUp.uiSchema,
          schema: newPTSDFollowUp.schema,
        },
        choosePtsdType: {
          title: formData => getDisabilityName(formData.condition),
          path: 'new-disabilities/ptsd-type',
          depends: hasNewPtsdDisability,
          uiSchema: choosePtsdType.uiSchema,
          schema: choosePtsdType.schema,
        },
        ptsdWalkthroughChoice781: {
          title: 'PTSD Walkthrough 781 Choice',
          path: 'new-disabilities/walkthrough-781-choice',
          depends: formData =>
            hasNewPtsdDisability(formData) && needsToEnter781(formData),
          uiSchema: ptsdWalkthroughChoice781.uiSchema,
          schema: ptsdWalkthroughChoice781.schema,
        },
        uploadPtsdDocuments781: {
          title: 'Upload PTSD Documents - 781',
          path: 'new-disabilities/ptsd-781-upload',
          depends: formData =>
            hasNewPtsdDisability(formData) &&
            needsToEnter781(formData) &&
            isUploadingPtsdForm(formData),
          uiSchema: uploadPtsdDocuments.uiSchema,
          schema: uploadPtsdDocuments.schema,
        },
        ptsdWalkthroughChoice781a: {
          title: 'PTSD Walkthrough 781a Choice',
          path: 'new-disabilities/walkthrough-781a-choice',
          depends: formData =>
            hasNewPtsdDisability(formData) && needsToEnter781a(formData),
          uiSchema: ptsdWalkthroughChoice781a.uiSchema,
          schema: ptsdWalkthroughChoice781a.schema,
        },
        uploadPtsdDocuments781a: {
          title: 'Upload PTSD Documents - 781a',
          path: 'new-disabilities/ptsd-781a-upload',
          depends: formData =>
            hasNewPtsdDisability(formData) &&
            needsToEnter781a(formData) &&
            isUploadingPtsdForm(formData),
          uiSchema: uploadPersonalPtsdDocuments.uiSchema,
          schema: uploadPersonalPtsdDocuments.schema,
        },
        unemployabilityStatus: {
          title: 'Unemployability Status',
          path: 'new-disabilities/unemployability-status',
          uiSchema: unemployabilityStatus.uiSchema,
          schema: unemployabilityStatus.schema,
        },
        unemployabilityFormIntro: {
          title: 'File a Claim for Individual Unemployability',
          path: 'new-disabilities/unemployability-walkthrough-choice',
          depends: formData => formData['view:unemployabilityStatus'],
          uiSchema: unemployabilityFormIntro.uiSchema,
          schema: unemployabilityFormIntro.schema,
        },
        prisonerOfWar: {
          title: 'Prisoner of War (POW)',
          path: 'pow',
          uiSchema: prisonerOfWar.uiSchema,
          schema: prisonerOfWar.schema,
        },
        summaryOfDisabilities: {
          title: 'Summary of disabilities',
          path: 'disabilities/summary',
          uiSchema: summaryOfDisabilities.uiSchema,
          schema: summaryOfDisabilities.schema,
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
          title: 'VA medical records',
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
        privateMedicalRecordsRelease: {
          title: 'Private Medical Records',
          path: 'supporting-evidence/private-medical-records-release',
          depends: hasPrivateEvidence && isNotUploadingPrivateMedical,
          uiSchema: privateMedicalRecordsRelease.uiSchema,
          schema: privateMedicalRecordsRelease.schema,
        },
        additionalDocuments: {
          title: 'Lay statements and other evidence',
          path: 'supporting-evidence/additional-evidence',
          depends: hasOtherEvidence,
          uiSchema: additionalDocuments.uiSchema,
          schema: additionalDocuments.schema,
        },
        summaryOfEvidence: {
          title: 'Summary of evidence',
          path: 'supporting-evidence/summary',
          uiSchema: summaryOfEvidence.uiSchema,
          schema: summaryOfEvidence.schema,
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
        vaEmployee: {
          title: 'VA employee',
          path: 'va-employee',
          uiSchema: vaEmployee.uiSchema,
          schema: vaEmployee.schema,
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
        trainingPayWaiver: {
          title: 'Training pay waiver',
          path: 'training-pay-waiver',
          depends: formData => formData.hasTrainingPay,
          uiSchema: trainingPayWaiver.uiSchema,
          schema: trainingPayWaiver.schema,
        },

        fullyDevelopedClaim: {
          title: 'Fully developed claim program',
          path: 'fully-developed-claim',
          uiSchema: fullyDevelopedClaim.uiSchema,
          schema: fullyDevelopedClaim.schema,
        },
      },
    },
  },
};

export default formConfig;
