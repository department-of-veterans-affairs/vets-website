import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import FormFooter from '@department-of-veterans-affairs/platform-forms/FormFooter';

import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';

import { externalServices as services } from 'platform/monitoring/DowntimeNotification';

import submitFormFor from './submitForm';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPoll from '../components/ConfirmationPoll';
import GetFormHelp from '../../components/GetFormHelp';
import ErrorText from '../../components/ErrorText';
import FormSavedPage from '../containers/FormSavedPage';

import { hasMilitaryRetiredPay } from '../validations';
import { standardTitle } from '../content/form0781';

import {
  capitalizeEachWord,
  getPageTitle,
  hasGuardOrReservePeriod,
  hasMedicalRecords,
  hasNewPtsdDisability,
  hasOtherEvidence,
  hasPrivateEvidence,
  hasRatedDisabilities,
  hasRealNewOrSecondaryConditions,
  hasVAEvidence,
  isAnswering781aQuestions,
  isAnswering781Questions,
  isBDD,
  isEvidenceEnhancement,
  isNewConditionsOn,
  isNewConditionsOff,
  isNotUploadingPrivateMedical,
  isUploading781aForm,
  isUploading781Form,
  isUploadingSTR,
  needsToEnter781,
  needsToEnter781a,
  // TODO: Once vetted, drop the feature toggle _and_ drop this obsolete
  // conditionality.
  showNewlyBDDPages,
  showPtsdCombat,
  showPtsdNonCombat,
  showSeparationLocation,
  isCompletingModern4142,
  onFormLoaded,
  hasEvidenceChoice,
} from '../utils';

import { gatePages } from '../utils/gatePages';
import captureEvents from '../analytics-functions';
import prefillTransformer from '../prefill-transformer';
import { transform } from '../submit-transformer';

import { supportingEvidenceOrientation } from '../content/supportingEvidenceOrientation';
import {
  adaptiveBenefits,
  additionalBehaviorChanges,
  additionalDocuments,
  additionalRemarks781,
  aidAndAttendance,
  alternateNames,
  ancillaryFormsWizardSummary,
  choosePtsdType,
  claimExamsInfo,
  contactInformation,
  evidenceRequest,
  evidenceTypes,
  evidenceTypesBDD,
  evidenceChoiceIntro,
  federalOrders,
  finalIncident,
  fullyDevelopedClaim,
  homelessOrAtRisk,
  individualUnemployability,
  medicalRecords,
  mentalHealthChanges,
  militaryHistory,
  newPTSDFollowUp,
  paymentInformation,
  physicalHealthChanges,
  prisonerOfWar,
  privateMedicalRecords,
  privateMedicalRecordsAttachments,
  privateMedicalAuthorizeRelease,
  privateMedicalRecordsRelease,
  ptsd781aChangesIntro,
  ptsdBypassCombat,
  ptsdBypassNonCombat,
  ptsdWalkthroughChoice781,
  ptsdWalkthroughChoice781a,
  reservesNationalGuardService,
  retirementPay,
  retirementPayWaiver,
  secondaryFinalIncident,
  separationLocation,
  separationPay,
  serviceTreatmentRecords,
  serviceTreatmentRecordsAttachments,
  socialBehaviorChanges,
  summaryOfDisabilities,
  summaryOfEvidence,
  terminallyIll,
  trainingPay,
  trainingPayWaiver,
  uploadPersonalPtsdDocuments,
  uploadPtsdDocuments,
  vaEmployee,
  vaMedicalRecords,
  veteranInfo,
  workBehaviorChanges,
} from '../pages';

import { toxicExposurePages } from '../pages/toxicExposure/toxicExposurePages';
import { form0781PagesConfig } from './form0781/index';
import { disabilityBenefitsWorkflow } from '../pages/disabilityBenefits';
import { disabilityConditionsWorkflow } from '../pages/disabilityConditions';

