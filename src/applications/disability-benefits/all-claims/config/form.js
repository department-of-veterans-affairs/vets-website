import environment from '../../../../platform/utilities/environment';

import FormFooter from '../../../../platform/forms/components/FormFooter';
import preSubmitInfo from '../../../../platform/forms/preSubmitInfo';

import submitForm from './submitForm';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPoll from '../components/ConfirmationPoll';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';

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
  isAnswering781Questions,
  isAnswering781aQuestions,
  isUploading781Form,
  isUploading781aForm,
  servedAfter911,
  isNotUploadingPrivateMedical,
  showPtsdCombatConclusion,
  showPtsdAssaultConclusion,
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
  finalIncident,
  secondaryFinalIncident,
  conclusionCombat,
  conclusionAssault,
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
  workBehaviorChanges,
  socialBehaviorChanges,
  additionalRemarks781,
  additionalBehaviorChanges,
  mentalHealthChanges,
  adaptiveBenefits,
  aidAndAttendance,
  individualUnemployability,
  physicalHealthChanges,
  newDisabilities,
  ancillaryFormsWizardSummary,
} from '../pages';

import { ancillaryFormsWizardDescription } from '../content/ancillaryFormsWizardIntro';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ptsdFirstIncidentIntro } from '../content/ptsdFirstIncidentIntro';

import { createFormConfig781, createFormConfig781a } from './781';

import createformConfig8940 from './8940';

