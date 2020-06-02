import environment from 'platform/utilities/environment';

import FormFooter from 'platform/forms/components/FormFooter';
import preSubmitInfo from 'platform/forms/preSubmitInfo';
import { VA_FORM_IDS } from 'platform/forms/constants';

import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import submitFormFor from '../../all-claims/config/submitForm';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPoll from '../components/ConfirmationPoll';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import FormSavedPage from '../../all-claims/containers/FormSavedPage';

import {
  hasGuardOrReservePeriod,
  hasVAEvidence,
  hasPrivateEvidence,
  capitalizeEachWord,
  hasOtherEvidence,
  needsToEnter781,
  needsToEnter781a,
  isAnswering781Questions,
  isAnswering781aQuestions,
  isUploading781Form,
  isUploading781aForm,
  isNotUploadingPrivateMedical,
  hasNewPtsdDisability,
  isDisabilityPtsd,
  directToCorrectForm,
} from '../../all-claims/utils';

import captureEvents from '../../all-claims/analytics-functions';

import prefillTransformer from '../../all-claims/prefill-transformer';

import { transform } from '../../all-claims/submit-transformer';

import { veteranInfoDescription } from '../../all-claims/content/veteranDetails';
import { supportingEvidenceOrientation } from '../../all-claims/content/supportingEvidenceOrientation';
import {
  adaptiveBenefits,
  addDisabilities,
  additionalBehaviorChanges,
  additionalDocuments,
  additionalRemarks781,
  aidAndAttendance,
  alternateNames,
  ancillaryFormsWizardSummary,
  choosePtsdType,
  claimExamsInfo,
  contactInformation,
  evidenceTypes,
  federalOrders,
  finalIncident,
  individualUnemployability,
  mentalHealthChanges,
  newDisabilities,
  newDisabilityFollowUp,
  newPTSDFollowUp,
  paymentInformation,
  physicalHealthChanges,
  privateMedicalRecords,
  privateMedicalRecordsRelease,
  ptsd781aChangesIntro,
  ptsdWalkthroughChoice781,
  ptsdWalkthroughChoice781a,
  secondaryFinalIncident,
  socialBehaviorChanges,
  summaryOfDisabilities,
  summaryOfEvidence,
  uploadPersonalPtsdDocuments,
  uploadPtsdDocuments,
  vaMedicalRecords,
  workBehaviorChanges,
} from '../../all-claims/pages';

import { militaryHistory } from '../pages';

import { ancillaryFormsWizardDescription } from '../../all-claims/content/ancillaryFormsWizardIntro';

import { ptsd781NameTitle } from '../../all-claims/content/ptsdClassification';
import { ptsdFirstIncidentIntro } from '../../all-claims/content/ptsdFirstIncidentIntro';

import {
  createFormConfig781,
  createFormConfig781a,
} from '../../all-claims/config/781';

import createformConfig8940 from '../../all-claims/config/8940';

import { PTSD_INCIDENT_ITERATION } from '../../all-claims/constants';

