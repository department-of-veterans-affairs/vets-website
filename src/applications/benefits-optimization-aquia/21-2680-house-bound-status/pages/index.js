/**
 * @module pages/index
 * @description Barrel export file for form page configurations
 */

// Benefit Selection
export { default as BenefitTypePage } from './benefit-type';

// Section I - Veteran Information
export { default as VeteranIdentityPage } from './veteran-identity';

// Section II - Claimant Information
export { default as ClaimantIdentityPage } from './claimant-identity';

// Section IV - Hospitalization
export { default as HospitalizationPage } from './hospitalization';

// Section V - Claimant Signature
export { default as ClaimantSignaturePage } from './claimant-signature';

// Section VI - Medical Examiner
export {
  default as ExaminerIdentificationPage,
} from './examiner-identification';
export { default as MedicalDiagnosisPage } from './medical-diagnosis';

// Section VII - Functional Assessment
export { default as ADLAssessmentPage } from './adl-assessment';
export { default as FunctionalLimitationsPage } from './functional-limitations';

// Section VIII - Narrative Assessment
export { default as NarrativeAssessmentPage } from './narrative-assessment';
export { default as ExaminerSignaturePage } from './examiner-signature';