import { PTSD, PTSD_INCIDENT_ITERATION } from '../constants';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${
    environment.API_URL
  }/v0/disability_compensation_form/submit_all_claim`,
  submit: submitForm,
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
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
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
          uiSchema: newDisabilities.uiSchema,
          schema: newDisabilities.schema,
        },
        addDisabilities: {
          title: 'Add a new disability',
          path: 'new-disabilities/add',
          depends: form => form['view:newDisabilities'] === true,
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
        // 781/a - 1. REVIEW INTRODUCTION PAGE
        newPTSDFollowUp: {
          title: formData => getDisabilityName(formData.condition),
          path: 'new-disabilities/ptsd-intro',
          depends: hasNewPtsdDisability,
          uiSchema: newPTSDFollowUp.uiSchema,
          schema: newPTSDFollowUp.schema,
        },
        // 781/a - 2. SELECT ONE (OR ALL) OF THE PTSD TYPES LISTED
        choosePtsdType: {
          title: 'Factors that contributed to PTSD',
          path: 'new-disabilities/ptsd-type',
          depends: hasNewPtsdDisability,
          uiSchema: choosePtsdType.uiSchema,
          schema: choosePtsdType.schema,
        },
        // 781 - 2a.  SELECT UPLOAD OPTION
        // 781 - 2b. SELECT 'I WANT TO ANSWER QUESTIONS' AND LAUNCH INTERVIEW
        ptsdWalkthroughChoice781: {
          title: 'Answer online questions or upload paper 21-0781',
          path: 'new-disabilities/walkthrough-781-choice',
          depends: formData =>
            hasNewPtsdDisability(formData) && needsToEnter781(formData),
          uiSchema: ptsdWalkthroughChoice781.uiSchema,
          schema: ptsdWalkthroughChoice781.schema,
        },
        incidentIntro: {
          title: 'PTSD intro to questions',
          path: 'new-disabilities/ptsd-intro-to-questions',
          depends: isAnswering781Questions(0),
          uiSchema: {
            'ui:title': ptsd781NameTitle,
            'ui:description': ptsdFirstIncidentIntro,
          },
          schema: {
            type: 'object',
            properties: {},
          },
        },
        // 781 - Pages 3 - 12 (Event Loop)
        ...createFormConfig781(PTSD_INCIDENT_ITERATION),
        // 781 - ?. ???
        uploadPtsdDocuments781: {
          title: 'Upload PTSD Documents - 781',
          path: 'new-disabilities/ptsd-781-upload',
          depends: formData =>
            hasNewPtsdDisability(formData) &&
            needsToEnter781(formData) &&
            isUploading781Form(formData),
          uiSchema: uploadPtsdDocuments.uiSchema,
          schema: uploadPtsdDocuments.schema,
        },
        // 781 - 13. ADDITIONAL EVENTS (ONLY DISPLAYS FOR 4TH EVENT)
        finalIncident: {
          path: 'new-disabilities/ptsd-additional-incident',
          title: 'Additional PTSD event',
          depends: isAnswering781Questions(PTSD_INCIDENT_ITERATION),
          uiSchema: finalIncident.uiSchema,
          schema: finalIncident.schema,
        },
        // 781 - 14. ADDITIONAL REMARKS
        additionalRemarks781: {
          title: 'Additional Remarks',
          path: 'new-disabilities/additional-remarks-781',
          depends: isAnswering781Questions(0),
          uiSchema: additionalRemarks781.uiSchema,
          schema: additionalRemarks781.schema,
        },
        // 781 - 15. PTSD CONCLUSION
        conclusionCombat: {
          path: 'ptsd-conclusion-combat',
          title: 'PTSD combat conclusion',
          depends: showPtsdCombatConclusion,
          uiSchema: conclusionCombat.uiSchema,
          schema: conclusionCombat.schema,
        },
        // 781a - 2a. SELECT UPLOAD OPTION
        // 781a - 2b. SELECT 'I WANT TO ANSWER QUESTIONS' AND LAUNCH INTERVIEW
        ptsdWalkthroughChoice781a: {
          title: 'Answer online questions or upload paper 21-0781A?',
          path: 'new-disabilities/walkthrough-781a-choice',
          depends: formData =>
            hasNewPtsdDisability(formData) && needsToEnter781a(formData),
          uiSchema: ptsdWalkthroughChoice781a.uiSchema,
          schema: ptsdWalkthroughChoice781a.schema,
        },
        // 781a - Pages 3 - 10 (Event Loop)
        ...createFormConfig781a(PTSD_INCIDENT_ITERATION),
        // 781a - ?. ???
        uploadPtsdDocuments781a: {
          title: 'Upload PTSD Documents - 781a',
          path: 'new-disabilities/ptsd-781a-upload',
          depends: formData =>
            hasNewPtsdDisability(formData) &&
            needsToEnter781a(formData) &&
            isUploading781aForm(formData),
          uiSchema: uploadPersonalPtsdDocuments.uiSchema,
          schema: uploadPersonalPtsdDocuments.schema,
        },
        // 781a - 11. ADDITIONAL EVENTS (ONLY DISPLAYS FOR 4TH EVENT)
        secondaryFinalIncident: {
          path: 'new-disabilities/ptsd-assault-additional-incident',
          title: 'Additional assault PTSD event',
          depends: isAnswering781aQuestions(PTSD_INCIDENT_ITERATION),
          uiSchema: secondaryFinalIncident.uiSchema,
          schema: secondaryFinalIncident.schema,
        },
        // 781a - 12. BEHAVIOR CHANGES: PHYSICAL
        physicalHealthChanges: {
          title: 'Additional changes in behavior - physical',
          path: 'new-disabilities/ptsd-781a-physical-changes',
          depends: isAnswering781aQuestions(0),
          uiSchema: physicalHealthChanges.uiSchema,
          schema: physicalHealthChanges.schema,
        },
        // 781a - 13. BEHAVIOR CHANGES: MENTAL/SUBSTANCE ABUSE
        mentalHealthChanges: {
          title: 'Additional changes in behavior - mental/substance abuse',
          path: 'new-disabilities/ptsd-781a-mental-changes',
          depends: isAnswering781aQuestions(0),
          uiSchema: mentalHealthChanges.uiSchema,
          schema: mentalHealthChanges.schema,
        },
        // 781a - 14. BEHAVIOR CHANGES: AT WORK
        workBehaviorChanges: {
          title: 'Additional changes in behavior - work',
          path: 'new-disabilities/ptsd-781a-work-changes',
          depends: isAnswering781aQuestions(0),
          uiSchema: workBehaviorChanges.uiSchema,
          schema: workBehaviorChanges.schema,
        },
        // 781a - 15. BEHAVIOR CHANGES: SOCIAL
        socialBehaviorChanges: {
          title: 'Additional changes in behavior - social',
          path: 'new-disabilities/ptsd-781a-social-changes',
          depends: isAnswering781aQuestions(0),
          uiSchema: socialBehaviorChanges.uiSchema,
          schema: socialBehaviorChanges.schema,
        },
        // 781a - 16. BEHAVIOR CHANGES: ADDITIONAL INFORMATION
        additionalBehaviorChanges: {
          title: 'Additional changes in behavior - more information',
          path: 'new-disabilities/ptsd-781a-additional-changes',
          depends: isAnswering781aQuestions(0),
          uiSchema: additionalBehaviorChanges.uiSchema,
          schema: additionalBehaviorChanges.schema,
        },
        // 781a - 17. PTSD CONCLUSION
        conclusionAssault: {
          path: 'ptsd-conclusion-assault',
          title: 'PTSD assault conclusion',
          depends: showPtsdAssaultConclusion,
          uiSchema: conclusionAssault.uiSchema,
          schema: conclusionAssault.schema,
        },
        prisonerOfWar: {
          title: 'Prisoner of War (POW)',
          path: 'pow',
          uiSchema: prisonerOfWar.uiSchema,
          schema: prisonerOfWar.schema,
        },
        // Ancillary forms wizard
        ancillaryFormsWizardIntro: {
          title: 'Additional disability benefits',
          path: 'additional-disability-benefits',
          uiSchema: {
            'ui:title': 'Additional disability benefits',
            'ui:description': ancillaryFormsWizardDescription,
          },
          schema: {
            type: 'object',
            properties: {
              'view:ancillaryFormsWizardIntro': {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        adaptiveBenefits: {
          title: 'Automobile allowance and adaptive benefits',
          path: 'adaptive-benefits',
          uiSchema: adaptiveBenefits.uiSchema,
          schema: adaptiveBenefits.schema,
        },
        aidAndAttendance: {
          title: 'Aid and Attendance benefits',
          path: 'aid-and-attendance',
          uiSchema: aidAndAttendance.uiSchema,
          schema: aidAndAttendance.schema,
        },
        individualUnemployability: {
          title: 'Individual Unemployability',
          path: 'individual-unemployability',
          uiSchema: individualUnemployability.uiSchema,
          schema: individualUnemployability.schema,
        },
        ...createformConfig8940(),
        ancillaryFormsWizardSummary: {
          title: 'Summary of additional benefits',
          path: 'additional-disability-benefits-summary',
          depends: ancillaryFormsWizardSummary.depends,
          uiSchema: ancillaryFormsWizardSummary.uiSchema,
          schema: ancillaryFormsWizardSummary.schema,
        },
        // End ancillary forms wizard
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
          depends: formData =>
            hasPrivateEvidence(formData) &&
            isNotUploadingPrivateMedical(formData),
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