import migrations from '../../all-claims/migrations';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const formConfig = {
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${
    environment.API_URL
  }/v0/disability_compensation_form/submit_all_claim`,
  submit: submitFormFor('disability-526EZ'),
  trackingPrefix: 'disability-526EZ-bdd-',
  downtime: {
    requiredForPrefill: true,
    dependencies: [services.evss, services.emis, services.mvi, services.vet360],
  },
  formId: VA_FORM_IDS.FORM_21_526EZ_BDD,
  onFormLoaded: directToCorrectForm,
  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  savedFormMessages: {
    notFound: 'Please start over to file for benefits delivery at discharge.',
    noAuth:
      'Please sign in again to resume your application for benefits delivery at discharge.',
  },
  formSavedPage: FormSavedPage,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPoll,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  title: 'File for Benefits Delivery at Discharge',
  subTitle: 'Benefits Delivery at Discharge (BDD)',
  preSubmitInfo,
  chapters: {
    veteranDetails: {
      title: 'Service Member Details',
      pages: {
        veteranInformation: {
          title: 'Service member information',
          path: 'veteran-information',
          uiSchema: { 'ui:description': veteranInfoDescription },
          schema: { type: 'object', properties: {} },
        },
        contactInformation: {
          title: 'Service member contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
        },
        alternateNames: {
          title: 'Service under another name',
          path: 'alternate-names',
          uiSchema: alternateNames.uiSchema,
          schema: alternateNames.schema,
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema,
          onContinue: captureEvents.militaryHistory,
          appStateSelector: state => ({ dob: state.user.profile.dob }),
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
      title: 'Disabilities',
      pages: {
        newDisabilities: {
          title: 'New disabilities',
          path: 'new-disabilities',
          uiSchema: newDisabilities.uiSchema,
          schema: newDisabilities.schema,
        },
        addDisabilities: {
          title: 'Add a new disability',
          path: 'new-disabilities/add',
          uiSchema: addDisabilities.uiSchema,
          schema: addDisabilities.schema,
          updateFormData: addDisabilities.updateFormData,
        },
        newDisabilityFollowUp: {
          title: formData => capitalizeEachWord(formData.condition),
          path: 'new-disabilities/follow-up/:index',
          showPagePerItem: true,
          itemFilter: item => !isDisabilityPtsd(item.condition),
          arrayPath: 'newDisabilities',
          uiSchema: newDisabilityFollowUp.uiSchema,
          schema: newDisabilityFollowUp.schema,
        },
        followUpPageBreak: {
          title: '',
          depends: () => false,
          path: 'new-disabilities/page-break',
          uiSchema: {},
          schema: { type: 'object', properties: {} },
        },
        // 781/a - 1. REVIEW INTRODUCTION PAGE
        newPTSDFollowUp: {
          title: formData => capitalizeEachWord(formData.condition),
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
          title: 'Upload PTSD documents - 781',
          path: 'new-disabilities/ptsd-781-upload',
          depends: formData =>
            needsToEnter781(formData) && isUploading781Form(formData),
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
          title: 'Additional remarks',
          path: 'new-disabilities/additional-remarks-781',
          depends: isAnswering781Questions(0),
          uiSchema: additionalRemarks781.uiSchema,
          schema: additionalRemarks781.schema,
        },
        // 781a - 2a. SELECT UPLOAD OPTION
        // 781a - 2b. SELECT 'I WANT TO ANSWER QUESTIONS' AND LAUNCH INTERVIEW
        ptsdWalkthroughChoice781a: {
          title: 'Answer online questions or upload paper 21-0781A?',
          path: 'new-disabilities/walkthrough-781a-choice',
          depends: needsToEnter781a,
          uiSchema: ptsdWalkthroughChoice781a.uiSchema,
          schema: ptsdWalkthroughChoice781a.schema,
        },
        // 781a - Pages 3 - 10 (Event Loop)
        ...createFormConfig781a(PTSD_INCIDENT_ITERATION),
        // 781a - ?. ???
        uploadPtsdDocuments781a: {
          title: 'Upload PTSD documents - 781a',
          path: 'new-disabilities/ptsd-781a-upload',
          depends: formData =>
            needsToEnter781a(formData) && isUploading781aForm(formData),
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
        ptsd781ChangesIntro: {
          title: 'Additional changes in behavior - physical',
          path: 'new-disabilities/ptsd-781a-changes-intoduction',
          depends: isAnswering781aQuestions(0),
          uiSchema: ptsd781aChangesIntro.uiSchema,
          schema: ptsd781aChangesIntro.schema,
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
        // Ancillary forms wizard
        ancillaryFormsWizardIntro: {
          title: 'Additional disability benefits',
          path: 'additional-disability-benefits',
          uiSchema: {
            'ui:title': 'Additional disability benefits',
            'ui:description': ancillaryFormsWizardDescription,
            'view:ancillaryFormsWizard': {
              'ui:title':
                'Would you like to learn more about additional benefits?',
              'ui:widget': 'yesNo',
            },
          },
          schema: {
            type: 'object',
            properties: {
              'view:ancillaryFormsWizardIntro': {
                type: 'object',
                properties: {},
              },
              'view:ancillaryFormsWizard': {
                type: 'boolean',
              },
            },
          },
        },
        adaptiveBenefits: {
          title: 'Automobile allowance and adaptive benefits',
          path: 'adaptive-benefits',
          depends: formData => formData['view:ancillaryFormsWizard'],
          uiSchema: adaptiveBenefits.uiSchema,
          schema: adaptiveBenefits.schema,
        },
        aidAndAttendance: {
          title: 'Aid and attendance benefits',
          path: 'aid-and-attendance',
          depends: formData => formData['view:ancillaryFormsWizard'],
          uiSchema: aidAndAttendance.uiSchema,
          schema: aidAndAttendance.schema,
        },
        individualUnemployability: {
          title: 'Individual Unemployability',
          path: 'individual-unemployability',
          depends: formData => formData['view:ancillaryFormsWizard'],
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
          title: 'Private medical records',
          path: 'supporting-evidence/private-medical-records',
          depends: hasPrivateEvidence,
          uiSchema: privateMedicalRecords.uiSchema,
          schema: privateMedicalRecords.schema,
        },
        privateMedicalRecordsRelease: {
          title: 'Private medical records',
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
      title: 'Additional Information',
      pages: {
        paymentInformation: {
          title: 'Payment information',
          path: 'payment-information',
          uiSchema: paymentInformation.uiSchema,
          schema: paymentInformation.schema,
          onContinue: captureEvents.paymentInformation,
        },
      },
    },
  },
};

export default formConfig;