import { ancillaryFormsWizardDescription } from '../content/ancillaryFormsWizardIntro';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ptsdFirstIncidentIntro } from '../content/ptsdFirstIncidentIntro';
import PrivateRecordsAuthorization from '../components/Authorization';

import { createFormConfig781, createFormConfig781a } from './781';

import createformConfig8940 from './8940';

import {
  NULL_CONDITION_STRING,
  PTSD_INCIDENT_ITERATION,
  SEPARATION_PAY_SECTION_TITLE,
  WIZARD_STATUS,
} from '../constants';

import migrations from '../migrations';
import reviewErrors from '../reviewErrors';
import { getCustomValidationErrors } from '../utils/customValidationErrors';

import manifest from '../manifest.json';
import CustomReviewTopContent from '../components/CustomReviewTopContent';
import getPreSubmitInfo from '../content/preSubmitInfo';
import ConfirmationAncillaryFormsWizard from '../components/confirmationFields/ConfirmationAncillaryFormsWizard';
import { EvidenceRequestPage } from '../components/EvidenceRequestPage';

/** @type {FormConfig} */
const formConfig = {
  rootUrl: manifest.rootUrl,
  dev: {
    showNavLinks: true,
    collapsibleNavLinks: true,
  },
  urlPrefix: '/',
  intentToFileUrl: '/evss_claims/intent_to_file/compensation',
  submitUrl: `${
    environment.API_URL
  }/v0/disability_compensation_form/submit_all_claim`,
  submit: submitFormFor('disability-526EZ'),
  trackingPrefix: 'disability-526EZ-',
  downtime: {
    requiredForPrefill: true,
    dependencies: [
      services.evss,
      services.mvi,
      services.vaProfile,
      services.disabilityCompensationForm,
    ],
  },
  formId: VA_FORM_IDS.FORM_21_526EZ,
  wizardStorageKey: WIZARD_STATUS,
  customText: {
    appAction: 'filing',
    appContinuing: 'for disability compensation',
  },
  saveInProgress: {
    messages: {
      inProgress:
        'Your disability compensation application (21-526EZ) is in progress.',
      expired:
        'Your saved disability compensation application (21-526EZ) has expired. If you want to apply for disability compensation, please start a new application.',
      saved: 'Your disability compensation application has been saved.',
    },
  },
  version: migrations.length,
  migrations,
  prefillTransformer,
  prefillEnabled: true,
  verifyRequiredPrefill: true,
  v3SegmentedProgressBar: true,
  savedFormMessages: {
    notFound: 'Please start over to file for disability claims increase.',
    noAuth:
      'Please sign in again to resume your application for disability claims increase.',
  },
  formSavedPage: FormSavedPage,
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPoll,
  footerContent: FormFooter,
  getHelp: GetFormHelp,
  errorText: ErrorText,
  showReviewErrors: true,
  reviewErrors,
  customValidationErrors: getCustomValidationErrors,
  onFormLoaded,
  defaultDefinitions: {
    ...fullSchema.definitions,
  },
  title: ({ formData }) => getPageTitle(formData),
  subTitle:
    'Disability Compensation and Related Compensation Benefits (VA Form 21-526EZ)',
  preSubmitInfo: getPreSubmitInfo(),
  CustomReviewTopContent,
  chapters: {
    veteranDetails: {
      title: ({ onReviewPage }) =>
        `${onReviewPage ? 'Review ' : ''}Veteran Details`,
      pages: {
        veteranInformation: {
          title: 'Veteran information',
          path: 'veteran-information',
          uiSchema: veteranInfo.uiSchema,
          schema: veteranInfo.schema,
        },
        contactInformation: {
          title: 'Veteran contact information',
          path: 'contact-information',
          uiSchema: contactInformation.uiSchema,
          schema: contactInformation.schema,
          updateFormData: contactInformation.updateFormData,
        },
        homelessOrAtRisk: {
          title: 'Housing situation',
          path: 'housing-situation',
          depends: formData => showNewlyBDDPages(formData),
          uiSchema: homelessOrAtRisk.uiSchema,
          schema: homelessOrAtRisk.schema,
          onContinue: captureEvents.homelessOrAtRisk,
        },
        terminallyIll: {
          title: 'Terminally ill',
          path: 'terminally-ill',
          depends: formData => showNewlyBDDPages(formData),
          uiSchema: terminallyIll.uiSchema,
          schema: terminallyIll.schema,
        },
        alternateNames: {
          title: 'Service under another name',
          path: 'alternate-names',
          depends: formData => !hasRatedDisabilities(formData),
          uiSchema: alternateNames.uiSchema,
          schema: alternateNames.schema,
        },
        militaryHistory: {
          title: 'Military service history',
          path: 'review-veteran-details/military-service-history',
          uiSchema: militaryHistory.uiSchema,
          schema: militaryHistory.schema,
          onContinue: captureEvents.militaryHistory,
          appStateSelector: state => ({
            dob: state.user.profile.dob,
            isBDD: state.form.data?.['view:isBddData'],
            servicePeriods:
              state.form.data?.serviceInformation?.servicePeriods || [],
          }),
        },
        reservesNationalGuardService: {
          title: 'Reserve and National Guard service',
          path:
            'review-veteran-details/military-service-history/reserves-national-guard',
          depends: formData =>
            hasGuardOrReservePeriod(formData.serviceInformation),
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
          appStateSelector: state => ({
            servicePeriods:
              state.form.data?.serviceInformation?.servicePeriods || [],
          }),
        },
        separationLocation: {
          title: 'Separation location',
          path: 'review-veteran-details/separation-location',
          depends: showSeparationLocation,
          uiSchema: separationLocation.uiSchema,
          schema: separationLocation.schema,
        },
        separationPay: {
          title: SEPARATION_PAY_SECTION_TITLE,
          path: 'separation-pay',
          depends: formData =>
            !hasRatedDisabilities(formData) && showNewlyBDDPages(formData),
          uiSchema: separationPay.uiSchema,
          schema: separationPay.schema,
        },
        retirementPay: {
          title: 'Retirement pay',
          path: 'retirement-pay',
          depends: formData =>
            !hasRatedDisabilities(formData) && showNewlyBDDPages(formData),
          uiSchema: retirementPay.uiSchema,
          schema: retirementPay.schema,
        },
        trainingPay: {
          title: 'Training pay',
          path: 'training-pay',
          depends: formData =>
            !hasRatedDisabilities(formData) && showNewlyBDDPages(formData),
          uiSchema: trainingPay.uiSchema,
          schema: trainingPay.schema,
        },
      },
    },
    disabilities: {
      title: 'Conditions',
      pages: {
        ...gatePages(disabilityBenefitsWorkflow, isNewConditionsOff),
        ...gatePages(disabilityConditionsWorkflow, isNewConditionsOn),

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
          title: formData =>
            typeof formData.condition === 'string'
              ? capitalizeEachWord(formData.condition)
              : NULL_CONDITION_STRING,
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
        ptsdBypassCombat: {
          title: 'PTSD combat',
          path: 'new-disabilities/ptsd-combat',
          depends: showPtsdCombat,
          uiSchema: ptsdBypassCombat.uiSchema,
          schema: ptsdBypassCombat.schema,
        },
        ptsdBypassNonCombat: {
          title: 'PTSD non-combat',
          path: 'new-disabilities/ptsd-non-combat',
          depends: showPtsdNonCombat,
          uiSchema: ptsdBypassNonCombat.uiSchema,
          schema: ptsdBypassNonCombat.schema,
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
          schema: { type: 'object', properties: {} },
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
        ...toxicExposurePages,
        prisonerOfWar: {
          title: 'Prisoner of war (POW)',
          path: 'pow',
          depends: formData =>
            !isBDD(formData) && hasRealNewOrSecondaryConditions(formData),
          uiSchema: prisonerOfWar.uiSchema,
          schema: prisonerOfWar.schema,
          appStateSelector: state => ({
            serviceInformation: state.form?.data?.serviceInformation,
          }),
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
                'Do you want to answer questions to determine if you may be eligible for additional benefits?',
              'ui:widget': 'yesNo',
            },
            'ui:confirmationField': ConfirmationAncillaryFormsWizard,
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
          title: 'Summary of conditions',
          path: 'disabilities/summary',
          depends: isNewConditionsOff,
          uiSchema: summaryOfDisabilities.uiSchema,
          schema: summaryOfDisabilities.schema,
        },
      },
    },
    mentalHealth: {
      title: 'Mental health statement',
      path: 'mental-health-form-0781',
      pages: {
        ...form0781PagesConfig,
      },
    },
    supportingEvidence: {
      title: 'Supporting evidence',
      pages: {
        orientation: {
          title: '',
          path: 'supporting-evidence/orientation',
          uiSchema: {
            'ui:title': standardTitle(
              'Supporting evidence for your disability claim',
            ),
            'ui:description': supportingEvidenceOrientation,
          },
          schema: { type: 'object', properties: {} },
        },
        serviceTreatmentRecords: {
          title: 'Service treatment records',
          path: 'supporting-evidence/service-treatment-records',
          depends: formData => isBDD(formData),
          uiSchema: serviceTreatmentRecords.uiSchema,
          schema: serviceTreatmentRecords.schema,
        },
        serviceTreatmentRecordsAttachments: {
          title: 'Service treatment records upload',
          path: 'supporting-evidence/service-treatment-records-upload',
          depends: formData => isUploadingSTR(formData),
          uiSchema: serviceTreatmentRecordsAttachments.uiSchema,
          schema: serviceTreatmentRecordsAttachments.schema,
        },
        evidenceTypes: {
          title: 'Types of supporting evidence',
          path: 'supporting-evidence/evidence-types',
          depends: formData =>
            !isBDD(formData) && !isEvidenceEnhancement(formData),
          updateFormData: evidenceTypes.updateFormData,
          uiSchema: evidenceTypes.uiSchema,
          schema: evidenceTypes.schema,
        },
        evidenceRequest: {
          title: 'Medical records that support your disability claim',
          path: 'supporting-evidence/evidence-request',
          depends: formData =>
            !isBDD(formData) && isEvidenceEnhancement(formData),
          CustomPage: EvidenceRequestPage,
          CustomPageReview: null,
          uiSchema: evidenceRequest.uiSchema,
          schema: evidenceRequest.schema,
        },
        medicalRecords: {
          title: 'Types of medical records',
          path: 'supporting-evidence/medical-records',
          depends: formData =>
            !isBDD(formData) &&
            isEvidenceEnhancement(formData) &&
            hasMedicalRecords(formData),
          updateFormData: medicalRecords.updateFormData,
          uiSchema: medicalRecords.uiSchema,
          schema: medicalRecords.schema,
        },
        evidenceTypesBDD: {
          title: 'Types of supporting evidence for BDD',
          path: 'supporting-evidence/evidence-types-bdd',
          depends: formData => isBDD(formData),
          uiSchema: evidenceTypesBDD.uiSchema,
          schema: evidenceTypesBDD.schema,
        },
        vaMedicalRecords: {
          title: 'VA medical records',
          path: 'supporting-evidence/va-medical-records',
          depends: formData => hasVAEvidence(formData),
          uiSchema: vaMedicalRecords.uiSchema,
          schema: vaMedicalRecords.schema,
        },
        privateMedicalRecords: {
          title: 'Options for providing non-VA treatment records',
          path: 'supporting-evidence/private-medical-records',
          depends: hasPrivateEvidence,
          uiSchema: privateMedicalRecords.uiSchema,
          schema: privateMedicalRecords.schema,
        },
        privateMedicalRecordsAttachments: {
          title: 'Non-VA treatment records',
          path: 'supporting-evidence/private-medical-records-upload',
          depends: formData =>
            hasPrivateEvidence(formData) &&
            !isNotUploadingPrivateMedical(formData),
          uiSchema: privateMedicalRecordsAttachments.uiSchema,
          schema: privateMedicalRecordsAttachments.schema,
        },
        // 2024 authorization
        privateMedicalAuthorizeRelease: {
          title: 'Authorization to release non-VA treatment records to VA',
          path: 'supporting-evidence/private-medical-records-authorize-release',
          depends: formData =>
            hasPrivateEvidence(formData) &&
            isNotUploadingPrivateMedical(formData) &&
            isCompletingModern4142(formData),
          CustomPage: PrivateRecordsAuthorization,
          CustomPageReview: null,
          uiSchema: privateMedicalAuthorizeRelease.uiSchema,
          schema: privateMedicalAuthorizeRelease.schema,
        },
        // PMR Facilities Page
        privateMedicalRecordsRelease: {
          title:
            'Option to limit consent to retrieve information from treatment providers',
          path: 'supporting-evidence/private-medical-records-release',
          depends: formData =>
            hasPrivateEvidence(formData) &&
            isNotUploadingPrivateMedical(formData),
          uiSchema: {
            ...privateMedicalRecordsRelease.uiSchema,
            providerFacility: {
              ...privateMedicalRecordsRelease.uiSchema.providerFacility,
              'ui:title': 'Non-VA treatment provider details',
            },
          },
          schema: privateMedicalRecordsRelease.schema,
        },
        evidenceChoiceIntro: {
          title:
            'Supporting documents and additional forms for your disability claim',
          depends: formData =>
            formData.disability526SupportingEvidenceEnhancement,
          // TODO: update this path to `'supporting-evidence/additional-evidence', once we can get rid of `additionalDocuments` page
          path: 'supporting-evidence/additional-evidence-intro',
          uiSchema: evidenceChoiceIntro.uiSchema,
          schema: evidenceChoiceIntro.schema,
        },
        evidenceChoiceAdditionalDocuments: {
          title: 'Non-VA treatment records you uploaded',
          // NOTE: a temporary copy of `additionalDocuments` for testing purposes
          path: 'supporting-evidence/additional-evidence-enhancement',
          depends: formData =>
            hasEvidenceChoice(formData) &&
            formData.disability526SupportingEvidenceEnhancement,
          uiSchema: additionalDocuments.uiSchema,
          schema: additionalDocuments.schema,
        },
        additionalDocuments: {
          title: 'Non-VA treatment records you uploaded',
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
        paymentInformation: {
          title: 'Payment information',
          path: 'payment-information',
          uiSchema: paymentInformation.uiSchema,
          schema: paymentInformation.schema,
          onContinue: captureEvents.paymentInformation,
        },
        vaEmployee: {
          title: 'VA employee',
          path: 'va-employee',
          uiSchema: vaEmployee.uiSchema,
          schema: vaEmployee.schema,
        },
        retirementPayWaiver: {
          title: 'Retirement pay waiver',
          path: 'retirement-pay-waiver',
          depends: formData =>
            hasMilitaryRetiredPay(formData) &&
            !hasRatedDisabilities(formData) &&
            showNewlyBDDPages(formData),
          uiSchema: retirementPayWaiver.uiSchema,
          schema: retirementPayWaiver.schema,
        },
        trainingPayWaiver: {
          title: 'Training pay waiver',
          path: 'training-pay-waiver',
          depends: formData =>
            formData.hasTrainingPay &&
            !hasRatedDisabilities(formData) &&
            showNewlyBDDPages(formData),
          uiSchema: trainingPayWaiver.uiSchema,
          schema: trainingPayWaiver.schema,
        },
        fullyDevelopedClaim: {
          title: 'Fully developed claim program',
          path: 'fully-developed-claim',
          uiSchema: fullyDevelopedClaim.uiSchema,
          schema: fullyDevelopedClaim.schema,
          depends: formData => !isBDD(formData),
        },
      },
    },
  },
};

export default formConfig;
