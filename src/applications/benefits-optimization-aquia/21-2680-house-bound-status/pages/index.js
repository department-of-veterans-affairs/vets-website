/**
 * @module pages/index
 * @description Barrel export file for form page configurations
 */

export { BenefitTypePage } from './benefit-type';
export { VeteranIdentityPage } from './veteran-identity';
export { ClaimantIdentityPage } from './claimant-identity';
export { HospitalizationPage } from './hospitalization';
export { ClaimantSignaturePage } from './claimant-signature';
export { ExaminerIdentificationPage } from './examiner-identification';
export { MedicalDiagnosisPage } from './medical-diagnosis';
export { ADLAssessmentPage } from './adl-assessment';
export { FunctionalLimitationsPage } from './functional-limitations';
export { NarrativeAssessmentPage } from './narrative-assessment';
export { ExaminerSignaturePage } from './examiner-signature';

/** @exports {PageSchema} identificationInformation - SSN/VA file number page */
export { identificationInformation } from './identification-information';

/** @exports {PageSchema} mailingAddress - Mailing address page */
export { mailingAddress } from './mailing-address';

/** @exports {PageSchema} nameAndDateOfBirth - Name and DOB page */
export { nameAndDateOfBirth } from './name-and-date-of-birth';

/** @exports {PageSchema} phoneAndEmailAddress - Contact information page */
export { phoneAndEmailAddress } from './phone-and-email-address';

// Section V - Claimant Signature
export {
  default as ClaimantSignaturePage,
} from '@bio-aquia/21-2680-house-bound-status/pages/claimant-signature';

// Section VI - Medical Examiner
export {
  default as ExaminerIdentificationPage,
} from '@bio-aquia/21-2680-house-bound-status/pages/examiner-identification';
export {
  default as MedicalDiagnosisPage,
} from '@bio-aquia/21-2680-house-bound-status/pages/medical-diagnosis';

// Section VII - Functional Assessment
export {
  default as ADLAssessmentPage,
} from '@bio-aquia/21-2680-house-bound-status/pages/adl-assessment';
export {
  default as FunctionalLimitationsPage,
} from '@bio-aquia/21-2680-house-bound-status/pages/functional-limitations';

// Section VIII - Narrative Assessment
export {
  default as NarrativeAssessmentPage,
} from '@bio-aquia/21-2680-house-bound-status/pages/narrative-assessment';
export {
  default as ExaminerSignaturePage,
} from '@bio-aquia/21-2680-house-bound-status/pages/examiner-signature';
