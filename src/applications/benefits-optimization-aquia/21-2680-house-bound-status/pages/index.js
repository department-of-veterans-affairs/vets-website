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
export {
  default as identificationInformation,
} from './identification-information';

/** @exports {PageSchema} mailingAddress - Mailing address page */
export { default as mailingAddress } from './mailing-address';

/** @exports {PageSchema} nameAndDateOfBirth - Name and DOB page */
export { default as nameAndDateOfBirth } from './name-and-date-of-birth';

/** @exports {PageSchema} phoneAndEmailAddress - Contact information page */
export { default as phoneAndEmailAddress } from './phone-and-email-address';
